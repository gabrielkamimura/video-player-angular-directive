angular.module('suaapp')

/**
 * Esta diretiva gerencia o título da página. Dessa forma, as páginas individuais têm a possibilidade de alterar o title 
 */
.directive('pageTitle', function() {
    return {
        restrict: 'EA',
        link: function($scope, $element) {
            var el = $element[0];
            el.hidden = true; // So the text not actually visible on the page

            var text = function() {
                return el.innerHTML;
            };
            var setTitle = function(title) {
                document.title = title;
            };
            $scope.$watch(text, setTitle);
        }
    };
});
