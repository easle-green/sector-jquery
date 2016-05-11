(function(SECTOR){
    SECTOR.requestHandler = {
        ee: new EventEmitter(),
        response: null,
        handleRequest: function (url) {
            var xhr = new XMLHttpRequest(),
                self = this;
            xhr.open('GET', url);
            xhr.responseType = 'json';
            xhr.onloadend = function() {
              if(xhr.readyState === 4 && xhr.status === 200){
                self.response = xhr.response;
                self.ee.emitEvent('response', [self.response]);
              }
            };
            if (!self.response){
                xhr.send();
                console.log('sending request');
            } else {
                self.ee.emitEvent('response', [self.response]);
                console.log('not sending request');
                return;
            } 
        },
        updateResponse: function(){
            SECTOR.requestHandler.response = null;
        }
    };

})(window.SECTOR);