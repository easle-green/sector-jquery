<?php

	date_default_timezone_set('Europe/Moscow');

	header('Content-type: text/json');
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");

	$channel = $_GET['channel'];

	$permitted = ['progressive', 'space', 'next', 'nota'];

	if ( !in_array($channel, $permitted ) ) {
		$channel = $permitted[0];
	}
  
    $time = '+03:00';
    include('../db.php');
    
    if ($db) {
		
		$limit = 100;
		$offset = 0;
		
		if ( (int)$_GET['limit'] ) {
			$limit = (int)$_GET['limit'];
		}
		
		if ( (int)$_GET['offset'] ) {
			$offset = (int)$_GET['offset'];
		}
        
        $result = $db->query($channel, $limit, $offset);
        $current_date = '';
        $array_json = array();
        
        while($row = mysqli_fetch_object($result)) {
            $array_json[] = array(
                                  "artist" => $row->artist,
                                  "title" => $row->title,
                                  "time" => date('H:i', $row->timestamp),
								  "time_full" => date('D, d M Y H:i:s', $row->timestamp),
								  "timestamp" => $row->timestamp,
								  "channel" => $row->channel
                                  );
        }
        echo json_encode($array_json);
    }
