// app.ui.directives Module
// ====================================================================
// This file should included in your project.
//
// - Squaredesigns.net -


"use strict";
angular.module("app.ui.directives", [])

/**************************************
  :: UI Not Close On Click Directive
***************************************/

.directive("uiNotCloseOnClick", [
   function() {
     return {
       restrict: "A",
       compile: function(ele) {
          return ele.on("click", function(event) {
            return event.stopPropagation()
           })
         }
      }
   }
])

/**************************************
  :: Slim Scroll Directive
***************************************/
	
.directive("slimScroll", [
  function() {
    return {
      restrict: "A",
      link: function(scope, ele, attrs) {
        return ele.slimScroll({
          height: attrs.scrollHeight || "100%"
        });
      }
    };
  }
])
.directive('ngFileSelect', [ '$parse', '$timeout', function($parse, $timeout) {
  return function(scope, elem, attr) {
          var fn = $parse(attr['ngFileSelect']);
          elem.bind('change', function(evt) {
              var files = [], fileList, i;
              fileList = evt.target.files;
              if (fileList != null) {
                  for (i = 0; i < fileList.length; i++) {
                      files.push(fileList.item(i));
                  }
              }
              $timeout(function() {
                  fn(scope, {
                      $files : files,
                      $event : evt
                  });
              });
          });
      };
  }]);