<?php

  date_default_timezone_set('Europe/Moscow');

	header('Content-type: text/json');
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");

  $channel = $_GET['channel'];

  $permitted = ['progressive', 'space', 'next', 'nota', 'geny'];

  if ( !in_array($channel, $permitted ) ) {
    $channel = $permitted[0];
  }

  $date = new DateTime(null, new DateTimeZone('Europe/Moscow'));
  $timestamp = $date->getTimestamp();

  $time = new stdClass();
  $time->week = new stdClass();
  $time->week->short = date("D", $timestamp);
  $time->week->full = date("l", $timestamp);
  $time->week->int = date("N", $timestamp);
  $time->hours = date("G", $timestamp);
  $time->timezone = new stdClass();
  $time->timezone->code = date("e", $timestamp);
  $time->timezone->difference = date("O", $timestamp);
  $time->timezone->delta = date("Z", $timestamp);
  $time->full = date("r", $timestamp);

  $filename = $channel . '.json';
  $file = implode('', file($filename));
  echo str_replace(array(
      "___timestamp___",
      "___time___",
      "\'", "\t", "\r", "\n"),
  array(
      $timestamp,
      json_encode($time),
      "'", ''),
  $file);

?>