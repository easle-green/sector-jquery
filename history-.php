<?php
    $time = '+03:00';
    include('db.php');

    if ($db) {

        $tpl_text = '
            <div class="history-track">
                <time>%s</time>
                <div class="history-track-name"><strong>%s</strong> &mdash; %s</div>
            </div>
        ';

        $tpl_delimiter = '
            <div class="history-delimiter">
                <span class="history-delimiter-text">%s %s</span>
            </div>
        ';

        $months = array(
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        );

        $result = $db->query($channel, 500);
        $current_date = '';

        while($row = mysqli_fetch_object($result)) {

            if (date('j', $row->timestamp) != $current_date) {
                if (date('j') == date('j', $row->timestamp)) {
                    $day = '';
                    $month = 'сегодня';
                } else {
                    $day = date('d', $row->timestamp);
                    $month = $months[(date('n', $row->timestamp)-1)];
                }
                echo sprintf(
                    $tpl_delimiter,
                    $day,
                    $month
                );
            }

            $current_date = date('j', $row->timestamp);
			
			//if ($row->casttitle && strstr($row->casttitle, '|')) {
			//	$string = explode('|', $row->casttitle);
			//	$artist = trim($string[0]);
			//	$title = trim($string[1]);
			//} else {
				$artist = $row->artist;
				$title = $row->title;
			//}

			echo sprintf($tpl_text, date('H:i', $row->timestamp), $artist, $title);
            
        }
    }
