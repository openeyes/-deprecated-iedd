<?php

//This script updates the diagnosis, members and affecteds fields of the pedigree table
//by iterating over all the pedigrees and calling updateNewMember() on each.

//We'll test it with one pedigree first.
function __autoload($className){
    include 'class.' . $className . '.phpm';
}

$query = "select newgc from pedigree";
$db = HTDB_MySQL::getInstance();
$db->prepare($query);
$res = $db->execute();
while($row= $res->fetch_assoc())
{
	$newgc = $row['newgc'];
	$family = new HTTableFamily($newgc);
	$family->updateNewMember();
	//$family->display();
}

?>