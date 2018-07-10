<?php
    $time = '+03:00';
    include('db.php');
    
    if ($db) {
        
        $result = $db->query(50);
        $current_date = '';
        $array_json = array();
        
        while($row = mysqli_fetch_object($result)) {
            $array_json[] = array(
                                  "artist" => $row->artist,
                                  "title" => $row->title,
                                  "time" => date('H:i', $row->timestamp)
                                  );
        }
        echo json_encode($array_json);
    }
