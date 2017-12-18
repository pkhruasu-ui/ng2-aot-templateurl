/**
 * Created by kkanapuram on 10/26/2016.
 */

if (typeof jQuery === 'undefined') { throw new Error('pagebuilder\'s JavaScript requires jQuery') }
(function ($) {
    'use strict';
    $.fn.PBInit = function (admin, pageEditor) {
        let snippetsFilePath = admin ? './lib/custom-content-builder-source/assets/snippets-admin.html' : './lib/custom-content-builder-source/assets/snippets.html';

        $("#contentarea").contentbuilder({
            zoom: 0.85,
            snippetFile: snippetsFilePath,
            snippetOpen: true,
            toolbar: 'left',
            iconselect: './lib/ContentBuilderSource/assets/ionicons/selecticon.html',
            axis: 'y',
            isAdmin: true,
            snippetCategories: [
                [0, "All"],
                [1, "Text"],
                [2, "Images"],
                [3, "Call to Action"],
                [4, "List, Tabs & Tables"],
                [5, "Map"],
                [6, "Video"],
                [7, "Seperator"],
                [8, "Dynamic Widgets"]
            ],
            colors: ["#F0EEEC", "#999999", "#767676", "#555555", "#F18E0C", "#DD1E31", "#0654BA", "#5BA71B"],
            onDrop: function (event, ui) {

                $('#contentarea').data('pb.tab').onDrop(event, ui);
                $('#contentarea').data('pb.table').onDrop(event, ui);
                $('#contentarea').data('pb.accordion').onDrop(event, ui);
                $('#contentarea').data('pb.timeline-accordion').onDrop(event, ui);

                // $('.editButtonsBlock').each(function (idx, el) {
                //     $(".editButtonsBlock").html(htmlContent);
                //
                // });
                // $(".changeBorder").each(function () {
                //     var tableClassName = $(this).parents().siblings("table").attr("class");
                //
                //     $(this).val(tableClassName);
                // });
            },
            onRender: function () {

                var contentbuilderData = $('#contentarea').data('pb.tab');

                if (contentbuilderData) {
                    contentbuilderData.checkDup();
                }

                /*
                 //TODO : recheck if every widget still have tmp id
                 */
            }
        });

        // any extension needs to be initialized first
        $("#contentarea").PBTab();
        $("#contentarea").PBTable();
        $("#contentarea").PBAccordion();
        $("#contentarea").PBTimelineAccordion();

        if(pageEditor){
            $("#divTool").hide();
            $('.row-tool').empty();
        }  
    };
})(jQuery);
    