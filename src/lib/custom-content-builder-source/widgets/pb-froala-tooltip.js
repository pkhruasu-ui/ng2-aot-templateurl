! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c)
    } : a(window.jQuery)
}(function($) {
    $.extend($.FE.POPUP_TEMPLATES, {
        "customTooltip.popup": "[_BUTTONS_][_CUSTOM_LAYER_]",
    });

    $.FE.PLUGINS.customTooltip = function(editor) {


        function initPopup(){
            var template = {
                buttons: '<div class="fr-buttons"></div>',
                custom_layer: '<div class="fr-layer fr-active">' +
                  '<div class="fr-input-line"><input id="fr-tooltip-text" type="text" placeholder="'+ editor.language.translate('Tooltip Text') + '" tabindex="1"></div>' +
                  '<div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="tooltipSetTooltip" tabindex="2" role="button">' + editor.language.translate("Update")+ '</button></div>'  +
                '</div>'
            };


            // var d = '<div class="fr-image-size-layer fr-layer fr-active" id="fr-image-caption-layer-' + b.id + '">' +
            //     '<div class="fr-input-line"><input id="fr-image-caption-layer-figure-text-' + b.id + '" type="text" placeholder="' + b.language.translate("Figure Text") + '" tabIndex="1"></div>' +
            //     '<div class="fr-image-input-group">Align : <input type="radio" name="caption-align" value="left">&nbsp;Left&nbsp;<input type="radio" name="caption-align" value="center">&nbsp;Center&nbsp;<input type="radio" name="caption-align" value="right">&nbsp;Right&nbsp;</div>' +
            //     '<div class="fr-checkbox-line"><span class="fr-checkbox"><input name="caption-bold" class="fr-link-attr fr-not-empty" data-checked="true" type="checkbox" id="fr-image-caption-layer-bold" tabindex="3" dir="auto"><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10" height="10" viewBox="0 0 32 32"><path d="M27 4l-15 15-7-7-5 5 12 12 20-20z" fill="#FFF"></path></svg></span></span><label for="fr-image-caption-layer-bold">Bold</label></div>' +
            //     '<div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="imageSetCaption" tabIndex="2" role="button">' + b.language.translate("Update") + '</button></div>' +
            //     '</div>';

            // Create popup
            var $popup = editor.popups.create('customTooltip.popup',template);

            return $popup;
        }

        // function tooltipLayer(a) {
        //     // b = editor
        //     if (a) return editor.popups.onRefresh("image.caption", N), !0;
        //     // Create the list of buttons.
        //     caption_buttons = '<div class="fr-buttons">' + editor.button.buildList(editor.opts.imageCaptionButtons) + "</div>";
        //     var d = '<div class="fr-image-size-layer fr-layer fr-active" id="fr-image-caption-layer-' + editor.id + '">' +
        //         '<div class="fr-input-line"><input id="fr-image-caption-layer-figure-text-' + editor.id + '" type="text" placeholder="' + editor.language.translate("Figure Text") + '" tabIndex="1"></div>' +
        //         '<div class="fr-image-input-group">Align : <input type="radio" name="caption-align" value="left">&nbsp;Left&nbsp;<input type="radio" name="caption-align" value="center">&nbsp;Center&nbsp;<input type="radio" name="caption-align" value="right">&nbsp;Right&nbsp;</div>' +
        //         '<div class="fr-checkbox-line"><span class="fr-checkbox"><input name="caption-bold" class="fr-link-attr fr-not-empty" data-checked="true" type="checkbox" id="fr-image-caption-layer-bold" tabindex="3" dir="auto"><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10" height="10" viewBox="0 0 32 32"><path d="M27 4l-15 15-7-7-5 5 12 12 20-20z" fill="#FFF"></path></svg></span></span><label for="fr-image-caption-layer-bold">Bold</label></div>' +
        //         '<div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="imageSetCaption" tabIndex="2" role="button">' + editor.language.translate("Update") + '</button></div>' +
        //         '</div>';
        //     // Load popup template.
        //     var template = {
        //             buttons: caption_buttons,
        //             caption_layer: d
        //         },
        //         f = editor.popups.create("image.caption", template);
        //     return editor.$wp && editor.events.$on(editor.$wp, "scroll.image-caption", function() {
        //         xa && editor.popups.isVisible("image.caption") && OOO()
        //     }), f
        // }
        function setTooltip(){
            // get popups element
            var $popup = editor.popups.get("customTooltip.popup");
            var text = $popup.find('#fr-tooltip-text').val() || '';

            // aria-hidden="true" placement="right" [ngbTooltip]="tipContent"
            var op = { 'pb-tooltip': text};
            try {
                if(editor.format.is('span[pb-tooltip]') && (editor.selection.text()).length > 0){
                    editor.format.remove('span');
                }

                if((editor.selection.text()).length > 0 && text.length > 0){
                    editor.format.apply('span', op);
                }

            } catch(e){
                // do nothing
                console.error(e);
            }
            // cleanup
            // fa.call($.get(0))
            editor.selection.restore();
            this.hidePopup();

        }

        function showTooltipPopup(txt){
            // Get the popup object defined above.
            var $popup = editor.popups.get("customTooltip.popup");

            // If popup doesn't exist then create it.
            // To improve performance it is best to create the popup when it is first needed
            // and not when the editor is initialized.
            if(!$popup) $popup = initPopup();

            // Set the editor toolbar as the popup's container.
            editor.popups.setContainer('customTooltip.popup',editor.$tb);

            // This will trigger the refresh event assigned to the popup.
            // editor.popups.refresh('customTooltip.popup');

            // This custom popup is opened by pressing a button from the editor's toolbar.
            // Get the button's object in order to place the popup relative to it.
            var $btn = editor.$tb.find('.fr-command[data-cmd="tooltip"]');

            // Set the popup's position.
            var left = $btn.offset().left + $btn.outerWidth() / 2;
            var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

            // Show the custom popup.
            // The button's outerHeight is required in case the popup needs to be displayed above it.
            editor.popups.show('customTooltip.popup', left, top, $btn.outerHeight());

            // Find existing value and set default on popup
            var e = $(editor.selection.element());
            if (e.get(0) != editor.el) {
                var f = e.get(0);
                f.tagName == "SPAN" && f.hasAttribute('pb-tooltip');
            }

            $popup.find('#fr-tooltip-text').val(txt || '');

            // a || (a = tooltipLayer()), s(), editor.popups.refresh("image.tooltip"), editor.popups.setContainer("image.tooltip", editor.$sc);
            // var c = xa.offset().left + xa.width() / 2,
            //     d = xa.offset().top + xa.height();
            // editor.popups.show("image.caption", c, d, xa.outerHeight())
        }

        function hidePopup(){
            editor.popups.hide('customTooltip.popup');
        }

        function getSelectionText() {
            var text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
            return text;
        }

        function refresh($btn,tag){
            var e = $(editor.selection.element());

            if (e.get(0) != editor.el) {
                var f = e.get(0);
                f.tagName == "SPAN" && f.hasAttribute('pb-tooltip') && $btn.addClass('fr-active');
            }
        }

        return {
            // _init: n,
            // format: i,
            // refresh: j,
            refresh: refresh,
            setTooltip: setTooltip,
            hidePopup: hidePopup,
            showTooltipPopup : showTooltipPopup
        }
    };

    $.FE.DefineIcon("customTooltip", {NAME: "commenting"});
    $.FE.RegisterCommand("tooltip", {
        title: "Hover Text",
        undo: false,
        focus: false,
        plugin: 'customTooltip',
        icon: 'customTooltip',
        refresh: function($btn) {
            //highlight toolbar button
            this.customTooltip.refresh($btn, "SPAN");
        },
        callback: function() {
            // find existing value if exist
            var e = $(this.selection.element());
            var txt = '';
            if (e.get(0) != this.el) {
                var f = e.get(0);
                if(f.tagName == "SPAN" && f.hasAttribute('pb-tooltip')){
                    txt = f.getAttribute('pb-tooltip');
                }
            }

            // show tooltip popup
            this.customTooltip.showTooltipPopup(txt);
        }
    });
    $.FE.RegisterCommand("tooltipSetTooltip", {
        undo: !0,
        focus: !1,
        title: 'Tooltip',
        refreshAfterCallback: !1,
        callback: function(){
            // set tooltip
            this.customTooltip.setTooltip();
        }
    });

});
