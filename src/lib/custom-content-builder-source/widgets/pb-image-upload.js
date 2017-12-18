/**
 * Created by kkanapuram on 11/2/2016.
 */
if (typeof jQuery === 'undefined') { throw new Error('pagebuilder\'s JavaScript requires jQuery') }
(function ($) {
    'use strict';
    $.fn.PBImageUpload = function () {

        $('#divToolImg').on("click", function(el){
           // uploadImage(myDiv)
           // $(this).find("#uploadFile")
        });
    };
})(jQuery);
