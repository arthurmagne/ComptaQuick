<?php
require 'vendor/autoload.php';
require 'vendor/slim/slim/Slim/Middleware/HttpBasicAuth.php';

\Slim\Slim::registerAutoloader();
echo "test";

$app = new \Slim\Slim();

$app->add(new \HttpBasicAuth());

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->run();

?>