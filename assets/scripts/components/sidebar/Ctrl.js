module.exports = function(sector) {
  "use strict";
  sector.controller('SidebarCtrl', function ($rootScope, $scope) {
    
  })
    .directive('sidebar', function () {
      return {
        restrict: 'A',
        link: function () {
          let button = document.querySelector('#menu-trigger');
          let container = document.querySelector('#st-container');
          let innerContainer = document.querySelector('#st-pusher');

          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add('st-menu-open');
            innerContainer.classList.add('passive');
          });

          container.addEventListener('click', () => {
            if(container.classList.contains('st-menu-open')) {
              container.classList.remove('st-menu-open');
              innerContainer.classList.remove('passive');
            }
          });
        }
        
      }
    });
};