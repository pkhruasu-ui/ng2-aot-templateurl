/*!
 * widget to add/remove/switch tabs.
 */

! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c)
    } : a(window.jQuery)
}(function($){
	'use strict';
	// MAIN CLASS DECLRATION & DEFINITION
	// All dynamic widget should extend on this
	var PBWidget = function(container,attrSelector,settings){
		this.container = $(container);
		this.attrSelector = attrSelector || settings.sel || undefined;
		this.settings = $.fn.extend({},settings);
		this.isHooked = false;
		this.init();
	}

	// PBWidget.prototype.items = [];
	PBWidget.prototype.onDrop = function(){
        // very similar to hookexisting except it does assigns new id
        var t = this;
        var ele = this.container.find('[id^=pb_tmp_id][data-pb-widget="' + t.attrSelector + '"]');

        ele.each(function(idx,el){
            $(el).prop('id', t.__genId() + (idx > 0 ? '_' + idx : '') );
            t._compile($(el));
            t._addCtrl($(el));
            t._postCompile($(el));
        })
    };
	PBWidget.prototype.onLoad = function(event,ui){}

	PBWidget.prototype.onPageLoad = function(){
		// debugger;
		this._addCtrl();
	}
	// generate id for internal use
	PBWidget.prototype.__genId = function(){
		return this.attrSelector + "_" + (new Date()).getTime();
	}
	PBWidget.prototype._compile = function(){
        // each extension implement their own
	}
    PBWidget.prototype._postCompile = function(){
        // after content is generated and ctrl buttons are added
        // initialize them
    }

	PBWidget.prototype._addCtrl = function(ele,event,ui){
		$(ele).after(this.ctrlHtml());
	}
	PBWidget.prototype._addEvent = function(){
		// hook any event delegate . run on init
	}
	PBWidget.prototype.init = function(){
		this.hookExisting();	// search existing widgets for related content and add ctrl DOM
		this._addEvent();
		this.isHooked = true;
	}
	PBWidget.prototype.hookExisting = function(){
        var t = this;
        $(this.container).find("*[data-pb-widget='" + this.attrSelector + "']").each(function(idx,el){
            var $el = $(el);
            t._compile($el);
            t._addCtrl($el);
            t._postCompile($el);
        });
	}
	PBWidget.prototype.ctrlHtml = function(){
		return "<div data-pb-ctrl>" +
				"</div>";
	}

	PBWidget.prototype.checkDup = function(){
		// Make sure we don't have a duplicate tabs
		var dup = [];
		$('[id][data-pb-widget="' + this.attrSelector +'"]').each(function(idx){
          var ids = $('[id="' + this.id + '"]');
          if(ids.length>1 && ids[0]==this){
          	console.log('Multiple IDs #'+this.id);
        	// compile a second one
        	dup.push(ids[1]);
          }
        });

		// recompile dup
		if(dup.length > 0){
			var _dup = $(dup);
			_dup.prop('id', this.__genId());
			// register this element, very important
			this._compile(_dup);
			// this._addCtrl(_dup);
		}
        // make sure each tab has proper ctrl
	}


	/*
	*	Tab widget
	*
	*/

	var Tab = function(container){
		var sel = "tab";
		var settings = {
			sel : sel,
			ctrlDiv : '[data-' + sel +'-ctrl]',
			idxSel : 'data-pb-' + sel +'-index',
			idx : 0,
			btnSwitchSel : '[data-' + sel + '-switch]',
			btnNewSel : '[data-' + sel + '-addnew]',
			btnDelSel : '[data-' + sel + '-remove]',
			rootSel : '[data-pb-widget="'+ sel + '"]',
			themeSel : '[data-' + sel + '-theme]',
		}

		PBWidget.call(this,container,"tab",settings);
	}

	Tab.prototype = Object.create(PBWidget.prototype);
	Tab.prototype.Constructor = Tab;

	Tab.prototype._addEvent = function(){

		var settings = this.settings;
		var sel = settings.sel,
			ctrlDiv = settings.ctrlDiv,
			idxSel = settings.idxSel,
			btnSwitchSel = settings.btnSwitchSel,
			btnNewSel = settings.btnNewSel,
			btnDelSel = settings.btnDelSel,
			rootSel = settings.rootSel,
			themeSel = settings.themeSel


		this.container.off("change", themeSel);
		this.container.on("change", themeSel, function(e){

			var root = $(e.target || e.currentTarget)
					.closest(ctrlDiv)
					.siblings(rootSel);
					if($(this).val() == 'block'){
						root.find('ul').addClass('nav-tabs-block');
					}else{
						root.find('ul').removeClass('nav-tabs-block');
					}

					
		});

		// add new tab
		this.container.off("click", btnNewSel);
		this.container.on("click", btnNewSel, function(e){
			var root, idx, nIdx, id, origin, copy;

			root = $(e.target || e.currentTarget)
					.closest(ctrlDiv)
					.siblings(rootSel);
			var data = $(root).data('pb.tab.widget');

			id = root.prop('id');
			idx = data.idx;
			nIdx = root.find('ul[role="tablist"]').children().length + 1;

			origin = root.find('ul[role="tablist"] li:eq(' + idx +  ')');

			copy =  origin.clone();
			copy.children('a')
                .removeClass('active')
				.text('New Tab')
				.attr('data-target', '#' + id + "_" + nIdx);
			origin.after(copy);

			var curContent = root.find('div[role="tabcontent"]').children().eq(idx);
			var copyContent = curContent.clone()
								.removeClass('active')
								.prop('id',id + "_" + nIdx);
			curContent.after(copyContent);

			// update data
			// var data = $(root).data('pb.tab.widget');
			// data.idx = nIdx;
			// $(root).data('pb.tab.widget',data);
		});

		// remove current tab
		this.container.off('click',btnDelSel);
		this.container.on('click',btnDelSel,function(e){
			var root, idx, nIdx, id, origin, copy;

			root = $(e.target || e.currentTarget)
					.closest(ctrlDiv)
					.siblings(rootSel);

			var data = $(root).data('pb.tab.widget');

			idx = data.idx;
			nIdx = 0;	// roll back to 0 after delete

			var tabList;
			tabList = root.find('ul[role="tablist"]');
			if(tabList.find('li').length <= 1) return;	// need at least 1 tab alive
			// delete associate link
			tabList.find('li:eq(' + idx +  ')').remove();
			// delete associate content
			root.find('div[role="tabcontent"]').children().eq(idx).remove();

			tabList.find('li:eq(' + nIdx +  ') a').tab('show');
			root.attr(idxSel,nIdx);

			// update data
			var data = $(root).data('pb.tab.widget');
			data.idx = nIdx;
			$(root).data('pb.tab.widget',data);
		});

		// switch to next tab
		this.container.off('click',btnSwitchSel);
		this.container.on('click',btnSwitchSel,function(e){
			var root = $(e.target || e.currentTarget)
						.closest(ctrlDiv)
						.siblings(rootSel);

			var data = $(root).data('pb.tab.widget');

			var idx = data.idx;
			var nIdx = ( ++idx < root.find('ul[role="tablist"]')
						.children()
						.length)? idx : 0;

			root.find('ul[role="tablist"] li:eq(' + nIdx +  ') a').tab('show');
			// root.attr(idxSel,nIdx);

			// update data
			data.idx = nIdx;
			$(root).data('pb.tab.widget',data);
		});
	}

	Tab.prototype._compile = function(ele,event,ui){
		var tabEle = ele;
		// if there is no DOM data, initialize it
		// if($(ele).data('pb.tab.widget') == undefined){ $(ele).data('pb.tab.widget',this.settings)}
		// else {
			var data = $.extend({},this.settings);
			$(ele).data('pb.tab.widget',data);
		// }

		// Assign id to neccessary components
	    var tabContent = ele.find('div[role="tabcontent"]');
	    if(tabEle.length > 0){
	    	// console.log('tab is dropped');
	    	// console.log(tabEle);
	    	var tabList = $(tabEle).find('ul[role="tablist"]');
	    	var thisId = ele.prop('id');

	    	var tabListChildren = tabList.children('li');
	    	tabListChildren.each(function(idx){
				tabListChildren.eq(idx)
					.children('a[data-toggle="tab"]')
					// .prop('id',thisId + "_" + idx)
					.attr('data-target', "#" + thisId + "_" + idx);
	    	})

	    	var tabContentChildren = tabContent.children();
	    	tabContentChildren.each(function(idx){
	    		tabContentChildren.eq(idx).prop('id',thisId + '_' + idx);
	    	})
	    	// default to first tab
	    	tabListChildren.eq(data.idx).find('a').tab('show');
	    }

	    // add contenteditable to associate element
	    // ele.find('[role="tabcontent"]').prop('contenteditable',false);

	    ele.find('ul[role="tablist"]').prop('contenteditable',false)
	    .find("li[role='presentation']").prop('contenteditable',false);
	}

	Tab.prototype.ctrlHtml = function(){
		return "<div class='mt-xl' data-" + this.attrSelector + "-ctrl>" +
					"<button type='button' class='btn editBtns' data-" + this.attrSelector + "-addnew contenteditable='false'>Add New Tab</button>" +
		            "<button type='button' class='btn btn-primary editBtns' data-" + this.attrSelector + "-remove contenteditable='false'>Remove Current Tab</button>" +
		            "<button type='button' class='btn btn-primary editBtns' data-" + this.attrSelector + "-switch contenteditable='false'>Switch Tab</button>" +
					"<select class='tab-theme custom-select mh-xs' data-" + this.attrSelector + "-theme ><option value='default'>Default</option><option value='block'>Block</option></select>"+
				"</div>";
	}

	// Hook with Jquery
	// main class
	$.PBWidget = PBWidget;

	$.fn.PBTab = function(){
		return this.each(function(){
			if($(this).data('pb.tab') == undefined){
				var pbTab = new Tab(this);
				$(this).data('pb.tab',pbTab);
			}
		})
		// return new Tab(container);
	}

});
