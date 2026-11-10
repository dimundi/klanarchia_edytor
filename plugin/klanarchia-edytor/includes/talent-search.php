<?php
if(!defined('ABSPATH'))exit;
function ke_talent_search_plain($text){
 for($i=0;$i<10&&preg_match('/\[[a-z][a-z0-9_-]*:\s*[^\[\]]*\]/u',$text);$i++)$text=preg_replace('/\[[a-z][a-z0-9_-]*:\s*([^\[\]]*)\]/u','$1',$text);
 return trim(preg_replace('/[\p{Z}\s]+/u',' ',str_replace(['**','*'],'',$text)));
}
function ke_talent_search_fold($text){return mb_strtolower(remove_accents(ke_talent_search_plain($text)),'UTF-8');}
function ke_talent_search($r){
 global $wpdb;ke_talents_ready();$lang=ke_api_language($r);$q=$r->get_param('q')??'';ke_require_value(is_string($q)&&mb_strlen($q)<=120&&!preg_match('/[\x00-\x1f]/',$q),'Invalid search query');$query=ke_talent_search_fold($q);$scope=$r->get_param('category');if($scope!==null&&$scope!=='')$scope=ke_uuid($scope);else$scope=null;$content=$r->get_param('content')==='1';$status=$r->get_param('status')??'';$errors=$r->get_param('errors')??'';ke_require_value(in_array($status,['','dev','toCheck','approved','delete'],true),'Invalid status filter');ke_require_value(in_array($errors,['','yes','no','pending'],true),'Invalid error filter');$page=max(1,(int)$r->get_param('page'));$size=20;
 ke_db_query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
 $rows=$wpdb->get_results($wpdb->prepare("SELECT t.code AS id,v.id AS currentVersionId,v.status,v.version_day,v.day_serial,COALESCE(x.name,pl.name,'') AS name,COALESCE(x.flavor_description,pl.flavor_description,'') AS flavor,COALESCE(x.description,pl.description,'') AS mechanics,c.uuid AS categoryId,p.uuid AS parentId,COALESCE(ct.name,cpl.name,'') AS subgroup,COALESCE(pt.name,ppl.name,'') AS category FROM ".ke_table('talents').' t JOIN '.ke_table('talent_versions').' v ON v.id=t.current_version_id JOIN '.ke_table('talent_categories').' c ON c.id=t.category_id LEFT JOIN '.ke_table('talent_categories').' p ON p.id=c.parent_id LEFT JOIN '.ke_table('talent_texts').' x ON x.talent_version_id=v.id AND x.language=%s LEFT JOIN '.ke_table('talent_texts')." pl ON pl.talent_version_id=v.id AND pl.language='pl' LEFT JOIN ".ke_table('talent_category_texts')." ct ON ct.category_id=c.id AND ct.language=%s LEFT JOIN ".ke_table('talent_category_texts')." cpl ON cpl.category_id=c.id AND cpl.language='pl' LEFT JOIN ".ke_table('talent_category_texts')." pt ON pt.category_id=p.id AND pt.language=%s LEFT JOIN ".ke_table('talent_category_texts')." ppl ON ppl.category_id=p.id AND ppl.language='pl' WHERE t.archived_at IS NULL ORDER BY name,t.code",$lang,$lang,$lang),ARRAY_A);
 $reports=ke_talent_reports(array_column($rows,'currentVersionId'),$lang);
 $matches=[];foreach($rows as$row){
  if($status!==''&&$row['status']!==$status)continue;$check=$reports[(int)$row['currentVersionId']];if($errors==='yes'&&$check['errorCount']===0)continue;if($errors==='no'&&($check['errorCount']>0||$check['status']!=='checked'))continue;if($errors==='pending'&&$check['status']==='checked')continue;
  if($scope&&$row['categoryId']!==$scope&&$row['parentId']!==$scope)continue;
  $version=ke_talent_version_code($row['id'],$row['version_day'],$row['day_serial']);$fields=['title'=>$row['name'],'code'=>$version];if($content){$fields['flavor']=$row['flavor'];$fields['mechanics']=$row['mechanics'];}$hit=$query===''?'title':null;foreach($fields as$key=>$value)if(mb_strpos(ke_talent_search_fold($value),$query)!==false){$hit=$key;break;}if($hit===null)continue;
  $text=ke_talent_search_plain($fields[$hit==='flavor'||$hit==='mechanics'?$hit:'title']);$position=mb_strpos(ke_talent_search_fold($text),$query);$start=max(0,($position===false?0:$position)-60);$snippet=($start>0?'…':'').mb_substr($text,$start,220).(mb_strlen($text)>$start+220?'…':'');
  $matches[]=['id'=>$row['id'],'name'=>$row['name'],'status'=>$row['status'],'category'=>$row['category'],'subgroup'=>$row['subgroup'],'versionCode'=>$version,'matchedField'=>$hit,'snippet'=>$snippet,'errorCount'=>$check['errorCount'],'checkStatus'=>$check['status']];
 }
 $pageItems=array_slice($matches,($page-1)*$size,$size);$templates=[];
 foreach($pageItems as&$item){$record=ke_talent_record($item['id'],$lang);if(!$record['hasTranslation'])$record['content']=ke_talent_record($item['id'],'pl')['content'];$templates[$record['template']['id']]=$record['template'];unset($record['template']);$item=array_merge($item,$record);}unset($item);
 ke_db_query('COMMIT');
 return ['query'=>trim($q),'total'=>count($matches),'page'=>$page,'pageSize'=>$size,'items'=>$pageItems,'templates'=>array_values($templates),'hasMore'=>count($matches)>$page*$size];
}
add_action('rest_api_init',function(){register_rest_route('klanarchia-editor/v1','/talents/search',['methods'=>'GET','permission_callback'=>'ke_can_access','callback'=>function($r){return ke_api_run('ke_talent_search',$r);}]);});
