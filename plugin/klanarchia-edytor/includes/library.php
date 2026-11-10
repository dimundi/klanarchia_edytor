<?php
if (!defined('ABSPATH')) exit;
function ke_migrate_library() {
 global $wpdb;
 if (get_option('ke_library_schema_version') === '1') return;
 require_once ABSPATH.'wp-admin/includes/upgrade.php';
 $charset=$wpdb->get_charset_collate();
 dbDelta('CREATE TABLE '.ke_table('talent_categories')." (
 id bigint unsigned NOT NULL AUTO_INCREMENT,
 uuid char(36) NOT NULL,
 parent_id bigint unsigned NULL,
 sort_order int NOT NULL DEFAULT 0,
 archived_at datetime NULL,
 created_at datetime NOT NULL,
 created_by bigint unsigned NOT NULL,
 PRIMARY KEY  (id),
 UNIQUE KEY uuid (uuid),
 KEY parent_id (parent_id)
 ) ENGINE=InnoDB $charset;");
 if ($wpdb->last_error) throw new RuntimeException('Category schema failed');
 dbDelta('CREATE TABLE '.ke_table('talent_category_texts')." (
 category_id bigint unsigned NOT NULL,
 language varchar(2) NOT NULL,
 name varchar(120) NOT NULL,
 PRIMARY KEY  (category_id,language)
 ) ENGINE=InnoDB $charset;");
 if ($wpdb->last_error) throw new RuntimeException('Category texts schema failed');
 foreach ([['talent_categories','parent_id'],['talent_category_texts','category_id']] as [$table,$column]) {
  $constraint='ke_'.substr(md5(ke_table($table).$column),0,20);
  if (!$wpdb->get_var($wpdb->prepare('SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME=%s AND CONSTRAINT_NAME=%s',ke_table($table),$constraint))) ke_db_query('ALTER TABLE '.ke_table($table).' ADD CONSTRAINT '.$constraint.' FOREIGN KEY ('.$column.') REFERENCES '.ke_table('talent_categories').'(id) ON DELETE RESTRICT');
 }
 update_option('ke_library_schema_version','1',false);
}
function ke_categories_get($r) {
 global $wpdb;
 if (get_option('ke_library_schema_version')!=='1') throw new KE_Request_Error('Run library migration first',503);
 $rows=$wpdb->get_results($wpdb->prepare('SELECT c.uuid AS id,p.uuid AS parentId,COALESCE(t.name,pl.name) AS name FROM '.ke_table('talent_categories').' c LEFT JOIN '.ke_table('talent_categories').' p ON p.id=c.parent_id LEFT JOIN '.ke_table('talent_category_texts').' t ON t.category_id=c.id AND t.language=%s LEFT JOIN '.ke_table('talent_category_texts')." pl ON pl.category_id=c.id AND pl.language='pl' WHERE c.archived_at IS NULL ORDER BY c.sort_order,c.id",ke_api_language($r)),ARRAY_A);
 $counts=[];
 if(in_array(get_option('ke_talents_schema_version'),['1','2','3'],true))foreach($wpdb->get_results('SELECT c.uuid,COUNT(t.id) AS total FROM '.ke_table('talent_categories').' c LEFT JOIN '.ke_table('talents').' t ON t.category_id=c.id AND t.archived_at IS NULL GROUP BY c.id,c.uuid',ARRAY_A) as $count)$counts[$count['uuid']]=(int)$count['total'];
 foreach($rows as &$row){$row['talentCount']=$counts[$row['id']]??0;foreach($rows as $child)if($child['parentId']===$row['id'])$row['talentCount']+=$counts[$child['id']]??0;}unset($row);
 return ['items'=>$rows];
}
function ke_category_create($name,$parent,$language) {
 global $wpdb;
 if (get_option('ke_library_schema_version')!=='1') throw new KE_Request_Error('Run library migration first',503);
 ke_require_value(is_string($name)&&trim($name)!==''&&mb_strlen($name)<=120);
 $name=trim($name);ke_db_query('START TRANSACTION');
 $wpdb->get_var('SELECT id FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');
 $parent_id=null;
 if ($parent!==null) {
  $row=$wpdb->get_row($wpdb->prepare('SELECT id,parent_id FROM '.ke_table('talent_categories').' WHERE uuid=%s AND archived_at IS NULL',ke_uuid($parent)),ARRAY_A);
  if (!$row || $row['parent_id']!==null) throw new KE_Request_Error('Choose a top-level group',400);
  $parent_id=(int)$row['id'];
 }
 $siblings=$wpdb->get_col($wpdb->prepare('SELECT t.name FROM '.ke_table('talent_categories').' c JOIN '.ke_table('talent_category_texts').' t ON t.category_id=c.id WHERE c.archived_at IS NULL AND c.parent_id <=> %s AND t.language=%s',$parent_id===null?null:$parent_id,$language));
 // NULL must be compared as SQL NULL, not an empty prepared string.
 if ($parent_id===null) $siblings=$wpdb->get_col($wpdb->prepare('SELECT t.name FROM '.ke_table('talent_categories').' c JOIN '.ke_table('talent_category_texts').' t ON t.category_id=c.id WHERE c.archived_at IS NULL AND c.parent_id IS NULL AND t.language=%s',$language));
 foreach ($siblings as $existing) if (mb_strtolower($existing)===mb_strtolower($name)) throw new KE_Request_Error('A group with this name already exists',409);
 $uuid=wp_generate_uuid4();
 ke_db_write('insert','talent_categories',['uuid'=>$uuid,'parent_id'=>$parent_id,'sort_order'=>(int)$wpdb->get_var('SELECT COALESCE(MAX(sort_order),0)+1 FROM '.ke_table('talent_categories')),'created_at'=>current_time('mysql',true),'created_by'=>get_current_user_id()]);
 ke_db_write('insert','talent_category_texts',['category_id'=>(int)$wpdb->insert_id,'language'=>$language,'name'=>$name]);
 ke_db_query('COMMIT');return ['id'=>$uuid,'parentId'=>$parent,'name'=>$name];
}
function ke_categories_post($r) { $b=$r->get_json_params();return ke_category_create($b['name']??null,$b['parentId']??null,ke_api_language($r)); }
function ke_category_delete($r){
 global $wpdb;
 if(get_option('ke_library_schema_version')!=='1')throw new KE_Request_Error('Run library migration first',503);
 $uuid=ke_uuid($r['uuid']);ke_db_query('START TRANSACTION');
 $wpdb->get_var('SELECT id FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');
 $row=$wpdb->get_row($wpdb->prepare('SELECT id,parent_id FROM '.ke_table('talent_categories').' WHERE uuid=%s AND archived_at IS NULL FOR UPDATE',$uuid),ARRAY_A);
 if(!$row)throw new KE_Request_Error('Subgroup not found',404);
 if($row['parent_id']===null)throw new KE_Request_Error('Only subgroups can be removed',400);
 if($wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('talent_categories').' WHERE parent_id=%d LIMIT 1',$row['id'])))throw new KE_Request_Error('Subgroup contains subgroups',409);
 if(in_array(get_option('ke_talents_schema_version'),['1','2','3'],true)&&$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('talents').' WHERE category_id=%d LIMIT 1',$row['id'])))throw new KE_Request_Error('Subgroup contains talents',409);
 ke_db_write('delete','talent_category_texts',['category_id'=>(int)$row['id']]);ke_db_write('delete','talent_categories',['id'=>(int)$row['id']]);
 ke_db_query('COMMIT');return ['id'=>$uuid,'deleted'=>true];
}
add_action('rest_api_init',function(){register_rest_route('klanarchia-editor/v1','/talent-categories/(?P<uuid>[a-fA-F0-9-]{36})',['methods'=>'DELETE','permission_callback'=>'ke_can_access','callback'=>function($r){return ke_api_run('ke_category_delete',$r);}]);});
add_action('rest_api_init',function(){foreach (['GET'=>'ke_categories_get','POST'=>'ke_categories_post'] as $method=>$callback) register_rest_route('klanarchia-editor/v1','/talent-categories',['methods'=>$method,'permission_callback'=>'ke_can_access','callback'=>function($r)use($callback){return ke_api_run($callback,$r);}]);});
if (defined('WP_CLI')&&WP_CLI) WP_CLI::add_command('ke library-init',function(){
 if (!ke_can_access()) WP_CLI::error('Administrator required');
 try {
 ke_migrate_library();global $wpdb;
 $names=['Talenty archetypów','Egzorcysta','Inkwizytor','Kronikarz','Rzecznik','Siepacz','Szabrownik','Wiedźmiarz','Żarmistrz','Żerca'];$parent=null;
 foreach($names as $i=>$name){
 $sql='SELECT c.uuid FROM '.ke_table('talent_categories').' c JOIN '.ke_table('talent_category_texts')." t ON t.category_id=c.id WHERE c.archived_at IS NULL AND t.language='pl' AND t.name=%s AND ";
 $sql.=$i===0?'c.parent_id IS NULL':'c.parent_id=(SELECT id FROM '.ke_table('talent_categories').' WHERE uuid=%s)';
 $id=$wpdb->get_var($i===0?$wpdb->prepare($sql,$name):$wpdb->prepare($sql,$name,$parent));
 if(!$id)$id=ke_category_create($name,$i===0?null:$parent,'pl')['id'];
 if($i===0)$parent=$id;
 }
 WP_CLI::success('Library ready: archetype group and nine subgroups.');
 }catch(Throwable $e){global $wpdb;$wpdb->query('ROLLBACK');WP_CLI::error($e->getMessage());}
});
