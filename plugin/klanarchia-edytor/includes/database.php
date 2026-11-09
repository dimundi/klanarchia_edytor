<?php
if (!defined('ABSPATH')) exit;
function ke_table($name) { global $wpdb; return $wpdb->prefix.'ke_'.$name; }
function ke_db_query($sql) { global $wpdb; $r = $wpdb->query($sql); if ($r === false) throw new RuntimeException('Database operation failed'); return $r; }
function ke_db_write($method, $table, $data, $where = null) { global $wpdb; $r = $where === null ? $wpdb->$method(ke_table($table), $data) : $wpdb->$method(ke_table($table), $data, $where); if ($r === false) throw new RuntimeException('Database write failed'); return $r; }
function ke_migrate() {
 global $wpdb;
 if (get_option('ke_schema_version') === '1') return;
 require_once ABSPATH.'wp-admin/includes/upgrade.php';
 $charset = $wpdb->get_charset_collate();
 $audit = "created_at datetime NOT NULL, updated_at datetime NOT NULL, created_by bigint unsigned NOT NULL, updated_by bigint unsigned NOT NULL, lock_version bigint unsigned NOT NULL DEFAULT 1";
 $schemas = [
 'catalogue_state' => "id bigint unsigned NOT NULL, lock_version bigint unsigned NOT NULL DEFAULT 0, PRIMARY KEY  (id)",
 'colours' => "id bigint unsigned NOT NULL AUTO_INCREMENT, uuid char(36) NOT NULL, rgb_r tinyint unsigned NOT NULL, rgb_g tinyint unsigned NOT NULL, rgb_b tinyint unsigned NOT NULL, cmyk_c decimal(5,2) NULL, cmyk_m decimal(5,2) NULL, cmyk_y decimal(5,2) NULL, cmyk_k decimal(5,2) NULL, sort_order int NOT NULL DEFAULT 0, archived_at datetime NULL, $audit, PRIMARY KEY  (id), UNIQUE KEY uuid (uuid)",
 'colour_texts' => "colour_id bigint unsigned NOT NULL, language varchar(2) NOT NULL, name varchar(80) NOT NULL, PRIMARY KEY  (colour_id,language)",
 'text_annotations' => "id bigint unsigned NOT NULL AUTO_INCREMENT, uuid char(36) NOT NULL, tag varchar(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL, text_colour_id bigint unsigned NULL, background_colour_id bigint unsigned NULL, font_weight smallint unsigned NOT NULL DEFAULT 400, italic tinyint unsigned NOT NULL DEFAULT 0, underline tinyint unsigned NOT NULL DEFAULT 0, small_caps tinyint unsigned NOT NULL DEFAULT 0, sort_order int NOT NULL DEFAULT 0, archived_at datetime NULL, $audit, PRIMARY KEY  (id), UNIQUE KEY uuid (uuid), UNIQUE KEY tag (tag), KEY text_colour_id (text_colour_id), KEY background_colour_id (background_colour_id)",
 'text_annotation_texts' => "annotation_id bigint unsigned NOT NULL, language varchar(2) NOT NULL, name varchar(80) NOT NULL, PRIMARY KEY  (annotation_id,language)",
 'templates' => "id bigint unsigned NOT NULL AUTO_INCREMENT, uuid char(36) NOT NULL, kind varchar(32) NOT NULL, name varchar(120) NOT NULL, current_version_id bigint unsigned NULL, published_version_id bigint unsigned NULL, archived_at datetime NULL, $audit, PRIMARY KEY  (id), UNIQUE KEY uuid (uuid), KEY kind_archived (kind,archived_at)",
 'template_versions' => "id bigint unsigned NOT NULL AUTO_INCREMENT, template_id bigint unsigned NOT NULL, version_no bigint unsigned NOT NULL, schema_version int unsigned NOT NULL, document longtext NOT NULL, created_at datetime NOT NULL, created_by bigint unsigned NOT NULL, PRIMARY KEY  (id), UNIQUE KEY template_version (template_id,version_no)"
 ];
 foreach ($schemas as $name => $body) { $body = str_replace(', ', ",\n", $body); dbDelta('CREATE TABLE '.ke_table($name)." (\n$body\n) ENGINE=InnoDB $charset;"); if ($wpdb->last_error) throw new RuntimeException('Schema update failed'); if (!$wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like(ke_table($name))))) throw new RuntimeException('Missing table'); }
 foreach ([['colour_texts','colour_id','colours'], ['text_annotations','text_colour_id','colours'], ['text_annotations','background_colour_id','colours'], ['text_annotation_texts','annotation_id','text_annotations'], ['template_versions','template_id','templates']] as [$from,$column,$to]) {
  $constraint = 'ke_'.substr(md5(ke_table($from).$column),0,20);
  $exists = $wpdb->get_var($wpdb->prepare('SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = %s AND CONSTRAINT_NAME = %s', ke_table($from), $constraint));
  if (!$exists) ke_db_query('ALTER TABLE '.ke_table($from).' ADD CONSTRAINT '.$constraint.' FOREIGN KEY ('.$column.') REFERENCES '.ke_table($to).'(id) ON DELETE RESTRICT');
 }
 ke_db_query('INSERT IGNORE INTO '.ke_table('catalogue_state').' (id,lock_version) VALUES (1,0)');
 update_option('ke_schema_version','1',false);
}
if (defined('WP_CLI') && WP_CLI) WP_CLI::add_command('ke migrate', function () { try { ke_migrate(); WP_CLI::success('Klanarchia schema version 1 ready.'); } catch (Throwable $e) { WP_CLI::error('Migration failed; inspect database and rerun.'); } });
function ke_seed_catalogue() {
 global $wpdb;
 if (get_option('ke_schema_version') !== '1') throw new RuntimeException('Run migration first');
 if ((int)$wpdb->get_var('SELECT lock_version FROM '.ke_table('catalogue_state').' WHERE id=1') !== 0) return;
 $colour=wp_generate_uuid4();$annotations=[];$names=[];
 foreach ([['cecha','Cecha','Trait',700,true,false,''],['aspekt','Aspekt','Aspect',400,false,false,$colour],['stan','Stan','State',600,false,true,''],['**','Pogrubienie','Bold',700,false,false,''],['*','Kursywa','Italic',400,true,false,'']] as [$tag,$pl,$en,$weight,$italic,$caps,$background]) {
  $id=wp_generate_uuid4();$names[$id]=$en;$annotations[]=['id'=>$id,'name'=>$pl,'tag'=>$tag,'colourId'=>'','backgroundId'=>$background,'weight'=>$weight,'bold'=>$weight===700,'italic'=>$italic,'underline'=>false,'smallCaps'=>$caps];
 }
 $request=new WP_REST_Request('PUT');$request->set_param('language','pl');$request->set_header('Content-Type','application/json');$request->set_body(wp_json_encode(['revision'=>0,'data'=>['version'=>2,'colours'=>[['id'=>$colour,'name'=>'Tło aspektu','value'=>'#b1b7c6','cmyk'=>null]],'annotations'=>$annotations]]));
 ke_catalogue_put($request);
 $id=$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('colours').' WHERE uuid=%s',$colour));ke_db_write('replace','colour_texts',['colour_id'=>$id,'language'=>'en','name'=>'Aspect background']);
 foreach ($names as $uuid=>$en) { $id=$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('text_annotations').' WHERE uuid=%s',$uuid));ke_db_write('replace','text_annotation_texts',['annotation_id'=>$id,'language'=>'en','name'=>$en]); }
}
if (defined('WP_CLI') && WP_CLI) WP_CLI::add_command('ke seed', function () { try { if (!ke_can_access()) WP_CLI::error('Use --user with an administrator account.');ke_seed_catalogue(); ke_add_base_colours(); ke_seed_text_colours(); WP_CLI::success('Initial catalogue ready; existing catalogue was not replaced.'); } catch (Throwable $e) { WP_CLI::error('Could not create initial catalogue.'); } });
function ke_add_base_colours() {
 global $wpdb;
 if (get_option('ke_schema_version') !== '1') throw new RuntimeException('Run migration first');
 ke_db_query('START TRANSACTION');$wpdb->get_var('SELECT lock_version FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');$changed=false;$now=current_time('mysql',true);$actor=get_current_user_id();
 foreach ([['3e507400-0000-4000-8000-000000000001','Błękit Zmroku','Dusk Blue','#3e5074',null],['00000000-0000-4000-8000-000000000002','Czarny','Black','#000000',[0,0,0,100]],['ffffff00-0000-4000-8000-000000000003','Biały','White','#ffffff',[0,0,0,0]]] as [$uuid,$pl,$en,$rgb,$cmyk]) {
  if ($wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('colours').' WHERE uuid=%s',$uuid))) continue;
  $order=(int)$wpdb->get_var('SELECT COALESCE(MAX(sort_order),0)+1 FROM '.ke_table('colours'));
  ke_db_write('insert','colours',['uuid'=>$uuid,'rgb_r'=>hexdec(substr($rgb,1,2)),'rgb_g'=>hexdec(substr($rgb,3,2)),'rgb_b'=>hexdec(substr($rgb,5,2)),'cmyk_c'=>$cmyk[0] ?? null,'cmyk_m'=>$cmyk[1] ?? null,'cmyk_y'=>$cmyk[2] ?? null,'cmyk_k'=>$cmyk[3] ?? null,'sort_order'=>$order,'created_at'=>$now,'updated_at'=>$now,'created_by'=>$actor,'updated_by'=>$actor,'lock_version'=>1]);$id=(int)$wpdb->insert_id;
  foreach (['pl'=>$pl,'en'=>$en] as $language=>$name) { $base=$name;$n=2;while ($wpdb->get_var($wpdb->prepare('SELECT colour_id FROM '.ke_table('colour_texts').' WHERE language=%s AND name=%s',$language,$name))) $name=$base.' '.$n++;ke_db_write('replace','colour_texts',['colour_id'=>$id,'language'=>$language,'name'=>$name]); }$changed=true;
 }
 if ($changed) ke_db_query('UPDATE '.ke_table('catalogue_state').' SET lock_version=lock_version+1 WHERE id=1');ke_db_query('COMMIT');
}
if (defined('WP_CLI') && WP_CLI) WP_CLI::add_command('ke base-colours',function () { try { if (!ke_can_access()) WP_CLI::error('Use --user with an administrator account.');ke_add_base_colours();WP_CLI::success('Base colours ready; existing colours were not replaced.'); } catch (Throwable $e) { global $wpdb;$wpdb->query('ROLLBACK');WP_CLI::error('Could not add base colours.'); } });
function ke_seed_text_colours() {
 global $wpdb;if(get_option('ke_schema_version')!=='1')throw new RuntimeException('Run migration first');
 ke_db_query('START TRANSACTION');$wpdb->get_var('SELECT lock_version FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');$now=current_time('mysql',true);$actor=get_current_user_id();$changed=false;
 $map=get_option('ke_legacy_text_colour_map',[]);$map['#181818']='00000000-0000-4000-8000-000000000002';$map['#403466']='3e507400-0000-4000-8000-000000000001';$requested=[];
 foreach($wpdb->get_col('SELECT document FROM '.ke_table('template_versions')) as $raw){$document=json_decode($raw,true);foreach(($document['styles']??[]) as $style){$hex=strtolower($style['color']??'');if(preg_match('/^#[0-9a-f]{6}$/D',$hex)&&!isset($requested[$hex])&&!in_array($hex,['#181818','#403466'],true))$requested[$hex]=[null,'Kolor tekstu '.strtoupper($hex),'Text colour '.strtoupper($hex)];}}
 foreach($requested as $hex=>[$fixed,$pl,$en]){
  $existing=$fixed?$wpdb->get_row($wpdb->prepare('SELECT id,uuid FROM '.ke_table('colours').' WHERE uuid=%s',$fixed),ARRAY_A):null;
  if(!$fixed&&!$existing)$existing=$wpdb->get_row($wpdb->prepare('SELECT id,uuid FROM '.ke_table('colours').' WHERE rgb_r=%d AND rgb_g=%d AND rgb_b=%d AND archived_at IS NULL LIMIT 1',hexdec(substr($hex,1,2)),hexdec(substr($hex,3,2)),hexdec(substr($hex,5,2))),ARRAY_A);
  if(!$existing){$uuid=$fixed?:wp_generate_uuid4();ke_db_write('insert','colours',['uuid'=>$uuid,'rgb_r'=>hexdec(substr($hex,1,2)),'rgb_g'=>hexdec(substr($hex,3,2)),'rgb_b'=>hexdec(substr($hex,5,2)),'sort_order'=>(int)$wpdb->get_var('SELECT COALESCE(MAX(sort_order),0)+1 FROM '.ke_table('colours')),'created_at'=>$now,'updated_at'=>$now,'created_by'=>$actor,'updated_by'=>$actor,'lock_version'=>1]);$id=(int)$wpdb->insert_id;foreach(['pl'=>$pl,'en'=>$en] as $lang=>$name){$base=$name;$n=2;while($wpdb->get_var($wpdb->prepare('SELECT colour_id FROM '.ke_table('colour_texts').' WHERE language=%s AND name=%s',$lang,$name)))$name=$base.' '.$n++;ke_db_write('replace','colour_texts',['colour_id'=>$id,'language'=>$lang,'name'=>$name]);}$changed=true;}else $uuid=$existing['uuid'];$map[$hex]=$uuid;
 }
 update_option('ke_legacy_text_colour_map',$map,false);if($changed)ke_db_query('UPDATE '.ke_table('catalogue_state').' SET lock_version=lock_version+1 WHERE id=1');ke_db_query('COMMIT');
}
if(defined('WP_CLI')&&WP_CLI)WP_CLI::add_command('ke text-colours',function(){try{if(!ke_can_access())WP_CLI::error('Administrator required');ke_seed_text_colours();WP_CLI::success('Text colours ready; existing colours retained.');}catch(Throwable $e){global $wpdb;$wpdb->query('ROLLBACK');WP_CLI::error('Could not register text colours.');}});