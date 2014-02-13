<?php

/**
 * BaseOperation
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $account_id
 * @property integer $type_id
 * @property date $operation_date
 * @property string $operation_name
 * @property string $operation_desc
 * @property boolean $is_credit
 * @property integer $value
 * @property Account $Account
 * 
 * @package    ##PACKAGE##
 * @subpackage ##SUBPACKAGE##
 * @author     ##NAME## <##EMAIL##>
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
abstract class BaseOperation extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('operation');
        $this->hasColumn('account_id', 'integer', null, array(
             'type' => 'integer',
             ));
        $this->hasColumn('type_id', 'integer', null, array(
             'type' => 'integer',
             ));
        $this->hasColumn('operation_date', 'date', null, array(
             'type' => 'date',
             'notnull' => true,
             ));
        $this->hasColumn('operation_name', 'string', null, array(
             'type' => 'string',
             ));
        $this->hasColumn('operation_desc', 'string', null, array(
             'type' => 'string',
             ));
        $this->hasColumn('is_credit', 'boolean', null, array(
             'type' => 'boolean',
             'notnull' => true,
             ));
        $this->hasColumn('value', 'integer', null, array(
             'type' => 'integer',
             ));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('Account', array(
             'local' => 'account_id',
             'foreign' => 'account_id'));
    }
}