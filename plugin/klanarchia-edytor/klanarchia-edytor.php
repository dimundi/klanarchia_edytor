<?php
/**
 * Plugin Name: Klanarchia — Edytor
 * Description: Edytor postaci i talentów Klanarchii. Pierwszy etap: dostęp administratora.
 * Version: 0.2.0
 */
if (!defined('ABSPATH')) exit;

require_once __DIR__.'/includes/database.php';
require_once __DIR__.'/includes/validation.php';
require_once __DIR__.'/includes/api.php';

function ke_can_access() { return is_user_logged_in() && current_user_can('manage_options'); }
function ke_is_page() { return is_page() && get_page_uri(get_queried_object_id()) === 'klanarchia/edytor'; }
function ke_requested() { return isset($_GET['ke_app']) && is_string($_GET['ke_app']) && $_GET['ke_app'] === 'postaci'; }
function ke_language() {
    $language = function_exists('pll_current_language') ? pll_current_language('slug') : substr(determine_locale(), 0, 2);
    return $language === 'en' ? 'en' : 'pl';
}
function ke_dev_server() {
    return in_array(wp_get_environment_type(), ['local', 'development'], true) ? untrailingslashit((string) getenv('KLANARCHIA_EDITOR_DEV_SERVER')) : '';
}
add_action('template_redirect', function () {
    if (!ke_is_page()) return;
    // Odpowiedź zależy od konta: nigdy nie udostępniamy jej przez wspólny cache.
    if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true);
    nocache_headers();
    if (ke_requested() && !ke_can_access()) {
        wp_die(ke_language() === 'en' ? 'Administrator access required.' : 'Edytor jest dostępny wyłącznie dla administratora.', 'Klanarchia', ['response' => 403]);
    }
});
add_filter('render_block_core/group', function ($html, $block) {
    if (!ke_is_page() || !ke_can_access() || ke_requested()) return $html;
    $classes = preg_split('/\s+/', $block['attrs']['className'] ?? '');
    if (!in_array('klan-editor-module', $classes, true)) return $html;
    // Istniejące moduły pozostają w treści WP; dodajemy wejście wyłącznie do modułu postaci.
    if (!preg_match('/<h2\b[^>]*>\s*Edytor postaci\s*<\/h2>/u', $html)) return $html;
    $label = ke_language() === 'en' ? 'Character editor' : 'Edytor postaci';
    $button = '<p><a class="klan-button" href="'.esc_url(add_query_arg('ke_app', 'postaci', get_permalink())).'">'.esc_html($label).'</a></p>';
    $position = strrpos($html, '</div>');
    return $position === false ? $html : substr_replace($html, $button, $position, 0);
}, 10, 2);
add_filter('the_content', function ($content) {
    if (!ke_is_page() || !ke_requested() || !ke_can_access() || !in_the_loop() || !is_main_query()) return $content;
    $config = ['language' => ke_language(), 'userId' => get_current_user_id(), 'apiUrl' => rest_url('klanarchia-editor/v1/bootstrap'), 'nonce' => wp_create_nonce('wp_rest')];
    return '<main id="main"><div id="klanarchia-editor" data-config="'.esc_attr(wp_json_encode($config)).'"></div><noscript>JavaScript jest wymagany / JavaScript is required.</noscript></main>';
}, 20);
add_action('rest_api_init', function () {
    register_rest_route('klanarchia-editor/v1', '/bootstrap', [
        'methods' => 'GET', 'permission_callback' => 'ke_can_access',
        'callback' => function () {
            $response = new WP_REST_Response(['status' => 'ok', 'language' => ke_language(), 'permissions' => ['accessEditor' => true]]);
            $response->header('Cache-Control', 'no-store, private');
            return $response;
        }
    ]);
});
add_action('wp_enqueue_scripts', function () {
    if (!ke_is_page() || !ke_requested() || !ke_can_access()) return;
    $dev = ke_dev_server();
    if ($dev) {
        wp_enqueue_script('ke-vite', $dev.'/@vite/client', [], null, true);
        wp_enqueue_script('ke-app', $dev.'/src/main.tsx', ['ke-vite'], null, true);
        return;
    }
    $manifest_path = __DIR__.'/dist/.vite/manifest.json';
    if (!is_file($manifest_path)) return;
    $manifest = json_decode(file_get_contents($manifest_path), true);
    $entry = $manifest['src/main.tsx'] ?? null;
    if (!$entry) return;
    wp_enqueue_script('ke-app', plugins_url('dist/'.$entry['file'], __FILE__), [], null, true);
    foreach ($entry['css'] ?? [] as $index => $css) wp_enqueue_style('ke-app-'.$index, plugins_url('dist/'.$css, __FILE__), [], null);
});
add_filter('script_loader_tag', function ($tag, $handle) {
    if (!in_array($handle, ['ke-vite', 'ke-app'], true)) return $tag;
    return wp_get_script_tag(['type' => 'module', 'src' => wp_scripts()->registered[$handle]->src, 'id' => $handle.'-js']);
}, 10, 2);
