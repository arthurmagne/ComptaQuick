<?php
include('config.php');



define('CREDIT', 1);
define('DEBIT', 2);

function getAccounts($idUser)
{
  $table = Doctrine_Core::getTable('Account');
  
  return $table->findByUser_id($idUser);
}



function getOperations($idAccount, $begin=0 , $end=0, $type=0, $limit=0)
{
  $query = Doctrine_Query::create()->select('o.*, p.type_name as type_name')
				  ->from('Operation o')
				  ->leftJoin('o.PaymentType p')
				  ->where('o.account_id = :idAccount', array(":idAccount" => $idAccount));
  
  
  
  if($begin == 0 && $end == 0)
  {
    $month = date('m');
    $query->addWhere('o.operation_date = MONTH(o.operation_date)');
  }
  
  
  
  
  
  
  
  if($begin != 0)
    $query->addwhere('o.operation_date >= :beginDate',  array(':beginDate' => $begin));
								 
  if($end != 0)
    $query->addwhere('o.operation_date <= :endDate', array(':endDate' => $end));
								
  switch($type)
  {
    case CREDIT:
      $query->addWhere('o.is_credit');
      break;
    case DEBIT:
      $query->addWhere('NOT o.is_credit');
  }
  
  $query->orderBy('operation_date', 'DESC');
  
  if($limit > 0)
    $query->limit($limit);
    
  return $query->execute();  
}



function operation($isCredit, $idAccount, $value, $payment_id="", $operation_name="", $operation_desc="", $date=0)
{
  //check idAccount ?
  //check payment
  
  $operation = new Operation();
  $operation->id_account = $idAccount;
  $oparation->is_credit = $isCredit;
  $operation->value = $value;
  $operation->operation_name = $operation_name;
  $operation->operation_desc = $operation_desc;
  
  if($payment_id != 0)
     $operation->type_id;
  
  //if date isn't set, use today's date with format "yyyy/mm/dd"
  $operation_date = ($date == 0) ? date('Y/m/d') : $date;
  
  $operation->save();


  $account = Doctrin_Core::getTable('account')->findOneByAccount_id($idAccount);
  $account->balance += ($isCredit) ? $value : -($value);
  $account->save();
}



function debit($idAccount, $value, $payment_id="", $operation_name="", $operation_desc="", $date=0)
{
  operation(FALSE, $idAccount, $value, $payment_id, $operation_name, $operation_desc, $date);
}

function credit($idAccount, $value, $payment_id="", $operation_name="", $operation_desc="", $date=0)
{
  operation(TRUE, $idAccount, $value, $payment_id, $operation_name, $operation_desc, $date);
}


//cache previous balance ??
function balanceFromAccount($idAccount)
{
  $q =  Doctrine_Query::create()->select('SUM(value) as total')->from('Operation o')
	      ->where('o.account_id = :idAccount', array(":idAccount" => $idAccount))
	      ->groupBy('is_credit')->orderBy('is_credit')->execute();

  $debit = $q[0]->total;
  $credit = $q[1]->total;
	      
	      

  return $credit - $debit;
}

function balanceFromUser($idUser)
{
  $accounts = getAccounts($idUser);
  $arr = array();
  foreach($accounts as $account)
    $arr[$account->account_id] = balanceFromAccount($account->account_id);
    
  return $arr;
}




//example
/*
  $operations = getOperations(1,0,0, CREDIT);
 
 for($i = 0; $i < $operations->count(); ++$i)
{
  echo "account: ".$operations[$i]->account_id."\n";
  echo "\t".$operations[$i]->operation_date."\n";
  echo "\tcredit : ".$operations[$i]->is_credit."\n";
  echo "\t".$operations[$i]->value."\n";
  echo "\t".$operations[$i]->type_name."\n";
  
}*/
// 



?>