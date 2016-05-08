<?php

	# http://sectorradio.ru/list.php?
	# channel=progressive&
	# artist=%artist&
	# title=%title&
	# casttitle=%casttitle&
	# secure=521dsdceD4t&
	# len=%len&
	# time=%seconds&
	# listeners=%listeners

	header('Content-type: text/json');
	header('Content-type: application/json');
	
	if($_GET['secure'] != '521dsdceD4t') {
		echo 0;
		exit;
	}
	echo 1;
	
	$artist = $_GET['artist']? $_GET['artist'] : '';
	$title = $_GET['title']? $_GET['title'] : '';
	$cast  = $_GET['casttitle']? $_GET['casttitle'] : '';

	$channel = $_GET['channel'];
	$filename = 'nowplaying-progressive.txt';
	$json = 'progressive.json';

	if ( $channel !== '' ) {
		$filename = "nowplaying-" . $channel . ".txt";
		$json = $channel . ".json";
	}

	/*
	if ($cast && strstr($cast, '|')) {
		$string = explode('|', $cast);
		$str = '
			<div class="title player__title">' . trim($string[0]) . '</div>
			<div class="trackname player__trackname">' . trim($string[1]) . '</div>';
	} else {
	*/

	$str = '
		<div class="title player__title">' . $artist . '</div>
		<div class="trackname player__trackname">' . $title . '</div>
  ';
	$file = fopen($filename, 'w+');
	fwrite($file, $str);
	fclose($file);

	$date = new DateTime(null, new DateTimeZone('Europe/Moscow'));
	$timestamp = $date->getTimestamp();
	$contents = '
	{
		"artist": "' . addslashes($artist) . '",
		"title": "' . addslashes($title) . '",
		"serverTime": ' . $timestamp . ',
		"timestamp": ___timestamp___,
		"time": "' . $_GET['len'] . '",
		"length": ' . $_GET['time'] . '
	}
	';
	$file = fopen('./api/' . $json, 'w+');
	fwrite($file, $contents);
	fclose($file);

	// + в БД
	$time = '+03:00';
	include('db.php');
	$db->add($artist, $title, $cast);
