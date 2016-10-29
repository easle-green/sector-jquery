<?php

define('KB', 1024);
define('MB', 1048576);
define('GB', 1073741824);

// Output JSON
function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status
    )));
}

// Check for errors
if($_FILES['SelectedFile']['error'] > 0){
    outputJSON('An error ocurred when uploading.');
}

//if(!getimagesize($_FILES['SelectedFile']['tmp_name'])){
//    outputJSON('Please ensure you are uploading an image.');
//}

// Check filetype
//if($_FILES['SelectedFile']['type'] != 'image/png'){
//    outputJSON('Unsupported filetype uploaded.');
//}

// Check filesize
if ( $_FILES['SelectedFile']['size'] > 400*MB ) {
    outputJSON('File uploaded exceeds maximum upload size.');
}

// Check if the file exists
if (file_exists('upload/' . $_FILES['SelectedFile']['name'])) {
    outputJSON('File with that name already exists.');
}

$filename = date('Y-m-d__H-i-s__') . $_FILES['SelectedFile']['name'];

// Upload file
if (!move_uploaded_file($_FILES['SelectedFile']['tmp_name'], '../private/' . $filename)) {
    outputJSON('Error uploading file - check destination is writeable.');
}

// Success!
outputJSON('File uploaded successfully to ' . $filename, 'success');