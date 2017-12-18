/*!
 * widget to add/remove rows and columns in a table.
 */

! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c)
    } : a(window.jQuery)
} (function ($) {
    'use strict';

    /*
     *	Accordion widget
     *
     */
    var Table = function(container){
        var sel = "table";
        var settings = {
            sel : sel,
            ctrlDiv : '[data-' + sel +'-ctrl]',
            rootSel : '[data-pb-widget="'+ sel + '"]',
            addRowSel : '[data-' + sel + '-addrow]',
            removeRowSel : '[data-' + sel + '-removerow]',
            addColSel : '[data-' + sel + '-addcol]',
            removeColSel : '[data-' + sel + '-removecol]',
            changeBorderSel : '[data-' + sel + '-changeborder]'
        }

        $.PBWidget.call(this,container, "table", settings);
    }

    Table.prototype = Object.create($.PBWidget.prototype);
    Table.prototype.Constructor = Table;

    Table.prototype._addEvent = function(){
        var settings = this.settings;
        var sel = settings.sel,
            ctrlDiv = settings.ctrlDiv,
            addRowSel = settings.addRowSel,
            removeRowSel = settings.removeRowSel,
            addColSel = settings.addColSel,
            removeColSel = settings.removeColSel,
            changeBorderSel = settings.changeBorderSel,
            rootSel = settings.rootSel;

        // Add row
        this.container.off("click",addRowSel);
        this.container.on("click",addRowSel,function(e){
            var root;

            root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);

            // var tableContent = $(this).parent().siblings("table");
            var columnCount = root.find(".tHead td").length;
            var row = "<tr>";
            for(var i = 0; i < columnCount; i++){
                row += "<td></td>"
            }
            row += "</tr>";
            root.append(row);
            if(root.find("tr").length > 0){
                $(this).siblings(removeRowSel).show();
            }
            var tdWidth = root.find("tr:eq(0)").find("td").length;
            var perc = 100/tdWidth + "%";
            root.find("td").css("width", perc);
        })

        // Remove row
        this.container.off("click",removeRowSel);
        this.container.on("click",removeRowSel,function(e){
            var root;

            root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);

            var rowCount = root.find("tr").length-1;
            root.find("tr:eq("+rowCount+")").remove();
            if(root.find("tr").length <= 1){
                $(this).hide();
            }
        })

        // Add column
        this.container.off("click",addColSel);
        this.container.on("click",addColSel,function(e){
            var root;

            root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);

            var rowCount = root.find("tr").length;
            for(var i = 0; i < rowCount; i++){
                root.find("tr:eq("+ i +")").append("<td></td>");
            }
            if(root.find("tr:eq(0)").find("td").length > 1){
                $(this).siblings(removeColSel).show();
            }
            var tdWidth = root.find("tr:eq(0)").find("td").length;
            var perc = 100/tdWidth + "%";
            root.find("td").css("width", perc);
        })

        // Remove Column
        this.container.off("click",removeColSel);
        this.container.on("click",removeColSel,function(e){
            var root;

            root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);


            var rowCount = root.find("tr").length;
            for(var i = 0; i < rowCount; i++){
                root.find("tr:eq("+ i +")").find("td:last").remove();
            }
            if(root.find("tr:eq(0)").find("td").length == 1){
                $(this).hide();
            }
            var tdWidth = root.find("tr:eq(0)").find("td").length;
            var perc = 100/tdWidth + "%";
            root.find("td").css("width", perc);
        })

        // Change border style
        /* selecting border styles from select-box*/
        this.container.off('change',changeBorderSel);
        this.container.on("change", changeBorderSel, function(e){
            var root;

            root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);

            var borderType = $(e.target || e.currentTarget).val();
            root.removeClass();
            root.addClass(borderType);
        });
    }

    Table.prototype._postCompile = function(el){
        // map class from the table to select option
        var tableClassName = $(el).attr("class");
        $(el).siblings(this.ctrlDiv).find(this.settings.changeBorderSel).val(tableClassName);
        $(el).siblings(this.ctrlDiv).find(this.settings.changeBorderSel + ' option[value="' + tableClassName + '"]').attr('selected','selected');
    }

    Table.prototype._compile = function(ele,event,ui){
        var data = $.extend({},this.settings);
        $(ele).data('pb.table.widget',data);
    }

    Table.prototype.ctrlHtml = function(){
        return '<div data-' + this.attrSelector + '-ctrl>' +
            '<button class="btn btn-secondary" data-' + this.attrSelector + '-addrow    contenteditable="false">Add Row</button>' +
            '<button class="btn btn-secondary" data-' + this.attrSelector + '-removerow contenteditable="false">Remove Row</button>' +
            '<button class="btn btn-secondary" data-' + this.attrSelector + '-addcol    contenteditable="false">Add Column</button>' +
            '<button class="btn btn-secondary" data-' + this.attrSelector + '-removeCol contenteditable="false">Remove Column</button>' +
            '<form class="d-inline-block">' +
            '<select name="type" class="form-control btn-mt pb-table-select-box editBtns" data-' + this.attrSelector + '-changeborder contenteditable="false">' +
                '<option value="pb-widget-table-border">Border</option>' +
                '<option value="pb-widget-table-no-border">No Border</option>' +
                '<option value="pb-widget-table-horizontal-border">Inside Horizontal Border</option>' +
                '<option value="pb-widget-table-vertical-border">Inside Vertical Border</option>' +
                '<option value="pb-widget-table-horizontal-vertical-border">Inside Vertical & Horizontal Border</option>' +
                '<option value="pb-widget-table-outside-border">Outside Border</option>' +
            '</select>' +
            '</form>' +
            '</div>';
    }

    // Hook with Jquery

    $.fn.PBTable = function(){
        return this.each(function(){
            if($(this).data('pb.table') == undefined){
                var pbTable = new Table(this);
                $(this).data('pb.table',pbTable);
            }
        })
    }

    // OLD CODE keep this for a while for reference
    // $.fn.PBTable = function () {
    //     /* appending table buttons for add and removing columns */
    //
    //     $("#contentarea").find(".editButtonsBlock").each(function(idx,el){
    //         $(".editButtonsBlock").html(htmlContent);
    //
    //
    //     });
    //     $(".changeBorder").each(function(){
    //         var tableClassName = $(this).parents().siblings("table").attr("class");
    //         $(this).val(tableClassName);
    //     });
    //     /* selecting border styles from select-box*/
    //     $("#contentarea").on("change", ".changeBorder", function(el){
    //         var tableContent = $(this).parent().siblings("table");
    //         var type = $(this).val();
    //         $(this).find(":selected").attr("selected", "selected");
    //         switch (type) {
    //             case 'pb-widget-table-border':
    //                 resetStyles(this);
    //                 tableContent.addClass("pb-widget-table-border");
    //                 break;
    //             case 'pb-widget-table-no-border':
    //                 resetStyles(this);
    //                 tableContent.removeClass("pb-widget-table-border");
    //                 break;
    //             case 'pb-widget-table-outside-border':
    //                 resetStyles(this);
    //                 tableContent.addClass("pb-widget-table-outside-border");
    //                 break;
    //             case 'pb-widget-table-horizontal-border':
    //                 resetStyles(this);
    //                 tableContent.addClass("pb-widget-table-horizontal-border");
    //                 break;
    //             case 'pb-widget-table-vertical-border':
    //                 resetStyles(this);
    //                 tableContent.addClass("pb-widget-table-vertical-border");
    //                 break;
    //             case 'pb-widget-table-horizontal-vertical-border':
    //                 resetStyles(this);
    //                 tableContent.addClass("pb-widget-table-horizontal-vertical-border");
    //                 break;
    //         }
    //     });
    //     var resetStyles = function(_this){
    //         $(_this).parent().siblings("table").removeClass("pb-widget-table-border pb-widget-table-outside-border pb-widget-table-horizontal-border pb-widget-table-vertical-border pb-widget-table-horizontal-vertical-border");
    //     };
    //     /* add Row */
    //     $('#contentarea').on("click", ".addButton", function(el){
    //         var tableContent = $(this).parent().siblings("table");
    //         var columnCount = tableContent.find(".tHead td").length;
    //         var row = "<tr>";
    //         for(var i = 0; i < columnCount; i++){
    //             row += "<td></td>"
    //         }
    //         row += "</tr>";
    //         tableContent.append(row);
    //         if(tableContent.find("tr").length > 0){
    //             $(this).siblings(".removeButton").show();
    //         }
    //         var tdWidth = tableContent.find("tr:eq(0)").find("td").length;
    //         var perc = 100/tdWidth + "%";
    //         tableContent.find("td").css("width", perc);
    //     });
    //     /* Remove Row */
    //     $('#contentarea').on("click", ".removeButton", function(el){
    //         var tableContent = $(this).parent().siblings("table");
    //         var rowCount = tableContent.find("tr").length-1;
    //         tableContent.find("tr:eq("+rowCount+")").remove();
    //         if(tableContent.find("tr").length <= 1){
    //             $(this).hide();
    //         }
    //     });
    //
    //     /* add Column */
    //     $('#contentarea').on("click", ".addColumn", function(el){
    //         var tableContent = $(this).parent().siblings("table");
    //         var rowCount = tableContent.find("tr").length;
    //         for(var i = 0; i < rowCount; i++){
    //             tableContent.find("tr:eq("+ i +")").append("<td></td>");
    //         }
    //         if(tableContent.find("tr:eq(0)").find("td").length > 1){
    //             $(this).siblings(".removeColumn").show();
    //         }
    //         var tdWidth = tableContent.find("tr:eq(0)").find("td").length;
    //         var perc = 100/tdWidth + "%";
    //         tableContent.find("td").css("width", perc);
    //
    //     });
    //     /* remove Column */
    //
    //     $('#contentarea').on("click", ".removeColumn", function(el){
    //         var tableContent = $(this).parent().siblings("table");
    //         var rowCount = tableContent.find("tr").length;
    //         for(var i = 0; i < rowCount; i++){
    //             tableContent.find("tr:eq("+ i +")").find("td:last").remove();
    //         }
    //         if(tableContent.find("tr:eq(0)").find("td").length == 1){
    //             $(this).hide();
    //         }
    //         var tdWidth = tableContent.find("tr:eq(0)").find("td").length;
    //         var perc = 100/tdWidth + "%";
    //         tableContent.find("td").css("width", perc);
    //     });
    //
    // };
});
