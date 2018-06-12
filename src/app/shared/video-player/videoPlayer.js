var app = angular.module("videoPlayer", [])

/**
 * Uma diretiva base para fazer outras
 */
.directive(
    'videoPlayer', [function() {

            return {
                restrict: 'EA',

                controller: 'VideoPlayerCtrl',

                scope: {
                    src: '=',
                    player: '=?'
                },

                link: function(scope, element, attrs, controllers) {
                    scope.$watch('src', function(link) {
                        var div = element[0].querySelector('div');
                        div.innerHTML = "";
                        console.log(link);
                        if (link) {
                            scope.player = new YoutubePlayer(link, div);
                            console.log(window.teste = scope.player);
                        }
                    });
                },
                templateUrl: 'app/shared/video-player/partials/videoPlayer.tpl.html'
            };
        }
    ]
)
.controller('VideoPlayerCtrl', ['$scope', function($scope) {
    
}]);


// ----- Youtube Player ----- //
function YoutubePlayer(link, element) {
    this._link = link;
    this._element = element;
    this.ready = false;
    
    if (!window.YT) {
        // Se o YT não está carregado, carregue
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var $this = this;
        // Ao concluir o download, crie o iframe do vídeo
        window.onYouTubeIframeAPIReady = function() {
            $this._createIframe();
        }
    } else {
        // Se está carregado, apenas crie o próprio iframe
        $this._createIframe();
    }
}
                    
YoutubePlayer.prototype._createIframe = function() {
    this._platformPlayer = new YT.Player(this._element, {
        videoId: this.getVideoId(),
        events: {
            'onReady': this._onPlayerReady.bind(this),
            'onStateChange': onPlayerStateChange
        },
        playerVars: {rel: 0}
    });
    
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            
        }
    }
    
};

YoutubePlayer.prototype._onPlayerReady = function(event) {
    this.ready = true;
};
 
YoutubePlayer.prototype.getVideoId = function() {
    var regex = /(\?v=|\&v=|\/\d\/|\/embed\/|\/v\/|\.be\/)([a-zA-Z0-9\-\_]+)/;
    var id = this._link.match(regex)[2];
    return id;
};

YoutubePlayer.prototype.seekTo = function(second) {
    return this.ready ? this._platformPlayer.seekTo(second) : null;
};

YoutubePlayer.prototype.getCurrentTime = function(second) {
    return this.ready ? this._platformPlayer.getCurrentTime() : null;
};

YoutubePlayer.prototype.pauseVideo = function() {
    return this.ready ? this._platformPlayer.pauseVideo() : null;
};

YoutubePlayer.prototype.getDuration = function() {
    return this.ready ? this._platformPlayer.getDuration() : null;
};

YoutubePlayer.prototype.playVideo = function() {
    return this.ready ? this._platformPlayer.playVideo() : null;
};
