<?php
if (!defined('ABSPATH')) exit;
function ke_cost_value_width($box,$value){return $value==10?max($box['width'],78.345*min($box['width']/42.345,$box['height']/58.229)):$box['width'];}
function ke_validate_faction_cost($value){if($value===null)return null;ke_require_value(is_array($value)&&in_array($value['faction']??null,['soldaci','mechanisci','hanza','rytualisci'],true),'Invalid cost faction');return ['faction'=>$value['faction'],'cost'=>ke_number($value['cost']??null,0,10,true)];}
class KE_Request_Error extends RuntimeException { public $status; function __construct($message, $status = 400) { parent::__construct($message); $this->status = $status; } }
function ke_require_value($valid, $message = 'Invalid document') { if (!$valid) throw new KE_Request_Error($message); }
function ke_number($v, $min, $max, $integer = false) { ke_require_value((is_int($v) || is_float($v)) && is_finite($v) && $v >= $min && $v <= $max && (!$integer || floor($v) == $v)); return $v; }
function ke_text($v, $max) { ke_require_value(is_string($v) && trim($v) !== '' && mb_strlen($v) <= $max && !preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f]/', $v)); return trim($v); }
function ke_uuid($v) { ke_require_value(is_string($v) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/D', $v)); return $v; }
function ke_bool($v) { ke_require_value(is_bool($v)); return $v; }
function ke_hex($v) { ke_require_value(is_string($v) && preg_match('/^#[0-9a-f]{6}$/iD', $v)); return strtolower($v); }
function ke_validate_catalogue($v) {
 ke_require_value(is_array($v) && ($v['version'] ?? null) === 2 && isset($v['colours'],$v['annotations']) && is_array($v['colours']) && is_array($v['annotations']) && count($v['colours']) <= 500 && count($v['annotations']) <= 500);
 $ids = []; $colours = []; $annotations = []; $names = [];
 foreach ($v['colours'] as $c) {
  ke_require_value(is_array($c));
  $id = ke_uuid($c['id'] ?? null); ke_require_value(ke_canonical_colour($id)===$id,'This colour was replaced; reload the palette'); ke_require_value(!isset($ids[$id])); $ids[$id] = true;
  $name = ke_text($c['name'] ?? null,80); $key = mb_strtolower($name); ke_require_value(!isset($names[$key]),'Duplicate name'); $names[$key] = true;
  $cmyk = $c['cmyk'] ?? null; if ($cmyk !== null) { ke_require_value(is_array($cmyk) && array_is_list($cmyk) && count($cmyk) === 4); foreach ($cmyk as $n) ke_number($n,0,100); }
  $colours[] = ['id'=>$id,'name'=>$name,'value'=>ke_hex($c['value'] ?? null),'cmyk'=>$cmyk];
 }
 $colour_ids = array_column($colours,'id'); $tags = []; $names = [];
 foreach ($v['annotations'] as $a) {
  ke_require_value(is_array($a));
  $id = ke_uuid($a['id'] ?? null); ke_require_value(!isset($ids[$id])); $ids[$id] = true;
  $name = ke_text($a['name'] ?? null,80); $key = mb_strtolower($name); ke_require_value(!isset($names[$key]),'Duplicate name'); $names[$key] = true;
  $tag = $a['tag'] ?? null; ke_require_value(is_string($tag) && $tag!=='ikona-kosztu' && preg_match('/^(?:[a-z][a-z0-9_-]{0,39}|\*{1,2})$/D',$tag) && !isset($tags[$tag]),'Invalid or duplicate tag'); $tags[$tag] = true;
  foreach (['colourId','backgroundId'] as $key) ke_require_value(isset($a[$key]) && is_string($a[$key]) && ($a[$key] === '' || in_array($a[$key],$colour_ids,true)),'Unknown colour');
  $weight = $a['weight'] ?? null; ke_require_value(in_array($weight,[400,600,700],true));
  $annotations[] = ['id'=>$id,'name'=>$name,'tag'=>$tag,'colourId'=>$a['colourId'],'backgroundId'=>$a['backgroundId'],'weight'=>$weight,'bold'=>$weight === 700,'italic'=>ke_bool($a['italic'] ?? null),'underline'=>ke_bool($a['underline'] ?? null),'smallCaps'=>ke_bool($a['smallCaps'] ?? null)];
 }
 return ['version'=>2,'colours'=>$colours,'annotations'=>$annotations];
}
function ke_canonical_colour($uuid) {return ['18181800-0000-4000-8000-000000000004'=>'00000000-0000-4000-8000-000000000002','40346600-0000-4000-8000-000000000005'=>'3e507400-0000-4000-8000-000000000001'][$uuid] ?? $uuid;}
function ke_resolve_text_colour($style) {
 global $wpdb;
 if(isset($style['colourId']))$uuid=ke_uuid($style['colourId']);else{$hex=ke_hex($style['color'] ?? null);$map=get_option('ke_legacy_text_colour_map',[]);$uuid=$map[$hex] ?? $wpdb->get_var($wpdb->prepare('SELECT uuid FROM '.ke_table('colours').' WHERE rgb_r=%d AND rgb_g=%d AND rgb_b=%d AND archived_at IS NULL LIMIT 1',hexdec(substr($hex,1,2)),hexdec(substr($hex,3,2)),hexdec(substr($hex,5,2))));}
 $uuid=$uuid?ke_canonical_colour($uuid):$uuid;
 $row=$uuid?$wpdb->get_row($wpdb->prepare('SELECT * FROM '.ke_table('colours').' WHERE uuid=%s AND archived_at IS NULL',$uuid),ARRAY_A):null;ke_require_value((bool)$row,'Text colour must be selected from the defined palette');return ['colourId'=>$row['uuid'],'color'=>sprintf('#%02x%02x%02x',$row['rgb_r'],$row['rgb_g'],$row['rgb_b'])];
}
function ke_graphic_variant($v) {
 $allowed=['original','ink'];
 if(isset($v['graphicVariant'])&&in_array($v['graphicVariant'],['ink-experimental','ink-original-frame'],true))return 'ink';
 if(isset($v['graphicVariant'])){ke_require_value(in_array($v['graphicVariant'],$allowed,true),'Unknown graphic variant');return $v['graphicVariant'];}
 ke_require_value(!isset($v['iconVariant'])||in_array($v['iconVariant'],['original','ink'],true));
 ke_require_value(!isset($v['frameVariant'])||in_array($v['frameVariant'],['original','ink','joined'],true));
 ke_require_value(!isset($v['costVariant'])||in_array($v['costVariant'],['original','simple','coins'],true));
 if(($v['iconVariant'] ?? 'ink')==='original')return 'original';
 return 'ink';
}
function ke_validate_template($v) {
 ke_require_value(is_array($v) && ($v['schemaVersion'] ?? null) === 2 && ($v['kind'] ?? null) === 'talent-template');
 foreach (['page','elements','styles'] as $key) ke_require_value(isset($v[$key]) && is_array($v[$key]));
 $page = ['width'=>ke_number($v['page']['width'] ?? null,50,600),'height'=>ke_number($v['page']['height'] ?? null,50,600)];
 $roles = ['title','flavor','mechanics']; $elements = [];
 foreach (array_merge(['frame','hex','hexMark','costAmount','cost','factionSymbol','factionCostAmount','factionCost','play','play2','gift','specialRules','nonRenewable','exclusive','uses','once','restriction','version','textFlow'],$roles) as $id) {
  $b = $v['elements'][$id] ?? [];if(in_array($id,['factionSymbol','factionCostAmount','factionCost'],true)&&(!isset($v['elements'][$id])||!isset($v['elements']['factionSymbol']))){$b=$elements[$id==='factionCostAmount'?'costAmount':'cost'];$b['x']=0;$b['visible']=$v['elements']['factionCost']['visible']??true;$b['locked']=false;if($id==='factionSymbol'){$b['width']=min($page['width'],$b['height']*1.16);$b['proportional']=true;}}if($id==='exclusive'&&!isset($v['elements'][$id]))$b=['x'=>0,'y'=>7.55,'width'=>min(64,$page['width']),'height'=>14,'visible'=>true,'locked'=>false,'proportional'=>false];
  if($id==='play2'&&!isset($v['elements'][$id])){$b=$elements['play'];$b['visible']=false;$b['locked']=false;}
  if($id==='hexMark' && !isset($v['elements'][$id])) { $hex=$elements['hex'];$percent=isset($v['hexMark'])?ke_number($v['hexMark']['size'] ?? null,10,150):90;$size=max(1,min($page['width'],$page['height'],min($hex['width'],$hex['height'])*$percent/100));$b=['x'=>max(0,min($page['width']-$size,$hex['x']+($hex['width']-$size)/2)),'y'=>max(0,min($page['height']-$size,$hex['y']+($hex['height']-$size)/2)),'width'=>$size,'height'=>$size,'visible'=>true,'locked'=>false,'proportional'=>true]; }
  if($id==='costAmount' && !isset($v['elements'][$id])){$old=$v['elements']['cost'] ?? ['x'=>27.25,'y'=>6.2,'width'=>28,'height'=>16.55,'visible'=>true];$b=['x'=>max(0,min($page['width']-1,$old['x'])),'y'=>max(0,min($page['height']-1,$old['y'])),'width'=>max(1,$old['width']*8/28),'height'=>$old['height'],'visible'=>$old['visible']&&$old['width']>=6,'locked'=>false,'proportional'=>true];}
  if($id==='cost' && !isset($v['elements'][$id])) { $w=min(28,$page['width']);$h=min(16.55,$page['height']);$b=['x'=>max(0,min($page['width']-$w,$v['elements']['gift']['x'] ?? 27.25)),'y'=>max(0,min($page['height']-$h,($v['elements']['gift']['y'] ?? 3.5)+(($v['elements']['gift']['height'] ?? 22.1)-$h)/2)),'width'=>$w,'height'=>$h,'visible'=>true,'locked'=>false,'proportional'=>true]; }
  if($id==='play' && !isset($v['elements'][$id])) { $size=min(22.1,$page['width'],$page['height']);$b=['x'=>max(0,min($page['width']-$size,$v['elements']['gift']['x'] ?? 27.25)),'y'=>max(0,min($page['height']-$size,$v['elements']['gift']['y'] ?? 3.5)),'width'=>$size,'height'=>$size,'visible'=>true,'locked'=>false,'proportional'=>true]; }
  if($id==='specialRules' && !isset($v['elements'][$id])) { $w=min(12.6,$page['width']);$h=min(22.1,$page['height']);$b=['x'=>max(0,min($page['width']-$w,$v['elements']['gift']['x'] ?? 27.25)),'y'=>max(0,min($page['height']-$h,$v['elements']['gift']['y'] ?? 3.5)),'width'=>$w,'height'=>$h,'visible'=>true,'locked'=>false,'proportional'=>true]; }
  if($id==='nonRenewable' && !isset($v['elements'][$id])) { $available=$page['width']-$elements['gift']['x']-$elements['gift']['width']-4;$width=max(1,min(80,$available));$height=min(14,$page['height']);$b=['x'=>max(0,min(53.35,$page['width']-$width)),'y'=>max(0,min(7.55,$page['height']-$height)),'width'=>$width,'height'=>$height,'visible'=>$available>=1,'locked'=>false,'proportional'=>false]; }
  if($id==='version'&&!isset($v['elements'][$id]))$b=['x'=>7,'y'=>$page['height']-9,'width'=>min(90,$page['width']-14),'height'=>6,'visible'=>false,'locked'=>false,'proportional'=>false];
  if($id==='restriction' && !isset($v['elements'][$id]))$b=['x'=>max(0,$page['width']-97),'y'=>max(0,$page['height']-17),'width'=>min(90,$page['width']),'height'=>10,'visible'=>true,'locked'=>false,'proportional'=>false];
  ke_require_value(is_array($b)); $x = ke_number($b['x'] ?? null,0,in_array($id,['costAmount','cost','factionSymbol','factionCostAmount','factionCost','play','play2','gift','specialRules','nonRenewable','exclusive'],true)?6000:$page['width']); $y = ke_number($b['y'] ?? null,0,$page['height']); $w = ke_number($b['width'] ?? null,1,$page['width']); $h = ke_number($b['height'] ?? null,1,$page['height']);
  ke_require_value((in_array($id,['costAmount','cost','factionSymbol','factionCostAmount','factionCost','play','play2','gift','specialRules','nonRenewable','exclusive'],true)||$x+$w <= $page['width']+.001) && $y+$h <= $page['height']+.001);
  $elements[$id] = ['x'=>$x,'y'=>$y,'width'=>$w,'height'=>$h,'visible'=>ke_bool($b['visible'] ?? null),'locked'=>ke_bool($b['locked'] ?? null),'proportional'=>ke_bool($b['proportional'] ?? false)];
 }
 if(!isset($v['elements']['costAmount'])&&$elements['costAmount']['visible'])$elements['cost']['width']=max(1,$elements['cost']['width']-$elements['costAmount']['width']-($v['headerRow']['gap'] ?? 4));
 if(($elements['costAmount']['width']==8&&$elements['costAmount']['height']==16.55)||($elements['costAmount']['width']==7&&$elements['costAmount']['height']==10)){$elements['costAmount']['width']=12;$elements['costAmount']['height']=18;$elements['costAmount']['y']=max(0,min($page['height']-18,$elements['cost']['y']+($elements['cost']['height']-18)/2));}
 $styles = [];
 foreach (array_merge($roles,['nonRenewable','exclusive','restriction','version']) as $role) {
  $s = $v['styles'][$role] ?? ($role==='version'?['font'=>'libertine','fontSize'=>5,'lineHeight'=>1,'letterSpacing'=>0,'color'=>'#000000','bold'=>false,'italic'=>false]:(in_array($role,['nonRenewable','exclusive','restriction'],true)?['font'=>'libertine','fontSize'=>7,'lineHeight'=>1.12,'letterSpacing'=>0,'color'=>'#000000','bold'=>true,'italic'=>true]:[])); ke_require_value(is_array($s)); ke_require_value(in_array($s['font'] ?? null,['libertine','georgia','arial'],true));
  $styles[$role] = ['font'=>$s['font'],'fontSize'=>ke_number($s['fontSize'] ?? null,in_array($role,['nonRenewable','exclusive','restriction','version'],true)?5:9,48),'lineHeight'=>ke_number($s['lineHeight'] ?? null,.75,3),'letterSpacing'=>ke_number($s['letterSpacing'] ?? null,-2,10),'colourId'=>ke_resolve_text_colour($s)['colourId'],'color'=>ke_resolve_text_colour($s)['color'],'bold'=>ke_bool($s['bold'] ?? null),'italic'=>ke_bool($s['italic'] ?? null)];
 }
 ke_require_value(in_array($v['textMode'] ?? null,['flow','separate'],true));
 $graphic_variant=ke_graphic_variant($v);
 $frame_colour = ke_canonical_colour(ke_uuid($v['frameColourId'] ?? '3e507400-0000-4000-8000-000000000001'));
 global $wpdb; $available = $wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('colours').' WHERE uuid=%s AND archived_at IS NULL',$frame_colour));
 ke_require_value((bool)$available,'Frame colour must be selected from the defined palette');
 $graphic_colours = ['play2'=>($v['graphicColourIds']['play']??'00000000-0000-4000-8000-000000000002'),'cost'=>'3e507400-0000-4000-8000-000000000001','specialRules'=>'00000000-0000-4000-8000-000000000002','play'=>'00000000-0000-4000-8000-000000000002','hexMark'=>'00000000-0000-4000-8000-000000000002','hex'=>'3e507400-0000-4000-8000-000000000001','gift'=>'00000000-0000-4000-8000-000000000002','uses'=>'3e507400-0000-4000-8000-000000000001','once'=>'3e507400-0000-4000-8000-000000000001'];
 if (isset($v['graphicColourIds'])) { ke_require_value(is_array($v['graphicColourIds'])); foreach ($graphic_colours as $key=>$default) $graphic_colours[$key]=ke_uuid($v['graphicColourIds'][$key] ?? ($key==='play2'?$default:($key==='cost'?'3e507400-0000-4000-8000-000000000001':(in_array($key,['play','specialRules'],true)?'00000000-0000-4000-8000-000000000002':($key==='hexMark'?($v['hexMark']['colourId'] ?? '00000000-0000-4000-8000-000000000002'):null))))); }
 foreach($graphic_colours as $key=>$uuid)$graphic_colours[$key]=ke_canonical_colour($uuid);
 foreach ($graphic_colours as $uuid) ke_require_value((bool)$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('colours').' WHERE uuid=%s AND archived_at IS NULL',$uuid)),'Graphic colour must be selected from the defined palette');
 $cost_value=ke_number($v['costValue'] ?? 0,0,10,true);$cost_ink=ke_uuid(isset($v['elements']['costAmount'])?($v['costTextColourId'] ?? '3e507400-0000-4000-8000-000000000001'):'3e507400-0000-4000-8000-000000000001'); $cost_ink=ke_canonical_colour($cost_ink);ke_require_value((bool)$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('colours').' WHERE uuid=%s AND archived_at IS NULL',$cost_ink)),'Cost digit colour must be selected from the defined palette');
 if(!isset($v['elements']['cost'])&&$elements['nonRenewable']['width']==80&&$styles['nonRenewable']['font']==='libertine'&&$styles['nonRenewable']['fontSize']==7&&$styles['nonRenewable']['bold']&&$styles['nonRenewable']['italic']&&$styles['nonRenewable']['letterSpacing']==0)$elements['nonRenewable']['width']=50;
 $row=$v['headerRow'] ?? ['x'=>$elements['gift']['x'],'centerY'=>$elements['gift']['y']+$elements['gift']['height']/2,'gap'=>4];ke_require_value(is_array($row));
 $row=['x'=>ke_number($row['x'] ?? null,0,$page['width']),'centerY'=>ke_number($row['centerY'] ?? null,0,$page['height']),'gap'=>ke_number($row['gap'] ?? null,0,30)];
 $factionAspects=["soldaci"=>1.117466,"mechanisci"=>0.849827,"hanza"=>0.743854,"rytualisci"=>1.162004];
 $elements['factionSymbol']['width']=round($elements['factionSymbol']['height']*$factionAspects[$v['factionCost']['faction']??'soldaci'],3);$elements['factionSymbol']['proportional']=true;
 $active=array_values(array_filter(['costAmount','cost','factionSymbol','factionCostAmount','factionCost','play','play2','gift','specialRules','nonRenewable','exclusive'],function($id)use($elements){return $elements[$id]['visible'];}));$width=0;$height=1;foreach($active as $id){$width+=($id==='costAmount'?ke_cost_value_width($elements[$id],$cost_value):($id==='factionCostAmount'?ke_cost_value_width($elements[$id],$v['factionCost']['cost']??3):$elements[$id]['width']));$height=max($height,$elements[$id]['height']);}$width+=max(0,count($active)-1-($elements['cost']['visible']&&$elements['costAmount']['visible']?1:0))*$row['gap']+($elements['cost']['visible']&&$elements['costAmount']['visible']?1:0);foreach(['cost','specialRules','play'] as $added)if(!isset($v['elements'][$added])&&$width>$page['width']-$row['x']+.001){$elements[$added]['visible']=false;$active=array_values(array_filter($active,function($id)use($added){return $id!==$added;}));$width=0;foreach($active as $id)$width+=($id==='costAmount'?ke_cost_value_width($elements[$id],$cost_value):($id==='factionCostAmount'?ke_cost_value_width($elements[$id],$v['factionCost']['cost']??3):$elements[$id]['width']));$width+=max(0,count($active)-1-($elements['cost']['visible']&&$elements['costAmount']['visible']?1:0))*$row['gap']+($elements['cost']['visible']&&$elements['costAmount']['visible']?1:0);}

 $row['centerY']=round($row['centerY'],3);$cursor=$row['x'];foreach($active as $id){$elements[$id]['x']=round($cursor,3);$cursor+=($id==='costAmount'?ke_cost_value_width($elements[$id],$cost_value):($id==='factionCostAmount'?ke_cost_value_width($elements[$id],$v['factionCost']['cost']??3):$elements[$id]['width']))+(($id==='costAmount'&&$elements['cost']['visible'])||($id==='factionCostAmount'&&$elements['factionCost']['visible'])?1:(($id==='factionSymbol'&&$elements['factionCostAmount']['visible'])?1:$row['gap']));}
 return ['schemaVersion'=>2,'kind'=>'talent-template','name'=>ke_text($v['name'] ?? null,120),'page'=>$page,'background'=>ke_hex($v['background'] ?? null),'backgroundVisible'=>ke_bool($v['backgroundVisible'] ?? true),'headerRow'=>$row,'graphicVariant'=>$graphic_variant,'costValue'=>$cost_value,'factionCost'=>ke_validate_faction_cost($v['factionCost']??['faction'=>'soldaci','cost'=>3]),'costTextColourId'=>$cost_ink,'frameColourId'=>$frame_colour,'graphicColourIds'=>$graphic_colours,'textMode'=>'flow','elements'=>$elements,'styles'=>$styles];
}