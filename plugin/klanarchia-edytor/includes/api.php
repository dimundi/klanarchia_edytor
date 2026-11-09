<?php
if (!defined('ABSPATH')) exit;
function ke_api_language($r) { return $r->get_param('language') === 'en' ? 'en' : 'pl'; }
function ke_api_run($callback, $request) {
 global $wpdb;
 try {
  if (get_option('ke_schema_version') !== '1') throw new KE_Request_Error('Database migration required',503);
  if (strlen($request->get_body()) > 4*1024*1024) throw new KE_Request_Error('Request too large',413);
  $result = $callback($request); $response = new WP_REST_Response($result); $response->header('Cache-Control','no-store, private'); return $response;
 } catch (Throwable $e) { $wpdb->query('ROLLBACK'); return new WP_Error($e instanceof KE_Request_Error ? 'ke_request' : 'ke_database', $e instanceof KE_Request_Error ? $e->getMessage() : 'Database operation failed', ['status'=>$e instanceof KE_Request_Error ? $e->status : 500]); }
}
function ke_catalogue_get($r) {
 global $wpdb; $lang = ke_api_language($r);
 // Consistent snapshot: catalogue rows and revision must belong to one committed save.
 ke_db_query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
 $revision = (int)$wpdb->get_var('SELECT lock_version FROM '.ke_table('catalogue_state').' WHERE id=1');
 $colours = []; $colour_ids = [];
 foreach ($wpdb->get_results('SELECT * FROM '.ke_table('colours').' WHERE archived_at IS NULL ORDER BY sort_order,id',ARRAY_A) as $c) {
  $name = $wpdb->get_var($wpdb->prepare('SELECT name FROM '.ke_table('colour_texts')." WHERE colour_id=%d ORDER BY (language=%s) DESC, (language='pl') DESC LIMIT 1",$c['id'],$lang));
  $colour_ids[$c['id']]=$c['uuid']; $colours[]=['id'=>$c['uuid'],'name'=>$name,'value'=>sprintf('#%02x%02x%02x',$c['rgb_r'],$c['rgb_g'],$c['rgb_b']),'cmyk'=>$c['cmyk_c'] === null ? null : array_map('floatval',[$c['cmyk_c'],$c['cmyk_m'],$c['cmyk_y'],$c['cmyk_k']])];
 }
 $annotations = [];
 foreach ($wpdb->get_results('SELECT * FROM '.ke_table('text_annotations').' WHERE archived_at IS NULL ORDER BY sort_order,id',ARRAY_A) as $a) {
  $name = $wpdb->get_var($wpdb->prepare('SELECT name FROM '.ke_table('text_annotation_texts')." WHERE annotation_id=%d ORDER BY (language=%s) DESC, (language='pl') DESC LIMIT 1",$a['id'],$lang));
  $annotations[]=['id'=>$a['uuid'],'name'=>$name,'tag'=>$a['tag'],'colourId'=>$colour_ids[$a['text_colour_id']] ?? '', 'backgroundId'=>$colour_ids[$a['background_colour_id']] ?? '', 'weight'=>(int)$a['font_weight'],'bold'=>(int)$a['font_weight']===700,'italic'=>(bool)$a['italic'],'underline'=>(bool)$a['underline'],'smallCaps'=>(bool)$a['small_caps']];
 }
 ke_db_query('COMMIT'); return ['revision'=>$revision,'data'=>['version'=>2,'colours'=>$colours,'annotations'=>$annotations]];
}
function ke_catalogue_put($r) {
 global $wpdb; $body = $r->get_json_params(); $data = ke_validate_catalogue($body['data'] ?? null); $expected = ke_number($body['revision'] ?? null,0,PHP_INT_MAX,true); $lang = ke_api_language($r);
 ke_db_query('START TRANSACTION'); $revision=(int)$wpdb->get_var('SELECT lock_version FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');
 if ($revision !== (int)$expected) throw new KE_Request_Error('Settings changed; reload before saving',409);
 $now = current_time('mysql',true); $actor=get_current_user_id(); $colours=[]; $kept_colours=[]; $kept_annotations=[];
 foreach ($data['colours'] as $order=>$c) {
  $existing = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.ke_table('colours').' WHERE uuid=%s',$c['id']),ARRAY_A);
  $row=['rgb_r'=>hexdec(substr($c['value'],1,2)),'rgb_g'=>hexdec(substr($c['value'],3,2)),'rgb_b'=>hexdec(substr($c['value'],5,2)),'cmyk_c'=>$c['cmyk'][0] ?? null,'cmyk_m'=>$c['cmyk'][1] ?? null,'cmyk_y'=>$c['cmyk'][2] ?? null,'cmyk_k'=>$c['cmyk'][3] ?? null,'sort_order'=>$order,'archived_at'=>null,'updated_at'=>$now,'updated_by'=>$actor,'lock_version'=>$existing ? (int)$existing['lock_version']+1 : 1];
  if ($existing) { $id=(int)$existing['id']; ke_db_write('update','colours',$row,['id'=>$id]); } else { ke_db_write('insert','colours',$row+['uuid'=>$c['id'],'created_at'=>$now,'created_by'=>$actor]); $id=(int)$wpdb->insert_id; }
  $colours[$c['id']]=$id; $kept_colours[]=$id; ke_db_write('replace','colour_texts',['colour_id'=>$id,'language'=>$lang,'name'=>$c['name']]);
 }
 foreach ($data['annotations'] as $order=>$a) {
  $existing=$wpdb->get_row($wpdb->prepare('SELECT * FROM '.ke_table('text_annotations').' WHERE uuid=%s',$a['id']),ARRAY_A);
  if ($existing && $existing['tag'] !== $a['tag']) throw new KE_Request_Error('Saved tag cannot be changed',409);
  $tag_owner=$wpdb->get_var($wpdb->prepare('SELECT uuid FROM '.ke_table('text_annotations').' WHERE tag=%s',$a['tag'])); if ($tag_owner && $tag_owner !== $a['id']) throw new KE_Request_Error('Tag already exists (including archived annotations)',409);
  $row=['tag'=>$a['tag'],'text_colour_id'=>$a['colourId'] ? $colours[$a['colourId']] : null,'background_colour_id'=>$a['backgroundId'] ? $colours[$a['backgroundId']] : null,'font_weight'=>$a['weight'],'italic'=>(int)$a['italic'],'underline'=>(int)$a['underline'],'small_caps'=>(int)$a['smallCaps'],'sort_order'=>$order,'archived_at'=>null,'updated_at'=>$now,'updated_by'=>$actor,'lock_version'=>$existing ? (int)$existing['lock_version']+1 : 1];
  if ($existing) { $id=(int)$existing['id']; ke_db_write('update','text_annotations',$row,['id'=>$id]); } else { ke_db_write('insert','text_annotations',$row+['uuid'=>$a['id'],'created_at'=>$now,'created_by'=>$actor]); $id=(int)$wpdb->insert_id; }
  $kept_annotations[]=$id; ke_db_write('replace','text_annotation_texts',['annotation_id'=>$id,'language'=>$lang,'name'=>$a['name']]);
 }
 foreach (['text_annotations'=>$kept_annotations,'colours'=>$kept_colours] as $table=>$ids) {
  $condition=$ids ? ' AND id NOT IN ('.implode(',',array_map('intval',$ids)).')' : '';
  // Keep archived annotation colours resolvable as well.
  if ($table === 'colours') {
   $removed = $wpdb->get_col('SELECT uuid FROM '.ke_table('colours').' WHERE archived_at IS NULL'.($ids ? ' AND id NOT IN ('.implode(',',array_map('intval',$ids)).')' : ''));
   foreach ($removed as $uuid) {
    $conditions=[];$parameters=[];
    foreach (['costTextColourId'=>'ffffff00-0000-4000-8000-000000000003','graphicColourIds.cost'=>'3e507400-0000-4000-8000-000000000001','graphicColourIds.specialRules'=>'00000000-0000-4000-8000-000000000002','graphicColourIds.play'=>'00000000-0000-4000-8000-000000000002','graphicColourIds.hexMark'=>'00000000-0000-4000-8000-000000000002','frameColourId'=>'3e507400-0000-4000-8000-000000000001','graphicColourIds.hex'=>'3e507400-0000-4000-8000-000000000001','graphicColourIds.gift'=>'00000000-0000-4000-8000-000000000002','graphicColourIds.uses'=>'3e507400-0000-4000-8000-000000000001','graphicColourIds.once'=>'3e507400-0000-4000-8000-000000000001'] as $path=>$default) { $conditions[]=$path==='graphicColourIds.hexMark' ? "COALESCE(JSON_UNQUOTE(JSON_EXTRACT(document,'$.graphicColourIds.hexMark')),JSON_UNQUOTE(JSON_EXTRACT(document,'$.hexMark.colourId')),'".$default."')=%s" : "COALESCE(JSON_UNQUOTE(JSON_EXTRACT(document,'$.".$path."')), '".$default."')=%s";$parameters[]=$uuid; }
    $used=$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('template_versions').' WHERE '.implode(' OR ',$conditions).' LIMIT 1',$parameters));
    if(!$used)foreach(['title','flavor','mechanics','nonRenewable','restriction','version'] as $role){$used=$wpdb->get_var($wpdb->prepare("SELECT id FROM ".ke_table('template_versions')." WHERE JSON_UNQUOTE(JSON_EXTRACT(document,'$.styles.".$role.".colourId'))=%s LIMIT 1",$uuid));if($used)break;foreach(get_option('ke_legacy_text_colour_map',[]) as $hex=>$mapped){if($mapped!==$uuid)continue;$used=$wpdb->get_var($wpdb->prepare("SELECT id FROM ".ke_table('template_versions')." WHERE JSON_EXTRACT(document,'$.styles.".$role.".colourId') IS NULL AND JSON_UNQUOTE(JSON_EXTRACT(document,'$.styles.".$role.".color'))=%s LIMIT 1",$hex));if($used)break;}if($used)break;}
    if ($used) throw new KE_Request_Error('Colour is used by a saved template version',409);
   }
   $blocked=$wpdb->get_var('SELECT a.id FROM '.ke_table('text_annotations').' a JOIN '.ke_table('colours').' c ON (a.text_colour_id=c.id OR a.background_colour_id=c.id) WHERE c.archived_at IS NULL'.($ids ? ' AND c.id NOT IN ('.implode(',',array_map('intval',$ids)).')' : '').' LIMIT 1');
   if ($blocked) throw new KE_Request_Error('Colour is still used by an active or archived annotation',409);
  }
  ke_db_query($wpdb->prepare('UPDATE '.ke_table($table).' SET archived_at=%s, updated_at=%s, updated_by=%d, lock_version=lock_version+1 WHERE archived_at IS NULL'.$condition,$now,$now,$actor));
 }
 ke_db_query('UPDATE '.ke_table('catalogue_state').' SET lock_version=lock_version+1 WHERE id=1'); ke_db_query('COMMIT');
 return ['revision'=>$revision+1,'data'=>$data];
}
function ke_template_item($row) { $document=json_decode($row['document'],true);$document['graphicVariant']=ke_graphic_variant($document);unset($document['iconVariant'],$document['frameVariant'],$document['costVariant']);foreach(($document['styles']??[]) as $role=>$style)$document['styles'][$role]=array_merge($style,ke_resolve_text_colour($style)); return ['id'=>$row['uuid'],'revision'=>(int)$row['lock_version'],'createdAt'=>str_replace(' ','T',$row['created_at']).'Z','updatedAt'=>str_replace(' ','T',$row['updated_at']).'Z','template'=>$document]; }
function ke_templates_get($r) {
 global $wpdb; $page=max(1,(int)$r->get_param('page')); $limit=50;
 $rows=$wpdb->get_results($wpdb->prepare('SELECT t.*,v.document FROM '.ke_table('templates').' t JOIN '.ke_table('template_versions')." v ON v.id=t.current_version_id AND v.template_id=t.id WHERE t.kind='talent_card' AND t.archived_at IS NULL ORDER BY t.id LIMIT %d OFFSET %d",$limit+1,($page-1)*$limit),ARRAY_A);
 return ['items'=>array_map('ke_template_item',array_slice($rows,0,$limit)),'hasMore'=>count($rows)>$limit];
}
function ke_template_save_locked($id,$document,$expected) {
 global $wpdb; ke_uuid($id); $wpdb->get_var('SELECT lock_version FROM '.ke_table('catalogue_state').' WHERE id=1 FOR SHARE'); $document=ke_validate_template($document); ke_number($expected,0,PHP_INT_MAX,true);
 $existing=$wpdb->get_row($wpdb->prepare('SELECT * FROM '.ke_table('templates').' WHERE uuid=%s FOR UPDATE',$id),ARRAY_A); $now=current_time('mysql',true); $actor=get_current_user_id();
 if (($existing ? (int)$existing['lock_version'] : 0) !== (int)$expected) throw new KE_Request_Error('Template changed; reopen the current version',409);
 if ($existing && ($existing['kind'] !== 'talent_card' || $existing['archived_at'])) throw new KE_Request_Error('Template not available',409);
 $revision=(int)$expected+1;
 if (!$existing) { ke_db_write('insert','templates',['uuid'=>$id,'kind'=>'talent_card','name'=>$document['name'],'created_at'=>$now,'updated_at'=>$now,'created_by'=>$actor,'updated_by'=>$actor,'lock_version'=>1]); $template_id=(int)$wpdb->insert_id; } else $template_id=(int)$existing['id'];
 ke_db_write('insert','template_versions',['template_id'=>$template_id,'version_no'=>$revision,'schema_version'=>2,'document'=>wp_json_encode($document,JSON_UNESCAPED_UNICODE),'created_at'=>$now,'created_by'=>$actor]); $version_id=(int)$wpdb->insert_id;
 ke_db_write('update','templates',['name'=>$document['name'],'current_version_id'=>$version_id,'updated_at'=>$now,'updated_by'=>$actor,'lock_version'=>$revision],['id'=>$template_id]);
 return ['id'=>$id,'revision'=>$revision,'createdAt'=>str_replace(' ','T',$existing['created_at'] ?? $now).'Z','updatedAt'=>str_replace(' ','T',$now).'Z','template'=>$document];
}
function ke_template_put($r) { $b=$r->get_json_params(); ke_db_query('START TRANSACTION'); $item=ke_template_save_locked($r['uuid'],$b['template'] ?? null,$b['revision'] ?? null); ke_db_query('COMMIT'); return $item; }
function ke_templates_import($r) {
 $b=$r->get_json_params(); ke_require_value(isset($b['items']) && is_array($b['items']) && count($b['items'])>0 && count($b['items'])<=50); $seen=[];
 foreach ($b['items'] as $item) { $id=ke_uuid($item['id'] ?? null); ke_require_value(!isset($seen[$id]));$seen[$id]=true;ke_validate_template($item['template'] ?? null); }
 ke_db_query('START TRANSACTION');$items=[];foreach ($b['items'] as $item) $items[]=ke_template_save_locked($item['id'],$item['template'],0);ke_db_query('COMMIT');return ['items'=>$items];
}
add_action('rest_api_init',function () {
 foreach ([['/catalogue','GET','ke_catalogue_get'],['/catalogue','PUT','ke_catalogue_put'],['/templates','GET','ke_templates_get'],['/templates/import','POST','ke_templates_import'],['/templates/(?P<uuid>[a-f0-9-]{36})','PUT','ke_template_put']] as [$path,$method,$callback]) register_rest_route('klanarchia-editor/v1',$path,['methods'=>$method,'permission_callback'=>'ke_can_access','callback'=>function ($r) use ($callback) { return ke_api_run($callback,$r); }]);
 add_filter('rest_post_dispatch',function ($response,$server,$r) { if (str_starts_with($r->get_route(),'/klanarchia-editor/')) $response->header('Cache-Control','no-store, private'); return $response; },10,3);
});