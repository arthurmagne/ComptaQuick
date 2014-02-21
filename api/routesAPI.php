
<?php
require_once 'vendor/autoload.php';
#require 'vendor/slim/slim/Slim/Middleware/HttpBasicAuth.php';
require_once 'php/config.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/hello/:name', 'authenticate', function ($name) {
    echo "Hello, $name";
});

$app->get('/logout', function () {
    global $app;
	$app->deleteCookie('uid');
    $app->deleteCookie('key');
    $app->deleteCookie('uma');
});

$app->get('/loginAuto', 'authenticate', function () {
	#echo "Connexion automatique réussie";
	global $app;
	$uid = $app->getEncryptedCookie('uid');
    $key = $app->getEncryptedCookie('key');
    $user = Doctrine_Core::getTable('User')->findOneByUser_idAndPassword($uid, $key);
	$response = $app->response();
    $response['Content-Type'] = 'application/json';  

	$user_object = json_encode($user->toArray());

	$response->body($user_object);
});

$app->get('/accounts', 'authenticate', function () {
	#echo "Connexion automatique réussie";
	global $app;
	$uid = $app->getEncryptedCookie('uid');
    $accounts = Doctrine_Core::getTable('Account')->findByUser_id($uid);

	$response = $app->response();
    $response['Content-Type'] = 'application/json';
    $json = json_encode($accounts->toArray());

	$response->body($json);
});

$app->post('/addAccount', 'authenticate', function () {
	global $app;
	$uid = $app->getEncryptedCookie('uid');

	$body = $app->request()->getBody();

    // on récupère les données du formulaire
    $body = json_decode($body, true);

    $id 		= $body['account_number'];
    $name 	    = $body['account_name'];
    $balance 	= $body['balance'];

	$account = new Account();
	if ($id != ""){
		$account->account_id = $id;
	}
	$account->account_name = $name;
	if ($balance != ""){
		$account->balance = $balance;
	}else{	
		$account->balance = 0;
	}
	$account->user_id = $uid;

	$response = $app->response();

	if($account->trySave()){
		try{
			$response['Content-Type'] = 'application/json';
			// on crée notre objet
			$account_object = json_encode($account->toArray());
			$response->body($account_object);
 		} catch (Exception $e) {
			$app->response()->status(400);
			$app->response()->header('X-Status-Reason', $e->getMessage());
		}
	}
	else{
		$app->halt(400);
	}
});


$app->delete('/account/:id', 'authenticate', function ($id) {
	global $app;
    $account = Doctrine_Core::getTable('Account')->findOneByAccount_id($id);
    $account->delete();
	echo "compte supprimé";
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
			$user_object = json_encode($user->toArray());

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
			$user_object = json_encode($user->toArray());

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