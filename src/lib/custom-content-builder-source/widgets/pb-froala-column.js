if (typeof $ === 'undefined') { throw new Error('pagebuilder\'s JavaScript requires $') }
(function($){



	$.FroalaEditor.DefineIcon('duplicate', {NAME: 'info'});
    $.FroalaEditor.RegisterCommand('duplicate', {
      title: 'Duplicate',
      type: 'dropdown',
      icon: 'info',
      focus: !0,
      undo: !0,
      options: {
      	'2' : 'x 2',
      	'3' : 'x 3'
      },
      refreshAfterCallback: true,
      callback: function (a,b) {
        
		var r = this.selection.ranges(0);
        var p = r.startContainer.parentElement;
        var gp = $(p).closest('.fr-element').children();
        var wz = parseFloat((12 / (b*1) ) * 8.33 ).toFixed(2) + '%';

        var size = 12/(b*1);
        // var baseHtml = '<div style="width: ' + wz + '; float:left ">' + this.html.get(0) + '</div>';
        var baseHtml = '<div style="width: ' + wz + '; float:left " class="base-col">' + this.html.get(0) + '</div>';
        var newHtml = '';
        for(var i=0; i < b*1; i++){
        	newHtml += baseHtml;
        }

        this.html.set(newHtml);
        // console.log (this.html.get());
      },
      refresh: function ($btn) {
	    // The current context is the editor instance.
	    // console.log (this.selection.element());
	  },

	  // Called when the dropdown is shown.
	  refreshOnShow: function ($btn, $dropdown) {
	    // The current context is the editor instance.
	    // console.log (this.selection.element());
	  }	
    });

    $.FroalaEditor.DefineIcon('deleteColumn', {NAME: 'info'});
    $.FroalaEditor.RegisterCommand('deleteColumn', {
      title: 'deleteColumn',      
      icon: 'buttonIcon',
      focus: !0,
      undo: !0,      
      refreshAfterCallback: true,
      callback: function (a,b) {
        // alert('Hello!');
        // var size = 12/(b*1);
        // var baseHtml = '<div class="col-sm-' + size + '">' + this.html.get(0) + '</div>';
        // var newHtml = '';
        // for(var i=0; i < b*1; i++){
        // 	newHtml += baseHtml;
        // }
        var r = this.selection.ranges(0);
        var p = r.startContainer.parentElement;
        var gp = $(p).closest('.fr-element').children();
        // var gp = $(p).closest('.fr-element').children('*[class^="col-sm-"]');

        for(var i =0; i < gp.length; i++){
        	if($.contains(gp[i],r.startContainer.parentElement)){ 
        		$(gp[i]).remove();
        	}else{
        		$(gp[i]).css('width', ((12 / (gp.length -1) ) * 8.33 )+ 'px');
        	}
        }
        

        // this.html.set('');
        // console.log (this.html.get());
      }      
    });



    $.FroalaEditor.DefineIcon('thickline', {NAME: 'window-minimize'});
    $.FroalaEditor.RegisterCommand('insertThickHR', {
      title: 'Insert Thick Horizontal Line',      
      icon: 'thickline',
      focus: !0,
      undo: !0,      
      refreshAfterCallback: true,
      callback: function () {
        
        // this.events.focus();
        this.selection.remove();
        // var d = '';
        // this.core.isEmpty() && (d = "<br>"), this.html.insert('<hr id="fr-just">' + d);
        // var e = this.$el.find("hr#fr-just");
        // var f;
        // e.prev().is("hr") ? f = this.selection.setAfter(e.get(0), !1) : 
        // e.next().is("hr") ? f = this.selection.setBefore(e.get(0), !1) : 
        // this.selection.setAfter(e.get(0), !1) || this.selection.setBefore(e.get(0), !1), f || "undefined" == typeof f || (d = $.FroalaEditor.MARKERS + "<br>", e.after(d)), this.selection.restore()

        


        this.html.insert('<hr id="fr-just" class="pb-line-break">');
        var e = this.$el.find("hr#fr-just");

        this.selection.setAfter(e.get(0),false);
        e.removeAttr('id');
        this.selection.restore();
      },
      refresh: function ($btn) {
      // The current context is the editor instance.
      // console.log (this.selection.element());
    },

    // Called when the dropdown is shown.
    refreshOnShow: function ($btn, $dropdown) {
      // The current context is the editor instance.
      // console.log (this.selection.element());
    } 
    });


    $.FroalaEditor.DefineIcon('customIframe', {NAME: 'window-minimize'});
    $.FroalaEditor.RegisterCommand('insertCustomIframe', {
      title: 'Insert iframe',      
      icon: 'customIframe',
      focus: !0,
      undo: !0,      
      refreshAfterCallback: true,
      callback: function () {
      
        var hh = '<span id="fr-just" class="fr-video fr-fvc fr-dvb fr-draggable" draggable="true">' +
                 ' <iframe src="https://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf" frameborder="0" allowfullscreen="" style="width: 894.25px; height: 1120px;"></iframe>' +
                 '</span>'

        this.selection.remove();
        this.html.insert(hh);
        var e = this.$el.find("span#fr-just");

        this.selection.setAfter(e.get(0),false);
        e.removeAttr('id');
        this.selection.restore();
      },
      refresh: function ($btn) {
      // The current context is the editor instance.
      // console.log (this.selection.element());
    },

    // Called when the dropdown is shown.
    refreshOnShow: function ($btn, $dropdown) {
      // The current context is the editor instance.
      // console.log (this.selection.element());
    } 
    });

})(jQuery);