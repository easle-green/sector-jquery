<?php

define('mail', 'easle.green@gmail.com, jangorboun@yandex.ru');
define('subj', 'SECTOR || загружена музыка');

$body = '';
foreach($_POST as $key => $item) {
  $body .= $key . ': ' . $item . "\n";
}
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
mail(mail, subj, $body, $headers);
