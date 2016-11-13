'use strict';

(function () {
    var _submit = document.getElementById('music__select'),
        _file = document.getElementById('music__file'),
        _label = document.getElementById('music__name'),
        _progress = document.getElementById('music__progress'),
        _send = document.getElementById('music__send'),
        loading = false,
        total, resp, request, data, fileName;

    function buildFormData (fileName, appendFile) {
        data = new FormData();

		if ( appendFile ) {
			data.append('SelectedFile', _file.files[0]);
		}
        data.append('CHANNEL', document.querySelector('html').getAttribute('class').replace('channel-', '').replace('main', 'progressive'));
        data.append('FIO', document.getElementById('input_name').value);
        data.append('AKA', document.getElementById('input_nickname').value);
        data.append('COUNTRY', document.getElementById('input_country').value);
        data.append('EMAIL', document.getElementById('input_email').value);
        data.append('STYLES', document.getElementById('input_styles').value);
        data.append('FILE', fileName);

        return data;
    }

    var upload = function(e) {

        if( _file.files.length === 0 || loading === true ){
            return;
        }

        fileName = e.target.value.split( '\\' ).pop();
        _label.innerHTML = fileName;

        data = buildFormData(fileName, true);

        loading = true;
        _submit.classList.add('input__progress-loading');
        _progress.style.opacity = 1;
        _submit.classList.add('selected');

        request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(request.readyState == 4) {
                try {
                    resp = JSON.parse(request.response);
                } catch (e){
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                    loading = false;
                    _submit.classList.remove('input__progress-loading');
                    _send.classList.remove('disabled');
                    _progress.style.opacity = 0;
                }
                console.log(resp.status + ': ' + resp.data);
            }
        };

        request.upload.addEventListener('progress', function(e) {
            total = e.loaded/e.total * 100;
            console.log(e, e.loaded/e.total, total);

            _progress.style.width = total + '%';

            if ( total >= 100 ) {
                loading = false;
                _submit.classList.remove('input__progress-loading');
                SECTOR.file_uploaded = true;
                _progress.style.opacity = 0;

                if ( SECTOR.form_validator() ) {
                    _send.classList.remove('disabled');
                }
            }
        }, false);

        request.open('POST', '/uploader.php');
        request.send(data);
    };

    var sendData = function() {
        if ( _send.classList.contains('disabled') ) {
            return;
        }

        _send.classList.add('disabled', 'loading');
		_send.innerText = 'Отправка...';
		
        request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                _send.innerText = 'Спасибо!';
                _send.classList.remove('loading');
				setTimeout(function(){
					_send.innerText = 'Отправить';
				}, 3000);
            }
        };

        data = buildFormData(fileName);

        request.open('POST', '/sender.php');
        request.send(data);
    };

    _file.addEventListener('change', upload);
    _send.addEventListener('click', sendData);

})();