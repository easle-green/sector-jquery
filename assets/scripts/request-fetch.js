(function(SECTOR){
    SECTOR.requestHandler = {
        response: null,
        getResponse: function(url){
            if(!SECTOR.requestHandler.response){
                console.log('sending request');
               return fetch(url)
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(response){
                        SECTOR.requestHandler.response = response;
                        return new Promise(function (resolve){
                            resolve(response);
                        });
                });
            } else {
                console.log('not sending request');
                return new Promise (function(resolve){
                    //Вот тут я не очень уверен что правильно, но так сделано потому что в updateStatus.js функция заточена на обработку промиса
                    resolve(SECTOR.requestHandler.response);
                });
            }
        },
        updateResponse: function(){
            SECTOR.requestHandler.response = null;
        }   
    };
})(window.SECTOR);