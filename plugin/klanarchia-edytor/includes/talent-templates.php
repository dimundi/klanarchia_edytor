<?php
if(!defined('ABSPATH'))exit;
// Template history is retained for audit; talents always resolve the template's current document.
function ke_migrate_live_talent_templates(){
 global $wpdb;
 if(get_option('ke_talents_schema_version')==='4'&&get_option('ke_talent_checks_schema_version')!=='1')return;
 ke_migrate_talent_status();
 if(!in_array('template_id',$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talent_versions')),true))ke_db_query('ALTER TABLE '.ke_table('talent_versions').' ADD template_id bigint unsigned NULL');
 ke_db_query('UPDATE '.ke_table('talent_versions').' v JOIN '.ke_table('template_versions').' old ON old.id=v.template_version_id SET v.template_id=old.template_id WHERE v.template_id IS NULL');
 ke_db_query('ALTER TABLE '.ke_table('talent_versions').' MODIFY template_id bigint unsigned NOT NULL');
 $links=[['talent_versions','template_id','templates']];
 if(in_array(get_option('ke_talent_checks_schema_version'),['1','2'],true)){
  if(!in_array('template_version_id',$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talent_checks')),true))ke_db_query('ALTER TABLE '.ke_table('talent_checks').' ADD template_version_id bigint unsigned NULL');
  if(get_option('ke_talent_checks_schema_version')==='1')ke_db_query('UPDATE '.ke_table('talent_checks').' c JOIN '.ke_table('talent_versions').' v ON v.id=c.talent_version_id SET c.template_version_id=v.template_version_id WHERE c.template_version_id IS NULL');
  $links[]=['talent_checks','template_version_id','template_versions'];update_option('ke_talent_checks_schema_version','2',false);
 }
 foreach($links as[$table,$column,$target]){$name='ke_'.substr(md5(ke_table($table).$column),0,20);if(!$wpdb->get_var($wpdb->prepare('SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME=%s AND CONSTRAINT_NAME=%s',ke_table($table),$name)))ke_db_query('ALTER TABLE '.ke_table($table).' ADD CONSTRAINT '.$name.' FOREIGN KEY ('.$column.') REFERENCES '.ke_table($target).'(id) ON DELETE RESTRICT');}
 update_option('ke_talents_schema_version','4',false);
}
function ke_live_talent_settings($document,$templateId){$settings=json_decode($document,true);unset($settings['templateRevision']);$settings['templateId']=$templateId;return $settings;}
if(defined('WP_CLI')&&WP_CLI)WP_CLI::add_command('ke live-templates-init',function(){if(!ke_can_access())WP_CLI::error('Administrator required');try{ke_migrate_live_talent_templates();WP_CLI::success('Talents use current templates.');}catch(Throwable $e){WP_CLI::error($e->getMessage());}});
