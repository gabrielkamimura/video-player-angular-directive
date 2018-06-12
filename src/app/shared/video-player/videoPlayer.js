var app = angular.module("videoPlayer", [])

/**
 * Uma diretiva base para fazer outras
 */
.directive(
    'videoPlayer', ['VideoPlayerService', function(VideoPlayerService) {

            return {
                restrict: 'EA',

                controller: 'VideoPlayerCtrl',

                scope: {
                    src: '@',
                    player: '=?'
                },

                link: function($scope, element, attrs, controllers) {
                    var div = element[0].querySelector('div');
                    
                    $scope.$watch('src', function(link) {
                        $scope.player = VideoPlayerService.getPlayer(link, div);
                        console.log($scope.player)
                    });
                },
                templateUrl: 'app/shared/video-player/partials/videoPlayer.tpl.html'
            };
        }
    ]
)
.controller('VideoPlayerCtrl', ['$scope', 'VideoPlayerService', function($scope, VideoPlayerService) {
    
}])

.service('VideoPlayerService', ['$q', function($q) {
    function whatPlatform(url) {
        if (url.indexOf('vimeo') != -1) {
            return 'vimeo';
        }
        if (url.indexOf('youtube') != -1) {
            return 'youtube';
        }
        return 'other';
    }
    
    // ----- Youtube Player ----- //
    var YoutubePlayer = function(link, element) {
        element.innerHTML = "";
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
            this._createIframe();
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
        var d = $q.defer();
        this.ready ? d.resolve(this._platformPlayer.getCurrentTime()) : d.reject(null);
        return d.promise;
    };

    YoutubePlayer.prototype.getDuration = function() {
        var d = $q.defer();
        this.ready ? d.resolve(this._platformPlayer.getDuration()) : d.reject(null);
        return d.promise;
    };
    
    YoutubePlayer.prototype.pauseVideo = function() {
        return this.ready ? this._platformPlayer.pauseVideo() : null;
    };

    YoutubePlayer.prototype.playVideo = function() {
        return this.ready ? this._platformPlayer.playVideo() : null;
    };



    /////// Vimeo player


    var VimeoPlayer = function(link, element) {
        this._link = link;
        this._element = element;
        this.ready = false;

        if (!window.Vimeo) {
            // Se o YT não está carregado, carregue
            var tag = document.createElement('script');
            tag.src = "https://player.vimeo.com/api/player.js";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            // Ao concluir o download, crie o iframe do vídeo
            var $this = this;
            tag.onload = function() {
                $this._createIframe();
            }

        } else {
            // Se está carregado, apenas crie o próprio iframe
            this._createIframe();
        }
    }

    VimeoPlayer.prototype._createIframe = function() {
        var player = document.createElement('div');
        player.dataset.vimeoUrl = this._link

        this._element.appendChild(player);
        console.log(player)
        this._platformPlayer = new Vimeo.Player(player);
        this.ready = true;
    };

    VimeoPlayer.prototype.seekTo = function(second) {
        return this.ready ? this._platformPlayer.setCurrentTime(second) : null;
    };

    VimeoPlayer.prototype.getCurrentTime = function(second) {
        return this.ready ? this._platformPlayer.getCurrentTime() : null;
    };
    
    VimeoPlayer.prototype.getDuration = function() {
        return this.ready ? this._platformPlayer.getDuration() : null;
    };

    VimeoPlayer.prototype.pauseVideo = function() {
        return this.ready ? this._platformPlayer.pause() : null;
    };

    VimeoPlayer.prototype.playVideo = function() {
        return this.ready ? this._platformPlayer.play() : null;
    };
    
    return {
        getPlayer: function(link, element) {
            if (link) {
                switch(whatPlatform(link)) {
                    case 'youtube':
                        return new YoutubePlayer(link, element);
                        break;
                    case 'vimeo':
                        return new VimeoPlayer(link, element);
                        break;
                }
            }
        }
    }
    
    
}]);