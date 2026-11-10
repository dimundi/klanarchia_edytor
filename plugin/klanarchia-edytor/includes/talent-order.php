<?php
if(!defined('ABSPATH'))exit;
function ke_migrate_talent_order(){
 global $wpdb;
 if(get_option('ke_talents_schema_version')==='5')return;
 if(get_option('ke_talents_schema_version')!=='4')throw new RuntimeException('Initialize current talent templates first');
 if(!in_array('sort_order',$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talents')),true))ke_db_query('ALTER TABLE '.ke_table('talents').' ADD sort_order int unsigned NOT NULL DEFAULT 0');
 if(!$wpdb->get_var("SHOW INDEX FROM ".ke_table('talents')." WHERE Key_name='category_order'"))ke_db_query('ALTER TABLE '.ke_table('talents').' ADD KEY category_order (category_id,sort_order,id)');
 ke_db_query('START TRANSACTION');
 try{
  $wpdb->get_var('SELECT id FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');
  $sources=[];$batches=[];
  foreach($wpdb->get_results("SELECT talent_id,id,changes FROM ".ke_table('talent_events')." WHERE action IN ('import_pdf','import_legacy') ORDER BY id",ARRAY_A)as$event){
   $source=json_decode($event['changes'],true)['source']??[];$position=$source['page']??$source['index']??null;
   if(!is_numeric($position)||isset($sources[$event['talent_id']]))continue;
   $batch=$source['sha256']??$source['file']??'import';$batches[$batch]=$batches[$batch]??(int)$event['id'];
   $sources[$event['talent_id']]=[$batches[$batch],(int)$position,(int)$event['id']];
  }
  $groups=[];foreach($wpdb->get_results('SELECT id,category_id FROM '.ke_table('talents').' WHERE archived_at IS NULL ORDER BY id',ARRAY_A)as$row)$groups[$row['category_id']][]=$row;
  foreach($groups as$rows){
   usort($rows,function($a,$b)use($sources){$x=$sources[$a['id']]??[PHP_INT_MAX,(int)$a['id'],0];$y=$sources[$b['id']]??[PHP_INT_MAX,(int)$b['id'],0];return $x<=>$y;});
   foreach($rows as$i=>$row)ke_db_write('update','talents',['sort_order'=>$i+1],['id'=>(int)$row['id']]);
  }
  update_option('ke_talents_schema_version','5',false);ke_db_query('COMMIT');
 }catch(Throwable $e){$wpdb->query('ROLLBACK');throw $e;}
}
// Called inside the catalogue lock and the talent-save transaction.
function ke_assign_talent_order($id,$oldCategory,$newCategory,$requested){
 global $wpdb;$moves=[];$target=1;
 foreach(array_unique(array_filter([$oldCategory,$newCategory]))as$category){
  $rows=$wpdb->get_results($wpdb->prepare('SELECT id,code,sort_order FROM '.ke_table('talents').' WHERE category_id=%d AND archived_at IS NULL ORDER BY sort_order,id',$category),ARRAY_A);
  $ids=[];$lookup=[];foreach($rows as$row){$lookup[(int)$row['id']]=$row;if((int)$row['id']!==$id)$ids[]=(int)$row['id'];}
  if((int)$category===$newCategory){
   $oldPosition=$oldCategory===$newCategory&&isset($lookup[$id])?(int)$lookup[$id]['sort_order']:null;
   $target=max(1,min(count($ids)+1,$requested??($oldPosition?:count($ids)+1)));
   array_splice($ids,$target-1,0,[$id]);
  }
  foreach($ids as$i=>$talentId){
   if(!isset($lookup[$talentId])||(int)$lookup[$talentId]['sort_order']!==$i+1){
    ke_db_write('update','talents',['sort_order'=>$i+1],['id'=>$talentId]);
    if($talentId!==$id)$moves[]=['id'=>$lookup[$talentId]['code'],'from'=>(int)$lookup[$talentId]['sort_order'],'to'=>$i+1];
   }
  }
 }
 return ['position'=>$target,'shifted'=>$moves];
}
if(defined('WP_CLI')&&WP_CLI)WP_CLI::add_command('ke talent-order-init',function(){if(!ke_can_access())WP_CLI::error('Administrator required');try{ke_migrate_talent_order();WP_CLI::success('Subgroup order ready.');}catch(Throwable $e){WP_CLI::error($e->getMessage());}});
