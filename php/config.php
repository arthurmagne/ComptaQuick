<?php


define('CFG_DB_DSN', 'mysql://ldjerbi:pcctv49@dbserver/ldjerbi');

require_once(dirname(__FILE__).'/../Doctrine-1.2.4/Doctrine.php');

spl_autoload_register(array('Doctrine_Core', 'autoload'));
spl_autoload_register(array('Doctrine_Core', 'modelsAutoload'));


$database = Doctrine_Manager::connection(CFG_DB_DSN);

try
{
$test = $database->execute("SHOW TABLES");
var_dump($test);

while($row = $test->fetch(PDO::FETCH_NUM))
  print_r($row);


}
catch (Exception $e) {
    echo $e->getMessage();
}
// 



/*echo var_dump($database)."\n";

try {
    $dbh = new PDO('mysql:host=dbserver;dbname=ldjerbi', 'ldjerbi', 'pcctv49');  
    
        $tableList = array();
        $result = $dbh->query("SHOW TABLES");
        while ($row = $result->fetch(PDO::FETCH_NUM)) 
        {
            $tableList[] = $row[0];
        }
        print_r($tableList);
    }
catch (PDOException $e) {
    echo $e->getMessage();
}
*/

$manager = Doctrine_Manager::getInstance();


$manager->setAttribute(Doctrine_Core::ATTR_VALIDATE,               Doctrine_Core::VALIDATE_ALL);
$manager->setAttribute(Doctrine_Core::ATTR_AUTO_ACCESSOR_OVERRIDE, true);
$manager->setAttribute(Doctrine_Core::ATTR_AUTOLOAD_TABLE_CLASSES, true);
$manager->setAttribute(Doctrine_Core::ATTR_MODEL_LOADING,          Doctrine_Core::MODEL_LOADING_CONSERVATIVE);
Doctrine_Core::loadModels('models/');





?>
