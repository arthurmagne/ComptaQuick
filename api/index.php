<?php
require 'vendor/autoload.php';
require 'vendor/slim/slim/Slim/Middleware/HttpBasicAuth.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$basicAuth = new \HttpBasicAuth();

#$app->add(new \HttpBasicAuth());

/*public function authenticate(\Slim\Route $route) {
        if(!ctype_alnum($username))
            return false;
         
        if(isset($username) && isset($password)) {
            echo 'login in !';
            //$password = crypt($password);
            if ($username == 'root' && $password == 'root'){
            // Check database here with $username and $password
                echo 'connexion réussie';
                return true;
            }else{
                echo 'connexion échouée';
                $this->deny_access();
                return false;
            }
        }
        else
            return false;
}*/

// route middleware for simple API authentication
function authenticate(\Slim\Route $route) {
    $app = \Slim\Slim::getInstance();
    $uid = $app->getEncryptedCookie('uid');
    $key = $app->getEncryptedCookie('key');
    if (validateUserKey($uid, $key) === false) {
      $app->halt(401);
    }else{
    	echo "Vous passez !";
    }
}

function validateUserKey($uid, $key) {
  // insert your (hopefully more complex) validation routine here
  if ($uid == 'demo' && $key == 'demo') {
    return true;
  } else {
    return false;
  }
}


/**  Routes
**************************/

$app->get('/hello/:name', 'authenticate', function ($name) {
    echo "Hello, $name";
});

$app->post('/login', function () {
	global $app, $basicAuth;
    echo "Tentative de connexion";
    $email = $app->request()->post('email');
    $password = $app->request()->post('password');

    // On vérifie ici si l'user existe
    if (true) {    	
	    try {
			$app->setEncryptedCookie('uid', $email, '60 minutes');
			$app->setEncryptedCookie('key', $password, '60 minutes');
			$uid = $app->getEncryptedCookie('uid');
    		$key = $app->getEncryptedCookie('key');
			echo "les cookies sont : $uid, $key";
		} catch (Exception $e) {
			$app->response()->status(400);
			$app->response()->header('X-Status-Reason', $e->getMessage());
		}
	}else{
		// l'user n'existe pas
		$app->halt(401);
	}
	#$basicAuth->authenticate($email, $password);
    
});

$app->run();

?>