<?php

require 'routesAPI.php';



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


function subsribes(\Slim\Route $route) {

}




?>