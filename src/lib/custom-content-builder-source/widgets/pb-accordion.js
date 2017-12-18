/**
 * Created by pkhruasuwan on 12/16/16.
 */
/*!
 * widget to add/remove/switch tabs.
 */

if (typeof jQuery === 'undefined') { throw new Error('pagebuilder\'s JavaScript requires jQuery') }
(function($){
    /*
     *	Accordion widget
     *
     */

    var Accordion = function(container){
        var sel = "accordion";
        var settings = {
            sel : sel,
            ctrlDiv : '[data-' + sel +'-ctrl]',
            idxSel : 'data-pb-' + sel +'-index',
            btnToggle : '[data-' + sel + '-toggle]',
            rootSel : '[data-pb-widget="'+ sel + '"]'
        }

        $.PBWidget.call(this,container,"accordion",settings);
    }

    Accordion.prototype = Object.create($.PBWidget.prototype);
    Accordion.prototype.Constructor = Accordion;

    Accordion.prototype._addEvent = function(){

        var settings = this.settings;
        var sel = settings.sel,
            ctrlDiv = settings.ctrlDiv,
            btnToggleSel = settings.btnToggle,
            rootSel = settings.rootSel;

        this.container.off("click",btnToggleSel);
        this.container.on("click",btnToggleSel,function(e){
            var root;

            root = $(e.target || e.currentTarget)
                    .closest(ctrlDiv)
                    .siblings(rootSel);

            root.find('div[rol="tab"]').collapse('toggle');
            root.find('div[role="tabpanel"]').collapse('toggle');
        })
    }

    Accordion.prototype._compile = function(ele,event,ui){
        // var tabEle = ele;
        // if there is no DOM data, initialize it
        var data = $.extend({},this.settings);
        $(ele).data('pb.accordion.widget',data);

        // Assign id to neccessary components
        var thisId = ele.prop('id');

        var accordionBar = ele.find('div[role="tab"]')
            .prop('id',thisId + '_heading')
            .find('a')
            .attr('href', "#" + thisId + "_content")
            .attr('aria-controls',thisId + "_content");

        var accordionContent = ele.find('div[role="tabpanel"]')
                                    .prop('id',thisId + "_content")
                                    .attr('aria-labelledby',thisId + '_heading');

        // collapse at first
        ele.collapse();
    }

    Accordion.prototype.ctrlHtml = function(){
        return "<div data-" + this.attrSelector + "-ctrl>" +
            "<button type='button' class='btn btn-primary' data-" + this.attrSelector + "-toggle contenteditable='false'>Toggle</button>" +
            "</div>";
    }

    // Hook with Jquery

    $.fn.PBAccordion = function(){
        return this.each(function(){
            if($(this).data('pb.accordion') == undefined){
                var pbTab = new Accordion(this);
                $(this).data('pb.accordion',pbTab);
            }
        })
    }

})(jQuery);
