/**
 * Created by pkhruasuwan on 12/16/16.
 */
/*!
 * widget to add/remove/switch tabs.
 */

if (typeof jQuery === 'undefined') { throw new Error('pagebuilder\'s JavaScript requires jQuery').slideToggle("fast") }
(function($){
    /*
     *	AnchorPoint widget
     *
     */

    var AnchorPoint = function(container){
        var sel = "anchorpoint";
        var settings = {
            sel : sel,
            idxSel : 'data-pb-' + sel +'-index',
            rootSel : '[data-pb-widget="'+ sel + '"]'
        }

        $.PBWidget.call(this,container,"anchorpoint",settings);
    }

    AnchorPoint.prototype = Object.create($.PBWidget.prototype);
    AnchorPoint.prototype.Constructor = AnchorPoint;

    AnchorPoint.prototype._addEvent = function(){}

    AnchorPoint.prototype._compile = function(ele,event,ui){
        // if there is no DOM data, initialize it
        var data = $.extend({},this.settings);
        $(ele).data('pb.anchorPoint.widget',data);

        // Assign id to neccessary components
        var thisId = ele.prop('id');

        ele.find('[data-anchor-id]').text("#" + thisId);

        ele.find('[data-anchor-tooltip]').tooltip();

        // var accordionBar = ele.find('div[role="tab"]')
        //     .prop('id',thisId + '_heading')
        //     .find('a')
        //     .attr('href', "#" + thisId + "_content")
        //     .attr('aria-controls',thisId + "_content");
        //
        // var accordionContent = ele.find('div[role="tabpanel"]')
        //     .prop('id',thisId + "_content")
        //     .attr('aria-labelledby',thisId + '_heading');

        // collapse at first
        // ele.collapse();
    }

    AnchorPoint.prototype.ctrlHtml = function(){
        return "";
    }

    // Hook with Jquery

    $.fn.PBAnchorPoint = function(){
        return this.each(function(){
            if($(this).data('pb.anchorPoint') == undefined){
                var pbTab = new AnchorPoint(this);
                $(this).data('pb.anchorPoint',pbTab);
            }
        })
    }

})(jQuery);
