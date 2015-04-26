var app = angular.module('app', []);

// Creates the content for the Video bar
function showMyVideos (data, $http) {
  var feed = data.feed;
  var entries = feed.entry || [];
  var html = ['<div ng-style="myStyle" id="videoList">'];
  for (var i = 1; i < entries.length; i++) {
    var entry = entries[i];
    var title = entry.title.$t.substr(0, 20);
    var thumbnailUrl = entry.media$group.media$thumbnail[0].url;
    var playerUrl = entry.media$group.yt$videoid.$t;
    html.push('<div class="video" ng-click="loadVideo(\'', playerUrl, '\')">',
              '<span class="titlec">', title, '...</span> <img src="', 
              thumbnailUrl, '" width="128" height="78""/>', '</div>');
    }
    html.push('</div>');
    document.getElementById('videos').innerHTML = html.join('');
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
    new YT.Player('player', {
      playerVars: {
        controls: 2,
        playsinline: 1
      }
    });
  }
}]);

// Controlls functionality of the Video bar including left and right sliding and the onclick event
app.controller('VideosController', function ($scope, $http, $log, VideosService) {
   $scope.loadVideo = function(id){
    document.getElementById('player').src = "https://www.youtube.com/embed/"+ id +"?autoplay=1&html5=1&origin=//travisokahara.com"
  }

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
