
<?php
require_once 'vendor/autoload.php';
#require 'vendor/slim/slim/Slim/Middleware/HttpBasicAuth.php';
require_once 'php/config.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/hello/:name', 'authenticate', function ($name) {
    echo "Hello, $name";
});

$app->post('/login', function () {
	global $app, $basicAuth;
    echo "Tentative de connexion";
    $email = $app->request()->post('email');
    $password = $app->request()->post('password');


	$body = $app->request()->getBody();

    $body = json_decode($body, true);

    $email 		= $body['email'];
    $password 	= crypt($body['password'], $email);


    #echo " les champs sonts : $email, $password";
	$user = Doctrine_Core::getTable('User')->findOneByEmailAndPassword($email, $password);
	
    // On vérifie ici si l'user existe
    if ($user) {    	
	    try {
			$id = $user->user_id;
			$app->setEncryptedCookie('uid', $id, '60 minutes');
			$app->setEncryptedCookie('key', $password, '60 minutes');
			$app->setEncryptedCookie('uma', $email, '60 minutes');
			$uid = $app->getEncryptedCookie('uid');
    		$key = $app->getEncryptedCookie('key');
    		$uma = $app->getEncryptedCookie('uma');
			echo "  Les cookies sont : $uid, $key, $uma";
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

$app->post('/subscribe', function () {
	global $app;
    echo "inscription";
    $body = $app->request()->getBody();

    /*$email 		= $app->request()->post('email');
    $firstname 	= $app->request()->post('firstName');
    $lastname 	= $app->request()->post('lastName');
    $password 	= $app->request()->post('password');*/
    #echo $body;

    $body = json_decode($body, true);

    $email 		= $body['email'];
    $firstname 	= $body['firstname'];
    $lastname 	= $body['lastname'];
    $password 	= crypt($body['password'], $email);


    echo " les champs sonts : $email";
	$user = new User();
	$user->email 		= $email;
	$user->firstname 	= $firstname;
	$user->lastname 	= $lastname;
	$user->password 	= $password;

	if($user->trySave()){
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
	}
	else{
		$app->halt(400);
	}

    
});


$app->run();
?>