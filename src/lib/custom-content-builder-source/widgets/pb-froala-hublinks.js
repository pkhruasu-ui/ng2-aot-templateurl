! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c)
    } : a(window.jQuery)
}(function($) {

    $.FE.PLUGINS.hubLink = function(editor) {

        function refresh($btn,tag){
            var e = $(editor.selection.element());

            if (e.get(0) != editor.el) {
                var f = e.get(0);
                f.tagName == tag && f.hasAttribute('hublinks') && $btn.addClass('fr-active');
            }
        }

        function toggle(){

            var e = $(editor.selection.element());

            if (e.get(0) != editor.el) {
                var f = e.get(0);
                if(f.tagName == "A"){
                    $(f).attr('hublinks', f.hasAttribute('hublinks') ? null: "")
                }
            }

        }

        return {
            refresh: refresh,
            toggle: toggle
        }
    };

    $.FE.DefineIcon("hubLink", {NAME: "shopping-bag"});
    $.FE.RegisterCommand("hubLink", {
        title: "mark as hub link",
        undo: false,
        focus: false,
        plugin: 'hubLink',
        icon: 'hubLink',
        refresh: function($btn) {
            this.hubLink.refresh($btn, "A");
        },
        callback: function(a, b, c) {
            this.hubLink.toggle();
        }
    });

    $.FE.DEFAULTS.linkEditButtons = $.FE.DEFAULTS.linkEditButtons.concat(["hubLink"]);

});
