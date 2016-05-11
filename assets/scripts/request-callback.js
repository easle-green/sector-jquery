(function(SECTOR){
  SECTOR.requestHandler = {
    response: null,
    handleRequest: function (url, callback) {
    var xhr = new XMLHttpRequest(),
    self = this;
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onloadend = function() {
      if(xhr.readyState === 4 && xhr.status === 200){
        self.response = xhr.response;
        callback(xhr.response);
      }
    };
    if (!self.response){
      xhr.send();
      console.log('sending request');
    } else {
      callback(self.response);
      console.log('not sending request');
      return;
    } 
  },

  updateResponse: function(){
    SECTOR.requestHandler.response = null;
  }
};

setInterval(SECTOR.requestHandler.updateResponse, 5000);

})(window.SECTOR);