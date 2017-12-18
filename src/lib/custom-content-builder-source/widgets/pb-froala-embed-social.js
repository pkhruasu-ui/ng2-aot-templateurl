! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c)
    } : a(window.jQuery)
}(function($) {
    $.extend($.FE.POPUP_TEMPLATES, {
        "embedSocial.popup": "[_BUTTONS_][_CUSTOM_LAYER_]",
    });

    $.extend($.FE.DEFAULTS, {
        embedSocialButtons: ['embedSocialCancel','|','embedSocialTwitter','embedSocialInstagram','embedSocialFacebook']
    });

    $.FE.EMBEDSOCIAL_PROVIDERS = {
        embedSocialTwitter : '^<blockquote(.*)<\/blockquote>([ \s]*)<script(.*)src=(https:)?\/\/platform\.twitter\.com\/widgets\.js charset=utf-8><\/script>$',
        embedSocialInstagram : '^<blockquote(.*)<\/blockquote>([ \s]*)<script(.*)src=\/\/platform\.instagram\.com(.*).js><\/script>',
        embedSocialFacebook : '^<iframe(.*)src=https:\/\/www\.facebook\.com\/plugins\/(video|post).php\?.*><\/iframe>'
    };

    $.FE.PLUGINS.embedSocial = function(editor) {


        function initPopup(){
            var template = {
                buttons: '<div class="fr-buttons">' + editor.button.buildList(editor.opts.embedSocialButtons) + '</div>',
                custom_layer: '<div class="fr-layer fr-active">' +
                '<div class="fr-input-line"><textarea id="fr-embed-social-code" type="text" placeholder="Embedded Code" tabindex="1" aria-required="true" rows="5" dir="auto"></textarea><label for="fr-embed-social">Embedded Code</label></div>' +
                '<div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="embedSocialInsert" tabindex="2" role="button">' + editor.language.translate("Insert")+ '</button></div>'  +
                '</div>'
            };

            // Create popup
            var $popup = editor.popups.create('embedSocial.popup',template);

            return $popup;
        }

        function insertSocial(){
            // get popups element
            var $popup = editor.popups.get("embedSocial.popup");
            var text = $popup.find('#fr-embed-social-code').val() || '';
            var layer = $popup.find('.fr-layer');

            var type = $(layer).attr('class').match(/embedSocial\S+/,'g');
            if(type.length > 0){ type = type[0];}

            //cleanup text
            text = text.replace(/\n/g,'').replace(/"/g,'').trim();

            try {
                var pattern = new RegExp($.FE.EMBEDSOCIAL_PROVIDERS[type],'gmi');
                if( pattern.test(text)){
                    editor.html.insert(text + "<p><br/></p><p></p>",false);
                    // cleanup
                    editor.selection.restore();
                    this.hidePopup();
                }
            } catch(e){
                // do nothing
                console.error(e);
            }
        }

        function showPopup(txt){
            // Get the popup object defined above.
            var $popup = editor.popups.get("embedSocial.popup");

            // If popup doesn't exist then create it.
            // To improve performance it is best to create the popup when it is first needed
            // and not when the editor is initialized.
            if(!$popup) $popup = initPopup();

            // Set the editor toolbar as the popup's container.
            editor.popups.setContainer('embedSocial.popup',editor.$tb);

            // This will trigger the refresh event assigned to the popup.
            // editor.popups.refresh('customTooltip.popup');

            // This custom popup is opened by pressing a button from the editor's toolbar.
            // Get the button's object in order to place the popup relative to it.
            var $btn = editor.$tb.find('.fr-command[data-cmd="embedSocial"]');

            // Set the popup's position.
            var left = $btn.offset().left + $btn.outerWidth() / 2;
            var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

            // Show the custom popup.
            // The button's outerHeight is required in case the popup needs to be displayed above it.
            editor.popups.show('embedSocial.popup', left, top, $btn.outerHeight());
        }

        function hidePopup(){
            editor.popups.hide('embedSocial.popup');
        }

        function refresh($btn,type){
            var c = $(editor.popups.get("embedSocial.popup"));
            c.find(".fr-layer").hasClass(type) && $btn.addClass("fr-active").attr("aria-pressed", !0);
        }

        function toggle(){
            var e = $(editor.selection.element());

            if (e.get(0) != editor.el) {
                var f = e.get(0);
                if(f.tagName == "A"){
                    $(f).attr('scroll-to', f.hasAttribute('scroll-to') ? null: "")
                }
            }
        }

        function refreshBtn(type){
            var layer = $(editor.popups.get("embedSocial.popup")).find('.fr-layer').removeClass(function(idx,className){
                return (className.match(/embedSocial(\S)+/g) || []).join(' ');
            }).addClass(type);
        }

        return {
            refresh: refresh,
            toggle: toggle,
            refreshBtn: refreshBtn,
            hidePopup: hidePopup,
            showPopup: showPopup,
            insertSocial : insertSocial
        }
    };

    $.FE.DefineIcon("embedSocial", {NAME: "share-square-o"});
    $.FE.RegisterCommand("embedSocial", {
        title: "Embed social",
        undo: false,
        focus: false,
        popup: true,
        plugin: 'embedSocial',
        icon: 'embedSocial',
        callback: function() {
            if(!this.popups.isVisible('embedSocial.popup')){
                // show tooltip popup
                this.embedSocial.showPopup();
                this.embedSocial.refreshBtn('embedSocialTwitter');  //default to twitter

            }else{
                if (this.$el.find('.fr-marker')) {
                    this.events.disableBlur();
                    this.selection.restore();
                }
                this.popups.hide('embedSocial.popup');
            }
        }
    });

    // extend the default with our new button
    $.FE.RegisterCommand("embedSocialInsert", {
        undo: !0,
        focus: !1,
        title: 'Embed Social',
        refreshAfterCallback: !1,
        callback: function(){
            // set tooltip
            this.embedSocial.insertSocial();
        }
    });

    $.FE.DefineIcon("embedSocialTwitter", {NAME: "twitter"});
    $.FE.RegisterCommand("embedSocialTwitter",{
        title: "Embed Twitter",
        undo : false,
        focus: false,
        toggle: true,
        refresh: function($btn){
            this.embedSocial.refresh($btn,"embedSocialTwitter");
        },
        callback: function(){
            this.embedSocial.refreshBtn('embedSocialTwitter');
        }
    });

    $.FE.DefineIcon("embedSocialInstagram", {NAME: "instagram"});
    $.FE.RegisterCommand("embedSocialInstagram",{
        title: "Embed Instagram",
        undo : false,
        focus: false,
        toggle: true,
        refresh: function($btn){
            this.embedSocial.refresh($btn,"embedSocialInstagram");
        },
        callback: function(){
            this.embedSocial.refreshBtn('embedSocialInstagram');
        }
    });

    $.FE.DefineIcon("embedSocialFacebook", {NAME: "facebook"});
    $.FE.RegisterCommand("embedSocialFacebook",{
        title: "Embed Facebook",
        undo : false,
        focus: false,
        toggle: true,
        refresh: function($btn){
            this.embedSocial.refresh($btn,"embedSocialFacebook");
        },
        callback: function(){
            this.embedSocial.refreshBtn('embedSocialFacebook');
        }
    });

    $.FE.DefineIcon("embedSocialCancel", {NAME: "times"});
    $.FE.RegisterCommand("embedSocialCancel",{
        title: "Cancel",
        undo : false,
        focus: false,
        callback: function(){
            this.embedSocial.hidePopup();
        }
    });
});
