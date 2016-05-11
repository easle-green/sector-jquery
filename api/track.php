<?php

	header('Content-type: text/json');
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");

  $channel = $_GET['channel'];

  $permitted = ['progressive', 'space'];

  if ( !in_array($channel, $permitted ) ) {
    $channel = $permitted[0];
  }

  $date = new DateTime(null, new DateTimeZone('Europe/Moscow'));
  $timestamp = $date->getTimestamp();

  $filename = $channel . '.json';
  $file = implode('', file($filename));
  echo str_replace(array("___timestamp___", "\'", "\t", "\r", "\n"), array($timestamp, "'", ''), $file);

?>