<?php


$comJson=json_decode(file_get_contents("https://m.kuaidi100.com/autonumber/auto?num=".$_GET['nu']),true);

$comcode=$comJson[0]["comCode"];

echo file_get_contents("https://m.kuaidi100.com/query?postid=".$_GET['nu']."&type=".$comcode);


?>