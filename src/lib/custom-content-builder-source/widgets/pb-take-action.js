/**
 * Created by spalaparty on 05/03/2017
 */

if (typeof jQuery === 'undefined') {
    throw new Error('pagebuilder\'s JavaScript requires jQuery')
}
(function ($) {
    /*
     *  TakeAction widget
     *
     */
    var TakeAction = function (container) {
        var sel = "take-action";
        var settings = {
            sel: sel,
            btnAddSel: '[data-' + sel + '-add]',
            btnRemoveSel: '[data-' + sel + '-remove]',
            rootSel: '[data-pb-widget="' + sel + '"]',
        }
        var onAddAction = false;
        $.PBWidget.call(this, container, "take-action", settings);
    }

    TakeAction.prototype = Object.create($.PBWidget.prototype);
    TakeAction.prototype.Constructor = TakeAction;

    TakeAction.prototype._addEvent = function () {

        var settings = this.settings;
        var sel = settings.sel,
            ctrlDiv = settings.ctrlDiv,
            btnAddSel = settings.btnAddSel,
            btnRemoveSel = settings.btnRemoveSel,
            rootSel = settings.rootSel;

        this.container.off("click", btnAddSel);
        this.container.on("click", btnAddSel, function (e) {

            var root = $(e.target || e.currentTarget);
        
            var dropdown = root.siblings("ul");
            var template = '<li class="pbedit"><a href="#" target="_blank">Example Link</a><i class="fa fa-trash-o btn-link ta-delete removeBtn" title="Delete Link" data-take-action-remove contenteditable="false"></i></li>';
            dropdown.append(template);
            TakeAction.prototype._compile();
            TakeAction.prototype._postCompile();
        })

        this.container.off("click", btnRemoveSel);
        this.container.on("click", btnRemoveSel, function (e) {
            var root = $(e.target || e.currentTarget);
            root.closest("li").remove();   

            TakeAction.prototype._postCompile();
        });

    }
    TakeAction.prototype._postCompile = function (ele, event, ui) {
            $(ele).find(".take-action-dropdown").parent().append("<i class='fa fa-plus-circle addBtn btn-link ta-add' title='Add new Link' data-take-action-add contenteditable='false'></i>");
            if(!$(ele).find(".take-action-dropdown-block").children().hasClass("removeBtn")){
                $(ele).find(".take-action-dropdown-block").children().append("<i class='removeBtn fa fa-trash-o btn-link ta-delete' title='Delete Link' data-take-action-remove contenteditable='false'></i>");
        }

    }
    TakeAction.prototype._compile = function (ele, event, ui) {
       var data = $.extend({}, this.settings);
       $(ele).data('pb.take-action.widget', data);
        $('.keep-open').on({
            "shown.bs.dropdown": function() { $(this).attr('closable', false); },
            "click":             function() { },
            "hide.bs.dropdown":  function() { return $(this).attr('closable') == 'true'; }
        });

        $('.keep-open #dLabel').on({
        "click": function() {
            $(this).parent().attr('closable', true );
        }
        })

    }

    TakeAction.prototype.ctrlHtml = function () {

        return null;
    }
    // Hook with Jquery
    $.fn.PBTakeAction = function () {
        return this.each(function () {
            if ($(this).data('pb.take-action') == undefined) {
                var pb = new TakeAction(this);
                $(this).data('pb.take-action', pb);
            }
        })
    }

})(jQuery);


