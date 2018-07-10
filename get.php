<?php

	$site = 'http://sectorradio.ru/';
	$dir = 'downloads/';
	
	$get = $_GET['file'];
	
	if ( !$get ) {
		exit;
	}
	
	$file = preg_replace(array('/\.\./', '/\//'), '', $get);
	$download = $dir . $file;
	
	if ( !file_exists($download) ) {
		exit;
	}
	
	$filename = $download . '.txt';
	
	if ( !file_exists($filename) ) {
		$num = 0;
	} else {
		$num = intval(file_get_contents($filename));
	}

	$num++;
	file_put_contents($filename, $num);
		
	header( 'Location: ' . $site . $dir . $get, true, 301 );

?>