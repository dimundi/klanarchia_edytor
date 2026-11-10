<?php
if(!defined('ABSPATH'))exit;
function ke_normalize_talent_name($name){
 $name=mb_strtolower(remove_accents($name),'UTF-8');
 return trim(preg_replace('/[^\p{L}\p{N}]+/u',' ',$name));
}
function ke_talent_name_similarity($a,$b){
 $length=max(mb_strlen($a),mb_strlen($b));$min=min(mb_strlen($a),mb_strlen($b));
 if($a===$b||$min<5||abs(mb_strlen($a)-mb_strlen($b))>3)return null;
 $distance=levenshtein($a,$b);$limit=$length<9?1:($length<25?2:3);
 return $distance<=$limit&&$distance/$length<=.16?['distance'=>$distance,'similarity'=>(int)round((1-$distance/$length)*100)]:null;
}
function ke_talent_names_audit($r){
 global $wpdb;ke_talents_ready();$lang=ke_api_language($r);
 $rows=$wpdb->get_results($wpdb->prepare("SELECT t.code AS id,v.status,COALESCE(x.name,pl.name,'') AS name,COALESCE(ct.name,cpl.name,'') AS subgroup,COALESCE(pt.name,ppl.name,'') AS category FROM ".ke_table('talents').' t JOIN '.ke_table('talent_versions').' v ON v.id=t.current_version_id JOIN '.ke_table('talent_categories').' c ON c.id=t.category_id LEFT JOIN '.ke_table('talent_categories').' p ON p.id=c.parent_id LEFT JOIN '.ke_table('talent_texts').' x ON x.talent_version_id=v.id AND x.language=%s LEFT JOIN '.ke_table('talent_texts')." pl ON pl.talent_version_id=v.id AND pl.language='pl' LEFT JOIN ".ke_table('talent_category_texts')." ct ON ct.category_id=c.id AND ct.language=%s LEFT JOIN ".ke_table('talent_category_texts')." cpl ON cpl.category_id=c.id AND cpl.language='pl' LEFT JOIN ".ke_table('talent_category_texts')." pt ON pt.category_id=p.id AND pt.language=%s LEFT JOIN ".ke_table('talent_category_texts')." ppl ON ppl.category_id=p.id AND ppl.language='pl' WHERE t.archived_at IS NULL ORDER BY t.code",$lang,$lang,$lang),ARRAY_A);
 $buckets=[];$unnamed=[];foreach($rows as$row){$key=ke_normalize_talent_name($row['name']);if($key===''){$unnamed[]=$row;continue;}$buckets[$key][]=$row;}
 ksort($buckets,SORT_STRING);$identical=[];foreach($buckets as$key=>$entries)if(count($entries)>1)$identical[]=['name'=>$key,'talents'=>$entries];
 $keys=array_keys($buckets);$similar=[];for($i=0;$i<count($keys);$i++)for($j=$i+1;$j<count($keys);$j++){
  $match=ke_talent_name_similarity($keys[$i],$keys[$j]);if($match)$similar[]=array_merge($match,['talents'=>array_merge($buckets[$keys[$i]],$buckets[$keys[$j]])]);
 }
 usort($similar,fn($a,$b)=>$b['similarity']<=>$a['similarity']);
 return ['checkedAt'=>gmdate('c'),'total'=>count($rows),'named'=>count($rows)-count($unnamed),'identical'=>$identical,'similar'=>$similar,'unnamed'=>$unnamed];
}
add_action('rest_api_init',function(){register_rest_route('klanarchia-editor/v1','/talents/name-audit',['methods'=>'GET','permission_callback'=>'ke_can_access','callback'=>function($r){return ke_api_run('ke_talent_names_audit',$r);}]);});
