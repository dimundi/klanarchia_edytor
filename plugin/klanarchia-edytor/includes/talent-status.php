<?php
if(!defined('ABSPATH'))exit;
function ke_talent_status($value){ke_require_value(is_string($value)&&in_array($value,['dev','toCheck','approved','delete'],true),'Invalid talent status');return $value;}
function ke_migrate_talent_status(){
 global $wpdb;if(in_array(get_option('ke_talents_schema_version'),['3','4','5'],true))return;
 ke_migrate_talent_codes();
 if(!in_array('status',$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talent_versions')),true))ke_db_query("ALTER TABLE ".ke_table('talent_versions')." ADD status varchar(16) NOT NULL DEFAULT 'dev'");
 update_option('ke_talents_schema_version','3',false);
}
if(defined('WP_CLI')&&WP_CLI)WP_CLI::add_command('ke talent-status-init',function(){if(!ke_can_access())WP_CLI::error('Administrator required');try{ke_migrate_talent_status();WP_CLI::success('Talent status schema ready.');}catch(Throwable $e){WP_CLI::error($e->getMessage());}});
