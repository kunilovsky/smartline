<?php
require_once 'bootstrap/app.php';
$routes = app('router')->getRoutes();
$paths = array_map(fn($r) => $r->uri, $routes->getRoutes());

if (in_array('backend', $paths) || in_array('backend/{path?}', $paths)) {
    echo "Ok";
} else {
    echo "No";
}