/**
 * Created by pkhruasuwan on 04/6/2017
 */


if (typeof jQuery === 'undefined') {
    throw new Error('pagebuilder\'s JavaScript requires jQuery')
}
(function ($) {
    /*
     *  TimelineAccordion widget
     *
     */

    var TimelineAccordion = function (container) {
        var sel = "timeline-accordion";
        var settings = {
            sel: sel,
            ctrlDiv: '[data-' + sel + '-ctrl]',
            idxSel: 'data-pb-' + sel + '-index',
            btnAddSel: '[data-' + sel + '-add]',
            btnRemoveSel: '[data-' + sel + '-remove]',
            btnThemeSel: '[data-' + sel + '-theme]',
            rootSel: '[data-pb-widget="' + sel + '"]',
           // btnToggle : '[data-' + sel + '-toggle]',
        }

        $.PBWidget.call(this, container, "timeline-accordion", settings);
    }

    TimelineAccordion.prototype = Object.create($.PBWidget.prototype);
    TimelineAccordion.prototype.Constructor = TimelineAccordion;

    TimelineAccordion.prototype._addEvent = function () {

        var settings = this.settings;
        var sel = settings.sel,
            ctrlDiv = settings.ctrlDiv,
            btnAddSel = settings.btnAddSel,
            btnRemoveSel = settings.btnRemoveSel,
            btnThemeSel = settings.btnThemeSel,
            rootSel = settings.rootSel;
            var actionItemMaxVal = 1;

		this.container.off("click", btnThemeSel);
		this.container.on("click", btnThemeSel, function(e){
			var root = $(e.target || e.currentTarget)
					.closest(ctrlDiv)
					.siblings(rootSel);
                    var wrapper = root.closest(".sb-timeline-wrapper");

					if($(this).val() == 'default'){

						wrapper.removeClass('gray-theme');
                        wrapper.addClass('default-theme');

					}else{

						wrapper.removeClass('default-theme');
                        wrapper.addClass('gray-theme');
					}

		});

        this.container.off("click", btnAddSel);
        this.container.on("click", btnAddSel, function (e) {


            var root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);


                var template = '<section class="sb-timeline"> <div class="row"> <div class="col-sm-3 pb-timeline-accordion"> <div class="sb-timeline-chapter-heading">' + '<h4 class="sb-no-editbar" contenteditable="true">Timeline Chapter</h4> </div> </div>  <div class="col-sm-9 pb-timeline-accordion"> ' +
                '<div class="sb-timeline-card sb-timeline-card-up">' +
                '<div class="sb-timeline-card-heading" data-tab-content-id="">' +
                '<h4 class="sb-no-editbar" contenteditable="true">' +
                'TimeLine Card Heading </h4> </div>' +
                '<div class="sb-timeline-card-content tab-content pbedit">' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis expedita perferendis rem nihil itaque. Quis consectetur unde numquam ratione, illum dolorem officia nobis iure culpa fugiat fuga odio, possimus quod.</p>'+
                '<div class="more-link edit"> <a href="#" class="btn-link link-internal">Read More</a></div>' +
                '</div> </div> </div> </div> </section>';
                root.append(template);


                TimelineAccordion.prototype._compile();
                TimelineAccordion.prototype._postCompile();
        })

        this.container.off("click", btnRemoveSel);
        this.container.on("click", btnRemoveSel, function (e) {



            var root = $(e.target || e.currentTarget)
                .closest(ctrlDiv)
                .siblings(rootSel);

            var actionItem = $(e.target || e.currentTarget).siblings("select");
            var actionItemSelectVal = $(e.target || e.currentTarget).siblings("select").val();

            root.find(".sb-timeline").eq(actionItemSelectVal-1).remove();

            TimelineAccordion.prototype._postCompile();
        });

    }
TimelineAccordion.prototype._postCompile= function (ele, event, ui) {

     $(".sb-timeline-container").each(function(index, value){
                var actionItem = $(this).siblings("div").find("select");
                actionItem.find("option").remove();
                var removeBtn = $(this).siblings("div").find("button").first();
                if($(this).find(".sb-timeline").length == 0){
                    removeBtn.hide();
                }else{
                    removeBtn.show();
                }
                for(var i = 1; i<= $(this).find(".sb-timeline").length; i++){
                    actionItem.append($('<option>',{
                        value: i,
                        text : i
                    }));
                }

            actionItem.find("option[value='"+$(this).find(".sb-timeline").length+"']").attr("selected", "selected");


        });
}
    TimelineAccordion.prototype._compile = function (ele, event, ui) {

        var data = $.extend({}, this.settings);
        $(ele).data('pb.v2.timeline-accordion.widget', data);

   $('div.sb-timeline-card-heading').off('click');
        $('div.sb-timeline-card-heading').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).toggleClass('active-accordian');
            $(this).siblings('.sb-timeline-card-content').fadeToggle();
            if($(this).parent().hasClass("sb-timeline-card-down")){
                $(this).parent().removeClass("sb-timeline-card-down").addClass("sb-timeline-card-up");
            }else{
                $(this).parent().removeClass("sb-timeline-card-up").addClass("sb-timeline-card-down");
            }
        });

        // $('.pb-timeline-accordion').prop('contenteditable',false);
    }


    TimelineAccordion.prototype.ctrlHtml = function () {

        return  "<div data-" + this.attrSelector + "-ctrl>" +
                "Select index <select class='custom-select sb-timeline-select mr5 ml5' id='sb-timeline-action-count'><option value='1'>1</option></select> to "+
                "<button type='button' class='btn btn-secondary ml5' data-" + this.attrSelector + "-remove contenteditable='false'>Remove Timeline</button>" +
                "<button type='button' class='btn btn-secondary mr-xs' data-" + this.attrSelector + "-add contenteditable='false'>Add Timeline</button>" +
                "<input type='radio' class='custom-control custom-radio mr5' data-" + this.attrSelector + "-theme contenteditable='false' name='theme' value='default' checked/> Default Theme " +
                "<input type='radio' class='custom-control custom-radio mr5' data-" + this.attrSelector + "-theme contenteditable='false' name='theme' value='gray' /> Grey Theme" +
                "</div>";

    }

    // Hook with Jquery

    $.fn.PBTimelineAccordionV2 = function () {
        return this.each(function () {
            if ($(this).data('pb.v2.timeline-accordion') == undefined) {
                var pb = new TimelineAccordion(this);
                $(this).data('pb.v2.timeline-accordion', pb);
            }
        })
    }

})(jQuery);
