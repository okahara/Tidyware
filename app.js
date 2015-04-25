var app = angular.module('app', []);

// Loads the selected video from the Video bar into the main position
function loadVideo(playerUrl, autoplay) {
  swfobject.embedSWF(
      playerUrl + '&rel=1&border=0&fs=1&autoplay=' + 
      (autoplay?1:0)+'&autohide=1', 'player', '640', '390', '9.0.0', false, 
      false, {allowfullscreen: 'true'});
}

// Creates the content for the Video bar
function showMyVideos (data, $http) {
  var feed = data.feed;
  var entries = feed.entry || [];
  var html = ['<div ng-style="myStyle" id="videoList">'];
  for (var i = 1; i < entries.length; i++) {
    var entry = entries[i];
    var title = entry.title.$t.substr(0, 20);
    var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
    var playerUrl = entries[i].media$group.media$content[0].url;
    html.push('<div onclick="loadVideo(\'', playerUrl, '\', true)">',
              '<span class="titlec">', title, '...</span> <img src="', 
              thumbnailUrl, '" width="128" height="78""/>', '</div>');
    }
    html.push('</div>');
    document.getElementById('videos').innerHTML = html.join('');
    if (entries.length > 0) {
      loadVideo(entries[0].media$group.media$content[0].url, false);
    }
    videoBox = document.getElementById('videoList');
    video = document.querySelector('#videoList div');
    videoBox.style.width = (entries.length * video.offsetWidth) + "px";
}

// Loads first video 
app.service('VideosService', ['$window', function($window) {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  $window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'mkMVyw-7avI',
      playerVars: {
        autohide: 2,
        controls: 2,
        playsinline: 1
      }
    });
  }
}]);

// Controlls moving the Video bar display left or right
app.controller('VideosController', function ($scope, $http, $log, VideosService) {
  vidContainer = document.getElementById('videoList');  
  video = document.querySelector('#videoList div');
  var padding = ((video.offsetWidth - parseInt(window.getComputedStyle(video).width)) * 2);
  var pos = 0;
  videoWidth = (video.offsetWidth) * 2;

  $scope.moveLeft = function() {
    if (Math.abs(pos) > (videoWidth/2)) {
      pos += videoWidth;
    } else if (Math.abs(pos) - (videoWidth/2) == 0){
      pos += (videoWidth/2);
    }
    $scope.myStyle={ 
      left: pos+'px'
    }
  };

  $scope.moveRight = function() {
    if (Math.abs(pos) + (((videoWidth/2)*7) + (padding*2)) < parseInt(vidContainer.style.width)) {
      pos -= videoWidth;
    } else if (Math.abs(pos) + ((videoWidth/2)*7) == parseInt(vidContainer.style.width)){
      pos -= (videoWidth/2);
    }
    $scope.myStyle={ 
      left: pos+'px'
    }   
  };
});
