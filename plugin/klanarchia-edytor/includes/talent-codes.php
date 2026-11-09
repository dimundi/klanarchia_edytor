<?php
if(!defined('ABSPATH'))exit;
const KE_TALENT_CODE_PATTERN='[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}';
function ke_talent_code($value){ke_require_value(is_string($value)&&preg_match('/^'.KE_TALENT_CODE_PATTERN.'$/D',$value),'Invalid talent code');return $value;}
function ke_generate_talent_code(){
 global $wpdb;$alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 for($attempt=0;$attempt<100;$attempt++){$text='';for($i=0;$i<8;$i++)$text.=$alphabet[random_int(0,strlen($alphabet)-1)];$code=substr($text,0,4).'-'.substr($text,4);if(!$wpdb->get_var($wpdb->prepare('SELECT id FROM '.ke_table('talents').' WHERE code=%s',$code)))return $code;}
 throw new RuntimeException('Could not allocate a unique talent code');
}
function ke_talent_version_day($utc){return (new DateTimeImmutable($utc,new DateTimeZone('UTC')))->setTimezone(new DateTimeZone('Europe/Warsaw'))->format('Y-m-d');}
function ke_talent_version_code($code,$day,$serial){return $code.'-'.(new DateTimeImmutable($day))->format('dmy').'-'.str_pad((string)$serial,2,'0',STR_PAD_LEFT);}
function ke_next_talent_day_serial($talent,$day){global $wpdb;return 1+(int)$wpdb->get_var($wpdb->prepare('SELECT MAX(day_serial) FROM '.ke_table('talent_versions').' WHERE talent_id=%d AND version_day=%s',$talent,$day));}
function ke_migrate_talent_codes(){
 global $wpdb;if(get_option('ke_talents_schema_version')==='2')return;ke_migrate_talents();
 $columns=$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talents'));if(!in_array('code',$columns,true))ke_db_query('ALTER TABLE '.ke_table('talents').' ADD code char(9) NULL');
 $columns=$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talent_versions'));if(!in_array('version_day',$columns,true))ke_db_query('ALTER TABLE '.ke_table('talent_versions').' ADD version_day date NULL');if(!in_array('day_serial',$columns,true))ke_db_query('ALTER TABLE '.ke_table('talent_versions').' ADD day_serial bigint unsigned NULL');
 try{
  ke_db_query('START TRANSACTION');$wpdb->get_var('SELECT id FROM '.ke_table('catalogue_state').' WHERE id=1 FOR UPDATE');
  foreach($wpdb->get_results('SELECT id,code FROM '.ke_table('talents').' ORDER BY id',ARRAY_A)as$row){if(!$row['code'])ke_db_write('update','talents',['code'=>ke_generate_talent_code()],['id'=>$row['id']]);else ke_talent_code($row['code']);}
  $serials=[];foreach($wpdb->get_results('SELECT id,talent_id,created_at,version_day,day_serial FROM '.ke_table('talent_versions').' ORDER BY talent_id,created_at,id',ARRAY_A)as$row){$day=ke_talent_version_day($row['created_at']);$key=$row['talent_id'].':'.$day;$serials[$key]=($serials[$key]??0)+1;ke_db_write('update','talent_versions',['version_day'=>$day,'day_serial'=>$serials[$key]],['id'=>$row['id']]);}
  ke_db_query('COMMIT');
 }catch(Throwable $e){$wpdb->query('ROLLBACK');throw $e;}
 // DDL commits in MySQL; each step can be resumed without changing allocated codes.
 if(!$wpdb->get_var("SHOW INDEX FROM ".ke_table('talents')." WHERE Key_name='code'"))ke_db_query('ALTER TABLE '.ke_table('talents').' ADD UNIQUE KEY code (code)');
 if(!$wpdb->get_var("SHOW INDEX FROM ".ke_table('talent_versions')." WHERE Key_name='talent_day_serial'"))ke_db_query('ALTER TABLE '.ke_table('talent_versions').' ADD UNIQUE KEY talent_day_serial (talent_id,version_day,day_serial)');
 ke_db_query('ALTER TABLE '.ke_table('talents').' MODIFY code char(9) NOT NULL');ke_db_query('ALTER TABLE '.ke_table('talent_versions').' MODIFY version_day date NOT NULL, MODIFY day_serial bigint unsigned NOT NULL');
 if(in_array('uuid',$wpdb->get_col('SHOW COLUMNS FROM '.ke_table('talents')),true))ke_db_query('ALTER TABLE '.ke_table('talents').' DROP COLUMN uuid');
 update_option('ke_talents_schema_version','2',false);
}
if(defined('WP_CLI')&&WP_CLI)WP_CLI::add_command('ke talent-codes-init',function(){if(!ke_can_access())WP_CLI::error('Administrator required');try{ke_migrate_talent_codes();WP_CLI::success('Talent codes and dated versions ready.');}catch(Throwable $e){WP_CLI::error($e->getMessage());}});
