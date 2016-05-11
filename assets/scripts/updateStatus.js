(function(SECTOR){

SECTOR.updateState = {
    init: function (){
        SECTOR.requestHandler.ee.addListener('response', this.eeListenerFn);
        this.getRequest();

    },
    currentChannel: document.getElementById('track-loader').dataset.channel,

    getRequest: function(){
        var xhrUrl = 'http://sectorradio.ru/api/track.php?channel=' + this.currentChannel;
            SECTOR.requestHandler.handleRequest(xhrUrl);

    },

    eeListenerFn: function (response) {
                 var trackNameContainer = document.getElementsByClassName('player__trackname')[0],
                    artistNameContainer = document.getElementsByClassName('player__title')[0],
                    timeTillTrackEnd = (response.length - (response.timestamp - response.serverTime))*1000; //milliseconds
                    //On response let's fill track name and artist name
                    trackNameContainer.textContent = response.title;
                    artistNameContainer.textContent = response.artist;

                //TODO разобраться с отрицательным временем до конца трека
                    if(timeTillTrackEnd<0){
                        timeTillTrackEnd = 3000;
                    }
                    //Обновляем ответ от сервера
                    setTimeout(SECTOR.requestHandler.updateResponse, timeTillTrackEnd-1000);
                    //Обращаемся к сохраненному, обновленному ответу
                    setTimeout(SECTOR.updateState.handleResponse, timeTillTrackEnd);
                }
};

    SECTOR.updateState.init();

})(window.SECTOR);