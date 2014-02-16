
<?php
require_once 'vendor/autoload.php';
#require 'vendor/slim/slim/Slim/Middleware/HttpBasicAuth.php';
require_once 'php/config.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/hello/:name', 'authenticate', function ($name) {
    echo "Hello, $name";
});

$app->get('/loginAuto', 'authenticate', function () {
	#echo "Connexion automatique réussie";
	global $app;
	$uid = $app->getEncryptedCookie('uid');
    $key = $app->getEncryptedCookie('key');
    $user = Doctrine_Core::getTable('User')->findOneByUser_idAndPassword($uid, $key);
	$response = $app->response();
    $response['Content-Type'] = 'application/json';
	$id = $user->user_id;
	$firstname = $user->firstname;
	$lastname = $user->lastname;
	$email = $user->email;    

	$user_object = json_encode(array('user_id' => $id, 'firstname' => $firstname,
	 'lastname' => $lastname, 'email' => $email), JSON_FORCE_OBJECT);

	$response->body($user_object);
});

$app->post('/login', function () {
	global $app, $basicAuth;
    #echo "Tentative de connexion";

	$body = $app->request()->getBody();

    $body = json_decode($body, true);

    $email 		= $body['email'];
    $password 	= crypt($body['password'], $email);


    #echo " les champs sonts : $email, $password";
	$user = Doctrine_Core::getTable('User')->findOneByEmailAndPassword($email, $password);
	$response = $app->response();
	
    // On vérifie ici si l'user existe
    if ($user) {    	
	    try {
			$id = $user->user_id;
			$firstname = $user->firstname;
			$lastname = $user->lastname;
			$email = $user->email;
			$app->setEncryptedCookie('uid', $id, '60 minutes');
			$app->setEncryptedCookie('key', $password, '60 minutes');
			$app->setEncryptedCookie('uma', $email, '60 minutes');
			$uid = $app->getEncryptedCookie('uid');
    		$key = $app->getEncryptedCookie('key');
    		$uma = $app->getEncryptedCookie('uma');
			#echo "  Les cookies sont : $uid, $key, $uma";
			$response['Content-Type'] = 'application/json';
			// on crée notre objet
			$user_object = json_encode(array('user_id' => $id, 'firstname' => $firstname, 
				'lastname' => $lastname, 'email' => $email), JSON_FORCE_OBJECT);

			$response->body($user_object);

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
    #echo "inscription";
    $body = $app->request()->getBody();

    // on récupère les données du formulaire
    $body = json_decode($body, true);

    $email 		= $body['email'];
    $firstname 	= $body['firstname'];
    $lastname 	= $body['lastname'];
    $password 	= crypt($body['password'], $email);

    // On vérifie si un utilisateur avec cet email et ce mot de passe existe déjà
    $userAlreadyExist = Doctrine_Core::getTable('User')->findOneByEmail($email);
    if ($userAlreadyExist){
    	$app->halt(401);
    }

    #echo " les champs sonts : $email";
	$user = new User();
	$user->email 		= $email;
	$user->firstname 	= $firstname;
	$user->lastname 	= $lastname;
	$user->password 	= $password;

	$response = $app->response();

	if($user->trySave()){
	    try {
	    	$id = $user->user_id;
			$app->setEncryptedCookie('uid', $id, '60 minutes');
			$app->setEncryptedCookie('uma', $email, '60 minutes');
			$app->setEncryptedCookie('key', $password, '60 minutes');
			$uid = $app->getEncryptedCookie('uid');
			$key = $app->getEncryptedCookie('key');
    		$uma = $app->getEncryptedCookie('uma');
			#echo "les cookies sont : $uid, $key, $uma";
			$response['Content-Type'] = 'application/json';
			// on crée notre objet
			$user_object = json_encode(array('user_id' => $id, 'firstname' => $firstname, 
				'lastname' => $lastname, 'email' => $email), JSON_FORCE_OBJECT);

			$response->body($user_object);
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