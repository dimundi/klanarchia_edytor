<?php
if(!defined('ABSPATH'))exit;
function ke_validate_editorial_notes($value){
 ke_require_value(is_array($value)&&count($value)<=2,'Invalid notes');$out=[];
 foreach($value as$lang=>$notes){ke_require_value(in_array($lang,['pl','en'],true)&&is_array($notes)&&array_is_list($notes)&&count($notes)<=50,'Invalid notes language/list');$ids=[];$out[$lang]=[];
  foreach($notes as$note){ke_require_value(is_array($note),'Invalid note');$id=$note['id']??null;ke_require_value(is_string($id)&&preg_match('/^[a-zA-Z0-9-]{1,64}$/D',$id)&&!isset($ids[$id]),'Invalid note ID');$ids[$id]=true;$level=$note['level']??null;ke_require_value(in_array($level,['error','warning','info'],true),'Invalid note level');$text=ke_talent_plain($note['text']??null,2000,true);$out[$lang][]=['id'=>$id,'text'=>$text,'level'=>$level,'enabled'=>ke_bool($note['enabled']??null)];}
 }return $out;
}
function ke_add_editorial_notes_to_reports($result,$versions,$language){
 global $wpdb;if(!$versions)return $result;$ids=implode(',',array_map('intval',$versions));
 $rows=$wpdb->get_results($wpdb->prepare('SELECT v.id,v.talent_id,v.document,x.description,e.changes FROM '.ke_table('talent_versions').' v LEFT JOIN '.ke_table('talent_texts').' x ON x.talent_version_id=v.id AND x.language=%s LEFT JOIN '.ke_table('talent_events')." e ON e.id=(SELECT MAX(src.id) FROM ".ke_table('talent_events')." src WHERE src.talent_id=v.talent_id AND src.action='import_pdf') WHERE v.id IN (".$ids.')',$language),ARRAY_A);
 foreach($rows as$row){$id=(int)$row['id'];$settings=json_decode($row['document'],true);$notes=$settings['editorialNotes'][$language]??null;
  if($notes===null){$notes=[];$review=json_decode($row['changes']??'{}',true)['sourceReview']??null;if($review&&hash_equals($review['mechanicsSha256'],hash('sha256',$row['description']??'')))foreach($review['notes']as$i=>$text)$notes[]=['id'=>'import-'.substr(md5($row['talent_id'].':'.$language.':'.$i.':'.$text),0,24),'text'=>$text,'level'=>'error','enabled'=>true];}
  $result[$id]['issues']=array_values(array_filter($result[$id]['issues'],fn($issue)=>$issue['code']!=='source_review_required'));
  $result[$id]['automaticErrorCount']=count($result[$id]['issues']);$result[$id]['notes']=$notes;$counts=['error'=>0,'warning'=>0,'info'=>0];foreach($notes as$note)if($note['enabled'])$counts[$note['level']]++;
  $result[$id]['noteCounts']=$counts;$result[$id]['noteCount']=array_sum($counts);$result[$id]['errorCount']=$result[$id]['automaticErrorCount']+$counts['error'];
 }return $result;
}
