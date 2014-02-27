<?php
session_start();

function __autoload($className){
     include '../htt/class.' . $className . '.phpm';
}
$thisApp = HTApplication::getInstance();
$thisApp->start();
?>
