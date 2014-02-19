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
  $query = Doctrine_Query::create()->from('Operation o')->where('o.account_id = :idAccount', array(":idAccount" => $idAccount));
  
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
	      
	      
//   echo 'debit : '.$debit."\n";
//   echo 'credit : '.$credit."\n";
//  
  
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


function find_account($idAccount)
{

/*
  $query = Doctrine_Query::create()->select('Account.*, (total_credit - total_debit) as balance');
 

  $queryCredits =  $query->addComponent(select('a.account_id as account_id, sum(value) as total_credit')
					  ->from('Account a')
					  ->leftJoin('Operation o on a.account_id=o.account_id')
					  ->where('account_id = :accountId', array(':accountId' => $idAccount))
					  ->andwhere('is_credit')
					  ->groupBy('o.account_id');
					  
					  /*
  $queryDebits = Doctrine_Query::create()->select('a.account_id as account_id, sum(value) as total_dedit')
					  ->from('Account a JOIN Operation o on a.account_id=o.account_id')
					  ->where('account_id = :accountId', $account_id)
					  ->andwhere('is_credit')
					  ->groupBy('o.account_id'); 

  $query = $query->from($queryCredits->getDql().' as credits')->leftJoin($queryDebits->getDql().' as debits ON credits.account_id = debits.account_id')
						    ->leftJoin('account ON account.account_id = credits.account_id');
  
 
  // $query->from('Account'); 
  */ 
 // $query->from('Account')->leftJoin($queryCredits->execute().' as credits ON Account.account_id = credits.account_id');
 /* $query = Doctrine_Query::create('
				select account.*, totalCredit - totalDebit as solde
				FROM 
				(select a.account_id as account_id, sum(value) as totalCredit from account a JOIN operation o on a.account_id=o.account_id where is_credit group by o.account_id) as credits
				JOIN 
				(select a.account_id as account_id, sum(value) as totalDebit from account a JOIN operation o on a.account_id=o.account_id where not is_credit group by o.account_id) as debits
				ON credits.account_id = debits.account_id
				JOIN
				account on account.account_id = credits.account_id'
				, array(accout
  */
  
  $query = Doctrine_Manager::getInstance()->connection()->execute('select account.*, totalCredit - totalDebit as balance
	  FROM 
	  (select a.account_id as account_id, sum(value) as totalCredit from account a JOIN operation o on a.account_id=o.account_id where is_credit group by o.account_id) as credits
	  JOIN 
	  (select a.account_id as account_id, sum(value) as totalDebit from account a JOIN operation o on a.account_id=o.account_id where not is_credit group by o.account_id) as debits
	  ON credits.account_id = debits.account_id
	  JOIN
	  account on account.account_id = credits.account_id where account.account_id = :accountId', array(':accountId'=> $idAccount));
  
  //echo $query->getSqlQuery()."\n";

  
}


//example

// $operations = getOperations(1, '2014/01/01', '2014/06/17', CREDIT);
// 
// for($i = 0; $i < $operations->count(); ++$i)
// {
//   echo "account: ".$operations[$i]->account_id."\n";
//   echo "\t".$operations[$i]->operation_date."\n";
//   echo "\tcredit : ".$operations[$i]->is_credit."\n";
//   echo "\t".$operations[$i]->value."\n";
//   
// }

//find_account(1);
?>