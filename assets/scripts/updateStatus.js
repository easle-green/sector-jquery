(function(SECTOR){

SECTOR.updateState = {
    currentChannel: document.getElementById('track-loader').dataset.channel,

    request: function(callback){
        var xhr = new XMLHttpRequest(),
                self = this;
        xhr.open('GET', 'http://sectorradio.ru/api/track.php?channel=' + this.currentChannel );
        xhr.responseType = 'json';
        xhr.onloadend = function(){
            if (xhr.readyState === 4 && xhr.status === 200){
                callback(xhr.response);
            }
        };
            xhr.send();
    },

    handleResponse: function(){
        var xhrUrl = 'http://sectorradio.ru/api/track.php?channel=' + this.currentChannel,
            self = this;
        SECTOR.requestHandler.handleRequest(xhrUrl, function(response){
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
            setTimeout(self.handleResponse.bind(self), timeTillTrackEnd);
        })
    },

    init: function (){
        this.handleResponse();
    }
};

SECTOR.updateState.init();

})(window.SECTOR);