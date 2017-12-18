/**
 * Created by pkhruasuwan on 3/8/17.
 */
/*!
 * widget to add froala.
 */

"use strict";

! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c)
    } : a(window.jQuery)
}(function($){
    //Init
    function PBFroala(sel, options){
        this.settings = {
            allowHtmlEditing: true,
            fullBleedThemeColor : [
                { color: '#FFFFFF', class: ''},  // REMOVE
                { color: '#F9F9F9', class: 'theme-1'},
                { color: '#C2F5FF', class: 'theme-2'},
                { color: '#0A1C6B', class: 'theme-3'},
                { color: '#B0008F', class: 'theme-4'}
            ],
            useSnippetsFilter: true,
            useSnippets: true,
            useRowTool: true,
            rowTool: {
                move: true,
                copy: true,
                shrink: true,
                expand: true,
                delete: true,
                theme: true,
                responsive: true
            },
            snippetFiles: ['./snippets/snippets.html'],
            snippetCategories: [
                [0, "All"],
                [1, "Text"],
                [2, "Images"],
                [3, "Call to Action"],
                [4, "List, Tabs & Tables"],
                [5, "Map"],
                [6, "Video"],
                [7, "Separator"],
                [8, "Dynamic Widgets"]
            ],
            registerEvent: function(){},
            onInit: function(el){},
            onDrop: function(el,droppedEl,e){},
            onCopy: function(el,droppedEl,e){},
            onGetHTML: function(html){return html}
        }

        // merge public settings
        this.settings = $.extend({}, this.settings,options);
        this.settings.rowTool = {
            move: this.settings.rowTool.move !== undefined ? !!this.settings.rowTool.move : true,
            copy: this.settings.rowTool.copy !== undefined ? !!this.settings.rowTool.copy : true,
            shrink: this.settings.rowTool.shrink !== undefined ? !!this.settings.rowTool.shrink  : true,
            expand: this.settings.rowTool.expand !== undefined ? !!this.settings.rowTool.expand : true,
            delete: this.settings.rowTool.delete !== undefined ? !!this.settings.rowTool.delete : true,
            theme: this.settings.rowTool.theme !== undefined ? !!this.settings.rowTool.theme : true,
            responsive: this.settings.rowTool.responsive !== undefined ? !!this.settings.rowTool.responsive : true
        }

        // merge private settings
        this.settings = $.extend({}, this.settings,{
            dropArea: sel,
            blockSel: '.sb-container,.sb-full-bleed',
            dynamicWidgetSel: 'news-widget-template,luminary-widget,time-off-summary,teamviewer,corporate-card',
            cnt : 0,
            snippetList: '#divSnippetList',
        });

        this.init = init;
        this.setupTool = setupTool;
        this.readTemplates = readTemplates;
        this.getCategorySelectionHTML = getCategorySelectionHTML;
        this.setupDroppableArea = setupDroppableArea;
        this.clearCnt = clearCnt;
        this.showPlceholder = showPlaceholder;
        this.removePlaceholder = removePlaceholder;
        this.currentImgEvent = null;
        this.activeImg = null;
        this.$activeElement = null;
        this.openUploadModal = openUploadModal;
        this.getImageDimension = getImageDimension;
        this.compileExistingHTML = compileExistingHTML;
        this.getHTML = getHTML;
        this.wrapTool = wrapTool;
        this.registerEvent = registerEvent;
        this.destroy = destory;

        var toolbar = ['bold', 'italic', 'underline', 'strikeThrough', 'paragraphFormat','color', 'insertHR','insertThickHR', '-', 'align' , 'outdent' ,'indent', 'formatOL', 'formatUL','formatULCustom', 'quote', 'insertLink','-' ,'insertImage','insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting','tooltip', 'embedSocial'];
        // 'insertCustomIframe'
        var allowedStyleProps =  ['background', 'color', 'width', 'text-align', 'vertical-align', 'background-color'];
        var htmlAllowedAttrs = $.FE.DEFAULTS.htmlAllowedAttrs.concat(['pb-tooltip', 'scroll-to', 'hublinks']); // any custom attribute
        var tableEditButtons = [];
        tableEditButtons = $.FE.DEFAULTS.tableEditButtons.concat(['-', 'insertLink', 'insertVideo', 'insertImage']);

        this.froalaOptions = {
            // enter: $.FroalaEditor.ENTER_DIV,
            key: "QussjC3vyz==",
            toolbarInline: true,
            multiLine: true,
            charCounterCount: false,
            // toolbarVisibleWithoutSelection: true,
            angularIgnoreAttrs: null,
            // heightMin: 200,
            imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
            imageUploadParam: 'upload_file',
            imageUploadParams: {
                id: 'froala',
                app: options.path
            },
            // toolbarStickyOffset: 72,
            imageUploadURL: '/searchsvc/upload',
            imageManagerLoadURL : '',
            immediateAngularModelUpdate: false,
            placeholderText: 'Enter Description',
            toolbarButtons: toolbar,
            toolbarButtonsSM: toolbar,
            toolbarButtonsMD: toolbar,
            toolbarButtonsXS: toolbar,
            videoInsertButtons:['videoByURL', 'videoEmbed'],
            // htmlUntouched: true,
            linkMultipleStyles: false,
            linkStyles: {
                "btn btn-primary": "<span class='btn btn-primary mt-xs mb-xs'>Primary</span>",
                "btn btn-secondary": "<span class='btn btn-secondary mt-xs mb-xs'>Secondary</span>",
                "btn-link ": "<span class='btn-link mt-xs mb-xs'>Link</span><hr/>",
                "btn btn-primary btn-external md-buttons": "<span class='btn btn-primary btn-external md-buttons mt-xs mb-xs'>Primary External</span>",
                "btn btn-secondary btn-external md-buttons": "<span class='btn btn-secondary btn-external md-buttons mt-xs mb-xs'>Secondary External</span>",
                "btn-link link-external md-buttons": "<span class='btn-link link-external md-buttons mt-xs mb-xs'>Link External</span><hr/>",
                "btn btn-primary btn-internal md-buttons": "<span class='btn btn-primary btn-internal md-buttons mt-xs mb-xs'>Primary Internal</span>",
                "btn btn-secondary btn-internal md-buttons": "<span class='btn btn-secondary btn-internal md-buttons mt-xs mb-xs'>Secondary Internal</span>",
                "btn-link link-internal md-buttons": "<span class='btn-link link-internal md-buttons mt-xs mb-xs'>Link Internal</span><hr/>",
                "btn btn-primary btn-download md-buttons": "<span class='btn btn-primary btn-download md-buttons mt-xs mb-xs'>Primary Download</span>",
                "btn btn-secondary btn-download md-buttons": "<span class='btn btn-secondary btn-download md-buttons mt-xs mb-xs'>Secondary Download</span>",
                "btn-link link-download md-buttons": "<span class='btn-link link-download md-buttons mt-xs mb-xs'>Link Download</span><hr/>",
                "btn btn-primary btn-phone md-buttons": "<span class='btn btn-primary btn-phone md-buttons mt-xs mb-xs'>Primary Phone</span>",
                "btn btn-secondary btn-phone md-buttons": "<span class='btn btn-secondary btn-phone md-buttons mt-xs mb-xs'>Secondary Phone</span>",
                "btn-link link-phone md-buttons": "<span class='btn-link link-phone md-buttons mt-xs mb-xs'>Link Phone</span><hr/>",
                "btn btn-primary btn-email md-buttons": "<span class='btn btn-primary btn-email md-buttons mt-xs mb-xs'>Primary Email</span>",
                "btn btn-secondary btn-email md-buttons": "<span class='btn btn-secondary btn-email md-buttons mt-xs mb-xs'>Secondary Email</span>",
                "btn-link link-email md-buttons": "<span class='btn-link link-email md-buttons mt-xs mb-xs'>Link Email</span><hr/>",
                // "btn btn-primary btn-video md-buttons": "<span class='btn btn-primary btn-video md-buttons mt-xs mb-xs'>Primary Video</span>",
                // "btn btn-secondary btn-video md-buttons": "<span class='btn btn-secondary btn-video md-buttons mt-xs mb-xs'>Secondary Video</span>",
                // "btn-link link-video md-buttons": "<span class='btn-link link-video md-buttons mt-xs mb-xs'>Link Video</span>"
            },
            tableMultipleStyles: false,
            tableEditButtons: tableEditButtons,
            tableStyles: {
                "table": 'Plain',
                "table table-striped": 'Striped',
                "table table-inverse": 'Inverse',
                "table table-bordered": 'Bordered',
                "table table-hover": 'Hoverable',
                "table-sm": 'Compact',
                "table borderless": 'Borderless'
            },
            paragraphFormat: {
                N: 'Normal',
                H1: 'Heading 1',
                H2: 'Heading 2',
                H3: 'Heading 3',
                H4: 'Heading 4',
                H5: 'Heading 5',
                H6: 'Heading 6',
                SMALL: 'Small',
                PRE: 'Code'
            },
            colorsText: ['#FFFFFF','#F0EEEC', '#999999', '#767676','#545459','#333333','#111111','#F18E0C','#DD1E31','#0654BA','#5BA71B','#0A1C6B','#006EFC','#ABD1FA','#C2F5FF','#591B95','#6666D1','#00A795','#00D5C3','#5DF0AD','#CFFCF0','#FF5151','#FFEBE3','REMOVE'],
            colorsBackground: ['#F0EEEC', '#999999', '#767676','#555555','#F18E0C','#DD1E31','#0654BA','#5BA71B','REMOVE'],
            fontSizeSelection: false,
            fontFamilySelection: false,
            linkList: [],
            videoAllowedTypes: ['mp4', 'webm', 'ogg','pdf'],
            wordAllowedStyleProps: allowedStyleProps,
            pasteAllowedStyleProps: allowedStyleProps,
            htmlAllowedAttrs: htmlAllowedAttrs,
            imageDefaultWidth: 650
            // ,
            // toolbarContainer: '#toolbarContainer'
        }

        if(this.settings.allowHtmlEditing){
            this.froalaOptions.toolbarButtons.push('html');
            this.froalaOptions.toolbarButtonsMD.push('html');
        }

        var themeColorsHtml = "";
        for(var i = 0; i < this.settings.fullBleedThemeColor.length; i++){
            themeColorsHtml += '<span class="color-board-color" style="background-color: ' + this.settings.fullBleedThemeColor[i]['color'] + '" data-theme="' + this.settings.fullBleedThemeColor[i]['class'] + '"></span>';
        }

        var responsiveHtml =    '<div class="row-responsive"><i class="pb-icon-desktop"></i>' +
                                    '<div class="responsive-board text-center"><h4><strong>Responsive Behavior</strong></h4><h6 class="text-muted text-uppercase mb-sm"><strong>Hide Content At</strong></h6>' +
                                    '<div class="responsive-icon-wrapper responsive-icon-wrapper-desktop active"><i class="pb-icon-desktop responsive-icon"></i><h6 class="text-uppercase text-muted mt-xs"><strong>desktop</strong></h6></div>' +
                                    // '<div class="responsive-icon-wrapper responsive-icon-wrapper-tablet active"><i class="fa fa-tablet responsive-icon"></i></div>' +
                                    '<div class="responsive-icon-wrapper responsive-icon-wrapper-mobile active"><i class="pb-icon-mobile responsive-icon"></i><h6 class="text-uppercase text-muted mt-xs"><strong>mobile</strong></h6></div>' +
                                '</div></div>';

        this.rowTool =  '<div class="row-tool" style="right: auto; left: -37px; display: none;">' +
                            (this.settings.rowTool.move ? '<div class="row-handle ui-sortable-handle"><i class="cb-icon-move"></i></div>':'') +
                            (this.settings.rowTool.copy ? '<div class="row-copy"><i class="cb-icon-plus"></i></div>':'') +
                            (this.settings.rowTool.shrink ?'<div class="row-addcolumn ui-sortable-handle"><i class="cb-icon-left-open-big"></i></div>':'') +
                            (this.settings.rowTool.expand ?'<div class="row-removecolumn ui-sortable-handle"><i class="cb-icon-right-open-big"></i></div>':'') +
                            (this.settings.rowTool.responsive ?responsiveHtml :'') +
                            (this.settings.rowTool.delete ?'<div class="row-remove"><i class="cb-icon-cancel"></i></div>':'') +
                        '</div>';

        this.rowFullbleedTool =  '<div class="row-tool" style="right: auto; left: -37px; display: none;">' +
                            (this.settings.rowTool.move ? '<div class="row-handle ui-sortable-handle"><i class="cb-icon-move"></i></div>':'') +
                            (this.settings.rowTool.copy ? '<div class="row-copy"><i class="cb-icon-plus"></i></div>':'') +
                            (this.settings.rowTool.shrink ?'<div class="row-addcolumn ui-sortable-handle"><i class="cb-icon-left-open-big"></i></div>':'') +
                            (this.settings.rowTool.expand ?'<div class="row-removecolumn ui-sortable-handle"><i class="cb-icon-right-open-big"></i></div>':'') +
                            (this.settings.rowTool.theme ? '<div class="row-color"><i class="fa fa-tint"></i><div class="color-board text-left"><div class="text-center">Row Colors</div>' + themeColorsHtml + '</div></div>' : '') +
                            (this.settings.rowTool.responsive ?responsiveHtml :'') +
                            (this.settings.rowTool.delete ?'<div class="row-remove"><i class="cb-icon-cancel"></i></div>':'') +
                        '</div>';

        this.rowNewsTool =  '<div class="row-tool" style="right: auto; left: -37px; display: none;">' +
                                (this.settings.rowTool.move ? '<div class="row-handle ui-sortable-handle"><i class="cb-icon-move"></i></div>':'') +
                                '<div class="row-html"><i class="cb-icon-cog"></i></div>' +
                                (this.settings.rowTool.copy ? '<div class="row-copy"><i class="cb-icon-plus"></i></div>':'') +
                                (this.settings.rowTool.delete ?'<div class="row-remove"><i class="cb-icon-cancel"></i></div>':'') +
                            '</div>';

        this._confirmModal =
                                '<div class="md-modal" id="md-delrowconfirm">' +
                                '    <div class="md-content">' +
                                '        <div class="md-body">' +
                                '            <div style="padding:20px 20px 25px;text-align:center;">' +
                                '                <p>Are you sure you want to delete this block?</p>' +
                                '                <button id="btnDelRowCancel"> CANCEL </button>' +
                                '                <button id="btnDelRowOk" style="margin-left:12px"> OK </button>' +
                                '            </div>' +
                                '        </div>' +
                                '    </div>' +
                                '</div>';

        this._newsModal =
                            '<div class="md-modal" id="md-createlink">' +
                            '    <div class="md-content">' +
                            '        <div class="md-body">' +
                            '            <div class="md-label">Site Name:</div>' +
                            '            <input type="text" id="txtLink" class="inptxt" value="" style="float:left;width:80%">' +
                            '            <br style="clear:both">' +
                            '            <div class="md-label">Page Name :</div>' +
                            '            <input type="text" id="txtLinkText" class="inptxt" style="float:left;width:80%">                    ' +
                            '            <br style="clear:both">' +
                            '        </div>' +
                            '        <div class="md-footer">' +
                            '            <button id="btnLinkOk"> Ok </button>' +
                            '        </div>' +
                            '    </div>' +
                            '</div>';

        this._corporateCard =
                            '<div class="md-modal" id="md-createRegion">' +
                            '    <div class="md-content">' +
                            '        <div class="md-body">' +
                            '            <div class="md-label">Region:</div>' +
                            '            <input type="text" id="regionTxt" class="inptxt" value="" style="float:left;width:80%">' +
                            '            <br style="clear:both">' +
                            '        </div>' +
                            '        <div class="md-footer">' +
                            '            <button id="regionBtnLinkOk"> Ok </button>' +
                            '        </div>' +
                            '    </div>' +
                            '</div>';

        // init
        this.init();
    }

    function init(){
        // order is important
        this.setupTool();
        this.setupDroppableArea();
        this.compileExistingHTML();
        this.settings.onInit(this.settings.dropArea);

        // run through each plugins
        // for(var key in this.PLUGINS){
        //     if( this.PLUGINS.hasOwnProperty(key)){ console.log(this.PLUGINS[key]);}
        // }
    }

    function setupTool(){

        var toolwidth = 260;// parseInt($('#divTool').css('width'));
        var _t = this;

        /**** Check if sidebar is there ****/
        if (jQuery('#divCb').length == 0) {
            jQuery('body').append('<div id="divCb"></div>');
        }

        //append all modals html
        $(this.settings.dropArea)
            .parent()
            .after(
                $(  this._confirmModal +
                    this._newsModal+
                    this._corporateCard
                ));


        if(this.settings.useSnippets){
            /**** Load snippets library ****/
            if($('#divSnippets').length == 0){
                $('#divCb').append('<div id="divSnippets" style="display: none"></div>');
            }

            var catSelectHtml = this.getCategorySelectionHTML();

            var s = '<div id="divTool">';
            s += catSelectHtml;
            s += '<div id="divSnippetList"></div>';
            s += '<a id="lnkToolOpen" href="#"><i class="cb-icon-left-open-big" style="font-size: 15px;"></i></a>';
            s += '</div>';

            $('#divCb').append(s);

            if(jQuery('#divTool').css('right')!='0px'){ //if right=0px means snippets already exist and opened, so on new init (new instance), don't close by setting it =-toolwidth.
                jQuery('#divTool').css('width', toolwidth + 'px');
                jQuery('#divTool').css('right', '-' + toolwidth + 'px');
            }

            $('#lnkToolOpen').off('click');
            $('#lnkToolOpen').on('click',function(e){
                if (parseInt($('#divTool').css('right')) == 0) {
                    //Close
                    $('#divTool').animate({
                        right: '-=' + toolwidth + 'px'
                    }, 200);
                    $('#lnkToolOpen i').attr('class','cb-icon-left-open-big');

                    $('#divSnippetScrollUp').css('display','none');
                    $('#divSnippetScrollDown').css('display','none');
                } else {
                    //Open
                    $('#divTool').animate({
                        right: '+=' + toolwidth + 'px'
                    }, 200);
                    $('#lnkToolOpen i').attr('class','cb-icon-right-open-big');

                    if(true || bUseScrollHelper){
                        var ypos = $('#divSnippetList').height()/2 - 60;
                        $('#divSnippetScrollUp').css('top',ypos);
                        $('#divSnippetScrollDown').css('top',ypos + 60);
                        if($("#divSnippetList").scrollTop()!=0){
                            $('#divSnippetScrollUp').fadeIn(300);
                        } else {
                            $('#divSnippetScrollUp').fadeOut(300);
                        }
                        $('#divSnippetScrollDown').fadeIn(300);
                    }
                }

                e.preventDefault();
            })

            // default show
            $('#divTool').animate({
                right: '+=' + toolwidth + 'px'
            }, 900);


            this.readTemplates();
        }



        /**** IMG TOOLBOX ****/
        if($("divToolImg").length === 0){

            $('body').append($('<div id="divToolImg"><i id="lnkEditImage" class="cb-icon-camera"></i></div>'));

            $('#divToolImg').off('hover');
            $('#divToolImg').hover(function(e){
                $('#divToolImg').stop(true, true).css('display','block');

            },function(e){
                // $('#divToolImg').stop(true, true).fadeOut(0);
            })

            $('#divToolImg').off('click')
            $('#divToolImg').click(function(e){
                e.preventDefault();
                e.stopPropagation();
                $('#divToolImg').stop(true, true).fadeOut(0);
                _t.activeImg = _t.currentImgEvent;
                _t.openUploadModal($(_t.activeImg.currentTarget));
            })
        }

    }
    function getCategorySelectionHTML(){
        var html_catselect = '';

        if(this.settings.useSnippetsFilter){
            var catList = this.settings.snippetCategories;

            for(var i=0; i < catList.length; i++){
                html_catselect += '<option value="' + catList[i][0] + '">' + catList[i][1] + '</option>';
            }

            return '<select id="selSnips" style="display:none;width:83%;margin:5px;padding:5px;margin:3px 0 13px 5px;font-size:12px;letter-spacing:1px;height:28px;line-height:1;color:#454545;border-radius:0px;border:none;background:#fff;box-shadow: 0 0 5px rgba(0, 0, 0,0.2);cursor:pointer;">' +
                    html_catselect +
                    '</select>';

        }else{
            return '';
        }
    }

    function readTemplates(){
        var html = '';
        var htmlData = '';
        var htmlThumbs = '';
        var i = 1;
        var bUseSnippetsFilter = false;
        var isAdmin = this.settings.isAdmin;
        var _t = this;

        // build list of files to download
        var snippetFiles = this.settings.snippetFiles;
        var optionType = Object.prototype.toString.call(snippetFiles);
        var htmlGetList = [];

        if(optionType === "[object String]"){
            htmlGetList = [$.get(snippetFiles)]; // common snippet
        }else if(optionType  === "[object Array]"){
            htmlGetList = snippetFiles.map(function(f){ return $.get(f);})
        }

        var defer = $.when.apply(this,htmlGetList);
        defer.done(function(){
            if(htmlGetList.length === 1){
                html += arguments[2].responseText;
            }else{
                $.each(arguments,function(idx, res){
                    html += res[2].responseText;
                })
            }

            // compile data into encoded thumbnail
            $('<div/>').html(html).children('div').each(function(){
                var block = $(this).html();
                //Enclode each block. Source: http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
                var blockEncoded = encodeHTML(block);
                htmlData += '<div id="snip' + i + '">' + blockEncoded + '</div>'; //Encoded html prevents loading many images

                if(jQuery(this).data("cat")!=null) bUseSnippetsFilter=true;
                var thumb = jQuery(this).data("thumb");

                if(bUseSnippetsFilter){
                    // htmlThumbs += '<div style="display:none" title="Snippet ' + i + '" data-snip="' + i + '" data-cat="' + jQuery(this).data("cat") + '"><img src="' + thumb + '" /></div>';
                    // TODO: add filter functionality then switch to above line
                    // TODO: condition for content/strucutre
                    htmlThumbs += '<div title="Snippet ' + i + '" data-snip="' + i + '" data-cat="' + jQuery(this).data("cat") + '" data-type="' +  jQuery(this).data('type') +'" data-width="' +  jQuery(this).data('width') +'"><img src="' + thumb + '" /></div>';
                } else {
                    htmlThumbs += '<div title="Snippet ' + i + '" data-snip="' + i + '" data-cat="' + jQuery(this).data("cat") + '"><img src="' + thumb + '" /></div>';
                }

                i++;
            })

            jQuery('#divSnippets').html(htmlData);

            jQuery('#divSnippetList').html(htmlThumbs);

            setupSnippets.call(_t);

            // bind category selection event
            var cb_snippetList = _t.settings.snippetList;
            if(_t.settings.useSnippetsFilter){

                var cats = [];

                //$(cb_snippetList + ' > div').css('display','none');
                var defaultExists = false;
                $(cb_snippetList + ' > div').each(function () {
                    for(var j=0;j<$(this).attr('data-cat').split(',').length;j++){
                        var catid = $(this).attr('data-cat').split(',')[j];
                        if(catid == 0){
                            $(this).fadeIn(400);
                            defaultExists = true;
                        }
                        if($.inArray(catid, cats)==-1){
                            cats.push(catid);
                        }
                    }
                });

                //Remove empty categories
                $('#selSnips option').each(function(){
                    var catid = $(this).attr('value');
                    if($.inArray(catid, cats)==-1){
                        if(catid!=0 && catid!=-1){
                            $("#selSnips option[value='" + catid + "']").remove();
                        }
                    }
                });

                if(!defaultExists){//old version: default not exists, show all (backward compatibility)
                    $(cb_snippetList + ' > div').css('display','block');
                    $("#selSnips option[value='0']").remove();
                }

                $('#selSnips').css('display','block');
                $('#divSnippetList').css('height', '96%');

                $("#selSnips").on("change", function (e) {
                    var optionSelected = $("option:selected", this);
                    var valueSelected = this.value;
                    if(valueSelected=='-1'){
                        //$(cb_snippetList + ' > div').css('display','block');
                        $(cb_snippetList + ' > div').fadeIn(200);
                    } else {
                        //$(cb_snippetList + ' > div').css('display','none');
                        //$("[data-cat=" +valueSelected+ "]").css('display','block');
                        $(cb_snippetList + ' > div').fadeOut(200, function () {
                            //$("[data-cat=" +valueSelected+ "]").fadeIn(400);
                            for(var j=0;j<$(this).attr('data-cat').split(',').length;j++){
                                if(valueSelected == $(this).attr('data-cat').split(',')[j]){
                                    $(this).fadeIn(400);
                                }
                            }

                        });
                    }
                });
            }
        })
    }

    function setupDroppableArea(){

        var da = this.settings.dropArea;
        var bSel = this.settings.blockSel;
        var _t = this;

        $(da).on('drop',function(e){
            e.preventDefault();

            // removePlaceholder() //remove any placeholder in the area
            var draggedType = popStack();
            var tmp = $('<div/>').html(draggedType[1]).text();
            var droppedEl = $(tmp);
            $(da).find('.block-placeholder').replaceWith(droppedEl);

            // var droppedEl = $(da).find(droppedEl);
            _t.settings.onDrop(da,droppedEl,e);

            _t.compileExistingHTML();

            if(draggedType[2][0] == 'row-move'){
                $(draggedType[2][1].currentTarget).closest('.ui-draggable').remove();
                $('.pb-temp-ghostimage').remove();
            }

            clearStack();
            _t.clearCnt();
        });


        $(da).on('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if(_t.settings.cnt <= 0 && $(da).find('.ui-draggable').length === 0 ){
                _t.settings.cnt++;
                var draggedType = popStack();
                showPlaceholder(e.currentTarget.offsetLeft,e.currentTarget.offsetTop);

            }
        });

        $(da).on('dragover',function(e){
            e.preventDefault();
            e.stopPropagation();
        })

        $(da).on('dragleave',function(e){
            e.preventDefault();
            e.stopPropagation();

            if(_t.settings.cnt-- <= 0) {
                // console.log(1,e);
                _t.removePlaceholder();
            }
        })

        $(da).on('dragend', function (e) {
            if(_t.settings.cnt-- <= 0) _t.removePlaceholder();
            // cleanup
            $('.pb-temp-ghostimage').remove();
            var draggedType = popStack();
            var uiDraggable = $(draggedType[2][1].currentTarget).closest('.ui-draggable');
            uiDraggable.css('position','');
            uiDraggable.children().eq(0).css('display','');
            uiDraggable.children().eq(1).css('opacity','');
            clearStack();
            _t.clearCnt();
        });

        $(da).on("mouseenter",".pbedit",function(e){
            // e.preventDefault();
            // e.stopPropagation();

            $(da).find(".pbedit").not(this).each(function(idx,el){
                if( $(el).data('froala.editor')) {
                    // $(this).froalaEditor("destroy");
                }
            });
            if(!$(this).data('froala.editor')){
                initFroala(this, _t.froalaOptions);
            }
            // var ranges = [];
            //
            // var sel = window.getSelection();
            //
            // for(var i = 0; i < sel.rangeCount; i++) {
            //     ranges[i] = sel.getRangeAt(i);
            // }
            // console.log(ranges);
        })

        // LEFTTOOL EVENTS
        // CONTENT CONTAINER EVENTS
        $(da).on('dragover','.ui-draggable',function(e){
            e.preventDefault();
            e.stopPropagation();

            var dropTarget = $(e.currentTarget);

            var objPos = e.currentTarget.getBoundingClientRect();
            var topOrBotSide = isHoverTopOrBottom(objPos,e.clientY);

            var plc = $('<div style="display:none;">').addClass('block-placeholder');

            if(topOrBotSide == 'top'){
                $(dropTarget).next('.block-placeholder').remove();
                if( $(dropTarget).prev('.block-placeholder').length > 0 ) { return;}
                $(plc).insertBefore(dropTarget).slideDown(100);
            }

            if(topOrBotSide == 'bottom'){
                $(dropTarget).prev('.block-placeholder').remove();
                if( $(dropTarget).next('.block-placeholder').length > 0 ) { return;}
                $(plc).insertAfter(dropTarget).slideDown(100);;
            }
        }).on('dragleave','.ui-draggable',function(e){
            // console.log(4,e.target)
            if( !$(e.target).hasClass(bSel)){
                e.preventDefault();
                e.stopPropagation();
            }
        }).on('click','.ui-draggable',function(e){

            var not_elp = $(_t.settings.dropArea).find(' .ui-draggable.ui-dragbox-outlined').removeClass('ui-dragbox-outlined');
                not_elp.find('.row-tool').hide().find('.color-board').removeClass('active');
                not_elp.find('.row-tool').find('.responsive-board').removeClass('active');

            // var elp = $(this).closest('.ui-draggable');
            var elp = $(e.currentTarget);
                elp.addClass('ui-dragbox-outlined');
                elp.find('.row-tool').show();

        }).on('click','.row-remove',function(e){
            e.preventDefault();
            e.stopPropagation();


            /**** Custom Modal ****/
            jQuery('#md-delrowconfirm').css('max-width', '550px');
            jQuery('#md-delrowconfirm').simplemodal();
            jQuery('#md-delrowconfirm').data('simplemodal').show();

            _t.$activeElement = jQuery(this).parents('.ui-draggable');

            jQuery('#btnDelRowOk').unbind('click');
            jQuery('#btnDelRowOk').bind('click', function (e) {

                jQuery('#md-delrowconfirm').data('simplemodal').hide();

                _t.$activeElement.fadeOut(400, function () {

                    //Clear Controls
                    // jQuery("#divToolImg").stop(true, true).fadeOut(0); /* CUSTOM */
                    // jQuery("#divToolImgSettings").stop(true, true).fadeOut(0);
                    // jQuery("#divRteLink").stop(true, true).fadeOut(0);
                    // jQuery("#divFrameLink").stop(true, true).fadeOut(0);

                    _t.$activeElement.remove();

                    //Apply builder behaviors
                    //$element.data('contentbuilder').applyBehavior();

                    /**** Function to run when column/grid changed ****/
                    // $element.data('contentbuilder').blockChanged();

                    //Trigger Render event
                    // $element.data('contentbuilder').settings.onRender();

                });

            });
            jQuery('#btnDelRowCancel').unbind('click');
            jQuery('#btnDelRowCancel').bind('click', function (e) {

                jQuery('#md-delrowconfirm').data('simplemodal').hide();

            });
            /**** /Custom Modal ****/


            // $(e.currentTarget).closest('.ui-draggable').remove();

        }).on('click','.row-html',function(e){
            var newsBlock = $(e.currentTarget).closest('.ui-draggable').find('.sb-news-container');
            var corporateCardBlock = $(e.currentTarget).closest('.ui-draggable').find('.corporate-card-container');
            if(newsBlock.length !== 0){
                if(!$('#md-createlink').data('simplemodal')){ $('#md-createlink').simplemodal()}

                _t.$activeElement = newsBlock;
                $('#md-createlink').css('width','45%');
                $('#md-createlink').data('simplemodal').show();
            }
            if(corporateCardBlock.length !== 0){
                if(!$('#md-createRegion').data('simplemodal')){ $('#md-createRegion').simplemodal()}

                _t.$activeElement = corporateCardBlock;
                $('#md-createRegion').css('width','45%');
                $('#md-createRegion').data('simplemodal').show();
            }
        }).on('click','.row-copy',function(e){
            var originalBlock = $(e.currentTarget).closest('.ui-draggable').children().first();
            if(originalBlock.length !== 0){
                var clone = $(originalBlock).clone();
                $(clone).insertAfter($(e.currentTarget).closest('.ui-draggable'));

                _t.settings.onCopy(_t.settings.dropArea,$(clone),e);
                _t.compileExistingHTML();
            }
        }).on('mousedown','.row-handle',function(e){
            var block = $(e.currentTarget).closest('.ui-draggable');
            if($(block).find('.pbedit').data('froala.editor')){ $(block).find('.pbedit').froalaEditor("destroy");}
            if(block.length !== 0){

                block.on('dragstart',function(e){

                    block.css('position','absolute');
                    var blockEncoded = encodeHTML($(block).children().first()[0].outerHTML);
                    setStack('content',blockEncoded,['row-move',e]);
                    block.children().eq(0).css('display','none');
                    block.children().eq(1).css('opacity','0');

                    var crt = block.clone();
                    crt.addClass('pb-temp-ghostimage');
                    crt.children().first().css('display','');
                    crt.css('position','absolute');
                    crt.css('top','0px');
                    crt.css('right','-9999px');
                    $('body').append(crt);
                    e.originalEvent.dataTransfer.setDragImage(crt[0], 0, 0);


// var canvas = document.createElement('canvas');
//
// var ctx = canvas.getContext('2d');
//
// var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
//            '<foreignObject width="100%" height="100%">' +
//            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
//              '<em>I</em> like ' +
//              '<span style="color:white; text-shadow:0 0 2px blue;">' +
//              'cheese</span>' +
//            '</div>' +
//            '</foreignObject>' +
//            '</svg>';
//
// var DOMURL = window.URL || window.webkitURL || window;
//
// var img = new Image();
// var svg = new Blob([data], {type: 'image/svg+xml'});
// var url = DOMURL.createObjectURL(svg);
//
//
//
//                     var img = new Image();
//                     img.src = '/lib/custom-content-builder-source/assets/thumbnails/hero-lg.jpg'; //working on making the ghost image looks like an actual html
//                     e.originalEvent.dataTransfer.setDragImage(svg, 0, 0);
                    e.originalEvent.dataTransfer.setData('Text', this.id);
                })

                block.attr('draggable','true');
            }
        }).on('click','.row-addcolumn',function(e){
            var originalBlock = $(e.currentTarget).closest('.ui-draggable');

            if(originalBlock.length !== 0){
                var w = $(originalBlock)[0].style.width == '' ? 91.66 : $(originalBlock)[0].style.width.replace(/\%/,'')*1 - 8.33;
                w =  w - (w % 8.33);
                if(w <= 8.33){ w = 8.33;}

                $(originalBlock).css({ 'width': w + '%', 'display':'inline-block', 'vertical-align':'top'});
            }
        }).on('click','.row-removecolumn',function(e){
            var originalBlock = $(e.currentTarget).closest('.ui-draggable');

            if(originalBlock.length !== 0){
                var w = $(originalBlock)[0].style.width == '' ? 100 : $(originalBlock)[0].style.width.replace(/\%/,'')*1 + 8.33;
                // w =  w - (w % 8.33);
                if(w >= 100){ w = 100;}

                $(originalBlock).css({ 'width': w + '%', 'display':'inline-block', 'vertical-align':'top'});
            }
        }).on('click','.row-color',function(e){
            e.preventDefault();
            e.stopPropagation();

            //close other tools
            $(e.currentTarget).parents('.row-tool').find('.responsive-board').removeClass('active');
            //toggle
            $(e.currentTarget).find('.color-board').toggleClass('active');

        }).on('click','.row-responsive',function(e){
            e.preventDefault();
            e.stopPropagation();

            //close other tools
            $(e.currentTarget).parents('.row-tool').find('.color-board').removeClass('active');
            //toggle
            $(e.currentTarget).find('.responsive-board').toggleClass('active');
        });


        $('#btnLinkOk').off('click')
            .on('click',function(e){
                var siteName =  $('#md-createlink').find('#txtLink').val().trim();
                var pageName = $('#md-createlink').find('#txtLinkText').val().trim();

                var dWidget = $(_t.$activeElement).find(_t.settings.dynamicWidgetSel);
                if(dWidget.length !== 0){
                    if(dWidget[0].hasAttribute('data-site-name')){ $(dWidget[0]).attr('data-site-name',siteName) }
                    if(dWidget[0].hasAttribute('data-feed-name')){ $(dWidget[0]).attr('data-feed-name',pageName) }
                    if(dWidget[0].hasAttribute('data-board-name')){ $(dWidget[0]).attr('data-board-name',pageName) }
                }

                _t.$activeElement = null;
                $('#md-createlink').data('simplemodal').hide();
            })

        $('#regionBtnLinkOk').off('click')
            .on('click',function(e){
                var region =  $('#md-createRegion').find('#regionTxt').val().trim();

                var dWidget = $(_t.$activeElement).find(_t.settings.dynamicWidgetSel);
                if(dWidget.length !== 0){
                    if(dWidget[0].hasAttribute('data-region')){ $(dWidget[0]).attr('data-region',region) }
                }

                _t.$activeElement = null;
                $('#md-createRegion').data('simplemodal').hide();
            })

        // IMG EVENTS
        $(da).on("mouseenter","img",function(e){
            e.preventDefault();
            e.stopPropagation();
            if( $(e.currentTarget).closest('.fr-box').length > 0 ){ return; }
            if( $(e.currentTarget).closest(_t.settings.dynamicWidgetSel).length > 0){ return; }
            _t.currentImgEvent = e;

            showImageOption(e);
        }).on("mouseleave","img",function(e){
            e.preventDefault();
            e.stopPropagation();


            if($(e.relatedTarget).closest('.ui-draggable').find('img,figure').length == 0 && $(e.relatedTarget).closest('.img-with-text').length == 0){
                $('#divToolImg').hide();
            }
        }).on('mouseover',"img",function(e){
            e.preventDefault();
            e.stopPropagation();
        })

        // CLICK OUTSIDE EVENT
        $(document).on('mousedown',function(e){
            if($(e.target).closest('.ui-draggable').length == 0){
                var elp = $(e.currentTarget).find('.ui-draggable');
                elp.removeClass('ui-dragbox-outlined');
                elp.find('.row-tool').hide();
            }

        })

        $('#divToolImg').on('mouseenter mouseleve mouseover',function(e){
            e.preventDefault();
            e.stopPropagation();
        })


        /**
         * Decorate functionalities
         * call them using .call function and pass this as first input
         */
        // Four cards functionality
        _Linkbox.call(this,da);
        // Theme board color
        _ThemeBoardColor.call(this,da);
        //mobile functionality
        _Responsive.call(this,da);


    }

    function compileExistingHTML(){
        var da = this.settings.dropArea,
            block = this.settings.blockSel,
            _t = this;

        $(da).children('div').each(function(idx,el){

            if(!$(el).hasClass('ui-draggable')){
                if($(el).hasClass('sb-news-container') || $(el).hasClass('corporate-card-container')){
                    _t.wrapTool(el,$(_t.rowNewsTool)); //news tool
                }else if($(el).hasClass('sb-full-bleed')) {
                    _t.wrapTool(el,$(_t.rowFullbleedTool)); //news tool
                }else{
                    _t.wrapTool(el,$(_t.rowTool)); //standard tool
                }

                var ui = $(el).closest('.ui-draggable');
                if(ui.length !== 0){
                    var css = {
                        'display' : el.style.display,
                        'width'   : el.style.width,
                        'vertical-align' : el.style.verticalAlign
                    }

                    var wipe_css = {
                        'display' : '',
                        'width'   : '',
                        'vertical-align' : ''
                    }

                    $(el).css(wipe_css);
                    $(ui).css(css);
                }

                //remove any responsive class in each block, and put it in attribute
                if($(el).hasClass('hidden-xs hidden-xs-down')){
                    $(el).siblings('.row-tool').find('.row-responsive .responsive-board .responsive-icon-wrapper-mobile').removeClass('active');
                }

                if($(el).hasClass('hidden-sm hidden-sm-down')){
                    $(el).siblings('.row-tool').find('.row-responsive .responsive-board .responsive-icon-wrapper-tablet').removeClass('active');
                }

                if($(el).hasClass('hidden-md hidden-md-up')){
                    $(el).siblings('.row-tool').find('.row-responsive .responsive-board .responsive-icon-wrapper-desktop').removeClass('active');
                }

                $(el).removeClass(function (index, className) {
                    var hiddenList = (className.match(/(^|\s)hidden-\S+/g) || []).join(' ');
                    hiddenList = hiddenList.trim().replace(/  +/g,' ');
                    $(el).attr('data-responsive-hidden',hiddenList);
                    return hiddenList;
                });
            }

            $(el).find('.sb-no-editbar').each(function(idx,el){
                $(el).prop('contenteditable','true');
            })
        })
    }

    function wrapTool(el,tool){
        var wrapper = $('<div class="ui-draggable"></div>');
        $(el).wrap(wrapper);
        if(this.settings.useRowTool){$(el).after(tool);}
    }

    function showImageOption(e){
        var box = e.currentTarget.getBoundingClientRect();
        var x = box.right - box.width/2 - 15;
        var y = box.top + box.height/2 + $(window).scrollTop() - 15;
        $("#divToolImg")
            .css('display',"block")
            .css('left', parseInt(x) + 'px')
            .css('top', parseInt(y) + 'px');
    }

    var prevY = 0;
    function isHoverTopOrBottom(objRectBound,mouseY){
        // var mousePos = ( (mouseY - objRectBound.top) / objRectBound.height );
        // return ( mousePos <= 0.5 )? 'top' : ( mousePos >= 0.7 )? 'bottom' : 'mid';
        var dir =  mouseY > prevY ? 'bottom' :  mouseY < prevY ? 'top' : '';
        prevY = mouseY;
        return dir;
    }

    function isHoverLeftOrRightEdge(objRectBound,mouseX){
        var mousePosRight = ( -1 *(mouseX - objRectBound.right) / objRectBound.width );
        var mousePosLeft = ( (mouseX - objRectBound.left) / objRectBound.width );
        return ( mousePosRight >=0 && mousePosRight <= 0.1 )? 'right' : ( mousePosLeft >= 0 && mousePosLeft <= 0.1)? 'left' : '';
    }

    function showPlaceholder(){
        var wrapper = $('<div>');

        wrapper.addClass('block-placeholder');


        wrapper.on('drop',function(e){
            e.preventDefault();
            e.stopPropagation();
        })

        wrapper.on('dragover',function(e){
            e.stopPropagation();
            e.preventDefault();

            $(e.currentTarget).stop(true,true).css('display','block');
        })

        wrapper.on('dragleave',function(e){
            e.stopPropagation();
            e.preventDefault();

            _t.settings.cnt--;
            if(_t.settings.cnt) { _t.removePlaceholder();}
        })

        $('#contentarea').append(wrapper);
    }

    function removePlaceholder(){
        $('#contentarea .block-placeholder').remove();
        this.settings.cnt = 0;
    }

    function registerEvent(event, callback){
        // pb.froala.onInit             - when code is first initialized
        // pb.froala.ondrop          - When widget is dropped
        this._registerEvents[event].push(callback);
    }

    // TODO: find way to use datatransfer on event to pass data
    var dragStack = [];
    function setStack(a,b,c){
        dragStack.push(a);dragStack.push(b);dragStack.push(c);
    }
    function clearStack(){
        dragStack = [];
    }
    function popStack(){
        return dragStack;
    }
    function clearCnt(){
        this.settings.cnt = 0;
    }

    function setupSnippets(){
        var _t = this;
        $('#divSnippetList>div').on('dragstart', function (e) {
            e.originalEvent.dataTransfer.setData('Text', this.dataset.snip);
            // e.originalEvent.dataTransfer.setData('TextType', this.dataset.type? this.dataset.type : 'content');
            setStack(this.dataset.type? this.dataset.type : 'content', $('#snip' + this.dataset.snip).html(),['snip-drop']);
        }).on('dragend',function(e){
            if(_t.settings.cnt-- <= 0) _t.removePlaceholder();
            clearStack();
        });
    }

    function openUploadModal(images){

        if(!!imageUploader){
            getImageDimension(images,function(dimension){
                // let freeCropMode = $(self.$elementSrc)[0].getAttribute('type') == 'fullbleedImg';
                var freeCropMode = true;

                var height = dimension.h;
                var width = dimension.w;

                var uploadModal = imageUploader.modalComponent.modalService.open(imageUploader.uploadComponent,imageUploader.modalComponent.options)

                uploadModal.componentInstance.inputData = {
                    app: imageUploader.modalComponent.path.slice(1)
                };

                uploadModal.componentInstance.width = width;
                uploadModal.componentInstance.height = height;
                uploadModal.componentInstance.freeCropMode = freeCropMode;
                uploadModal.componentInstance.allowVideo = false;
                uploadModal.componentInstance.allowCrop = true;
                uploadModal.componentInstance.scaleImage = true;

                uploadModal.result.then(function(data){
                    if (data != 'cancel'){
                        images[0].src = data && data.file ? data.file.url :'';
                    }
                },function(reason) {
                })
            })
        }
    }

    function getImageDimension(images,cb){
        var img = images[0];
        if(cb) cb({ w: img.clientWidth, h: img.clientHeight});
        // var url = window.URL.createObjectURL(images[0]);
        // var img = new Image;
        //
        // img.onload = function() {
        //     alert(img.width);
        //     cb({ w: img.width, h: img.height}, images);
        // };
        //
        // img.src = url;
    }

    function getWidth(el){
        return ($(el).css('width')).replace(/px/,'') * 1;
    }

    function getHTML(){

        $(this.settings.dropArea).find('.pbedit').each(function(idx,el){
            if( $(el).data('froala.editor')) {
                $(this).froalaEditor("destroy");
            }
        });

        var raw = $(this.settings.dropArea).clone();

        $(raw).find('[contenteditable]').removeAttr('contenteditable');

        raw = this.settings.onGetHTML(raw);

        var html = "";
        raw.children('.ui-draggable').each(function(idx,el){
            var ui = $(el);
            var css = {
                'display' : ui[0].style.display,
                'width'   : ui[0].style.width,
                'vertical-align' : ui[0].style.verticalAlign
            }

            var content = $(el).children().first();
            $(content).css(css);

            //responsive
            $(content).addClass($(content).data('responsiveHidden'));

            //linkbox
            $(content).find('.pb-linkbox-control-switch').remove();
            $(content).find('.pb-linked-image-control').remove();

            html += ($(el).children())[0].outerHTML;
        });




        return html;
    }

    function initFroala(el,options){

        $(el).on('froalaEditor.initialized', function(e, editor) {
            editor.events.on('drop', function (dropE) {
              // Prevent default behavior.
              return false;
            }, true)
        })
        .froalaEditor(options);
    }

    function destory(){
        $('#divCb').remove();
    }

    function isIE(){
        var browserInfo = navigator.userAgent;
        return browserInfo.indexOf('Trident') > 0 || navigator.userAgent.indexOf('MSIE') > 0;
    }

    function encodeHTML(html){
        return $('<div/>').text(html).html();
    }


    $.fn.PBFroala = function(options){
        return this.each(function(){
            if($(this).data('pb.froala') == undefined){
                var pbFroala = new PBFroala(this,options);
                $(this).data('pb.froala',pbFroala);
            }
        })
    }

    function _Linkbox(da){
        $(da).on('mouseenter','.link-boxes .link-box',function(e){
            e.preventDefault();
            e.stopPropagation();

            if($(this).find('.pb-linkbox-control').length > 0) return;
            $(this).prepend('<span class="pb-linkbox-control"><input type="checkbox" class="pb-linkbox-control-switch" ' + ( $(this).hasClass('active')? ' checked':'') + '></span>');
        });

        $(da).on('mouseleave','.link-boxes .link-box',function(e){
            e.preventDefault();
            e.stopPropagation();

            $(this).find('.pb-linkbox-control').remove();
        });

        $(da).on('click','.pb-linkbox-control-switch',function(e){
            e.stopPropagation();

            $(e.target).parents('.link-box').toggleClass('active');
        });

        $(da).on('mouseenter','.three-col-img-link .linked-image',function(e){
            e.preventDefault();
            e.stopPropagation();

            if($(this).find('.pb-linked-image-control').length > 0 ) return;
            $(this).prepend(
                '<span class="pb-linked-image-control">' +
                    '<input type="checkbox" class="pb-linked-image-control-switch" data-type="half" ' + ( $(this).attr('data-pboverlay') == 'half' ? ' checked':'') + '> Gradient&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<input type="checkbox" class="pb-linked-image-control-switch" data-type="full" ' + ( $(this).attr('data-pboverlay') == 'full' ? ' checked':'') + '> Overlay ' +
                '</span>');
        }).on('mouseleave','.three-col-img-link .linked-image',function(e){
            e.preventDefault();
            e.stopPropagation();

             $(this).find('.pb-linked-image-control').remove();
        }).on('click', '.three-col-img-link .linked-image .pb-linked-image-control-switch[data-type="half"]', function(e){
            e.stopPropagation();
            var parent = $(e.target).parents('.linked-image');

            if(parent.length == 0) return;

            if(parent.attr('data-pboverlay') && parent.attr('data-pboverlay') == 'half'){
                parent.removeAttr('data-pboverlay');
            }else{
                parent.attr('data-pboverlay', 'half');
            }
            $(this).siblings('.pb-linked-image-control-switch[data-type="full"]').prop('checked', false);

        }).on('click', '.three-col-img-link .linked-image .pb-linked-image-control-switch[data-type="full"]', function(e){
            e.stopPropagation();
            var parent = $(e.target).parents('.linked-image');

            if(parent.length == 0) return;

            if(parent.attr('data-pboverlay') && parent.attr('data-pboverlay') == 'full'){
                parent.removeAttr('data-pboverlay');
            }else{
                parent.attr('data-pboverlay', 'full');
            }
            $(this).siblings('.pb-linked-image-control-switch[data-type="half"]').prop('checked', false);
        })


    }

    function _ThemeBoardColor(da){
        $(da).on('click','.color-board-color',function(e){
            var originalBlock = $(e.currentTarget).closest('.ui-draggable').children().first();
            if(originalBlock.length !== 0){
                if($(originalBlock).is('[class*="theme-"]')){
                    $(originalBlock).removeClass (function (index, className) {
                        return (className.match (/(^|\s)theme-\S+/g) || []).join(' ');
                    });
                }

                $(originalBlock).addClass($(e.currentTarget).data('theme'));
                _t.compileExistingHTML();
            }
        })
    }

    function _Responsive(da){
        $(da).on('click','.responsive-icon-wrapper',function(e){
            e.preventDefault();
            e.stopPropagation();

            var el = $(e.currentTarget),
                originalBlock = $(e.currentTarget).closest('.ui-draggable').children().first();

            $(el).toggleClass('active');

            var board = $(el).parents('.responsive-board');

            var desktop = board.find('.responsive-icon-wrapper-desktop'),
                tablet = board.find('.responsive-icon-wrapper-tablet'),
                mobile = board.find('.responsive-icon-wrapper-mobile');

            var hiddenList = (desktop.length !== 0 ? $(desktop).hasClass('active') ? "" : "hidden-md hidden-md-up" : "") +
                // (tablet.length !== 0  ? $(tablet).hasClass('active') ?  "" : " hidden-sm hidden-sm-down" : "") +    // space is important
                (mobile.length !== 0  ? $(mobile).hasClass('active') ? "" : " hidden-sm hidden-sm-down" : "");

            if(originalBlock.length !== 0){
                if(!!hiddenList){
                    $(originalBlock).attr('data-responsive-hidden','');
                    $(originalBlock).attr('data-responsive-hidden',hiddenList.trim());
                }else{
                    $(originalBlock).removeAttr('data-responsive-hidden');
                }
            }
        })
    }

});

var zindex = 10000;
(function (jQuery) {

    jQuery.simplemodal = function (element, options) {

        var defaults = {
            onCancel: function () { }
        };

        this.settings = {};

        var $element = jQuery(element),
            element = element;

        var $ovlid;

        this.init = function () {

            this.settings = jQuery.extend({}, defaults, options);

            //var html_overlay = '<div class="md-overlay"></div>';
            //if (jQuery('.md-overlay').length == 0) jQuery('body').append(html_overlay);

            /**** Localize All ****/
            if (jQuery('#divCb').length == 0) {
                jQuery('body').append('<div id="divCb"></div>');
            }

        };

        this.hide = function () {
            $element.css('display', 'none');
            $element.removeClass('md-show');
            $ovlid.remove();//

            zindex = zindex-2;
        };

        this.show = function () {

            zindex = zindex+1;

            var rnd = makeid();
            var html_overlay = '<div id="md-overlay-' + rnd + '" class="md-overlay" style="z-index:' + zindex + '"></div>';
            jQuery('#divCb').append(html_overlay);
            $ovlid = jQuery('#md-overlay-' + rnd);

            /*setTimeout(function () {
             $element.addClass('md-show');
             }, 1);*/

            zindex = zindex+1;
            $element.css('z-index',zindex);

            $element.addClass('md-show');
            $element.stop(true, true).css('display', 'none').fadeIn(200);

            if($element.hasClass('md-draggable')){
                var mw = parseInt($element.css("width"));
                var mh = parseInt($element.css("height"));
                $element.css("top", Math.max(0, (jQuery(window).height() - mh) / 2) +  "px");
                $element.css("left", Math.max(0, (jQuery(window).width() - mw) / 2) + "px");

                if($element.find('.md-modal-handle').length > 0){
                    $element.find('.md-modal-handle').css("cursor", "move");
                    $element.draggable({ handle: ".md-modal-handle" });
                } else {
                    $element.draggable();
                }
            }

            jQuery('#md-overlay-' + rnd).unbind();
            jQuery('#md-overlay-' + rnd).click(function () {

                $element.stop(true, true).fadeOut(100, function(){
                    $element.removeClass('md-show');
                });
                $ovlid.remove();//

                zindex = zindex-2;

                $element.data('simplemodal').settings.onCancel();
            });

        };

        this.init();
    };

    jQuery.fn.simplemodal = function (options) {

        return this.each(function () {

            if (undefined == jQuery(this).data('simplemodal')) {
                var plugin = new jQuery.simplemodal(this, options);
                jQuery(this).data('simplemodal', plugin);

            }

        });
    };
})(jQuery);

/* Utils */
function makeid() {//http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


/*! rangeslider.js - v1.2.1 | (c) 2015 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
!function (a) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery) } (function (a) { "use strict"; function b() { var a = document.createElement("input"); return a.setAttribute("type", "range"), "text" !== a.type } function c(a, b) { var c = Array.prototype.slice.call(arguments, 2); return setTimeout(function () { return a.apply(null, c) }, b) } function d(a, b) { return b = b || 100, function () { if (!a.debouncing) { var c = Array.prototype.slice.apply(arguments); a.lastReturnVal = a.apply(window, c), a.debouncing = !0 } return clearTimeout(a.debounceTimeout), a.debounceTimeout = setTimeout(function () { a.debouncing = !1 }, b), a.lastReturnVal } } function e(a) { return a && (0 === a.offsetWidth || 0 === a.offsetHeight || a.open === !1) } function f(a) { for (var b = [], c = a.parentNode; e(c); ) b.push(c), c = c.parentNode; return b } function g(a, b) { function c(a) { "undefined" != typeof a.open && (a.open = a.open ? !1 : !0) } var d = f(a), e = d.length, g = [], h = a[b]; if (e) { for (var i = 0; e > i; i++) g[i] = d[i].style.cssText, d[i].style.display = "block", d[i].style.height = "0", d[i].style.overflow = "hidden", d[i].style.visibility = "hidden", c(d[i]); h = a[b]; for (var j = 0; e > j; j++) d[j].style.cssText = g[j], c(d[j]) } return h } function h(b, e) { if (this.$window = a(window), this.$document = a(document), this.$element = a(b), this.options = a.extend({}, l, e), this.polyfill = this.options.polyfill, this.onInit = this.options.onInit, this.onSlide = this.options.onSlide, this.onSlideEnd = this.options.onSlideEnd, this.polyfill && k) return !1; this.identifier = "js-" + i + "-" + j++, this.startEvent = this.options.startEvent.join("." + this.identifier + " ") + "." + this.identifier, this.moveEvent = this.options.moveEvent.join("." + this.identifier + " ") + "." + this.identifier, this.endEvent = this.options.endEvent.join("." + this.identifier + " ") + "." + this.identifier, this.toFixed = (this.step + "").replace(".", "").length - 1, this.$fill = a('<div class="' + this.options.fillClass + '" />'), this.$handle = a('<div class="' + this.options.handleClass + '" />'), this.$range = a('<div class="' + this.options.rangeClass + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle), this.$element.css({ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: "0" }), this.handleDown = a.proxy(this.handleDown, this), this.handleMove = a.proxy(this.handleMove, this), this.handleEnd = a.proxy(this.handleEnd, this), this.init(); var f = this; this.$window.on("resize." + this.identifier, d(function () { c(function () { f.update() }, 300) }, 20)), this.$document.on(this.startEvent, "#" + this.identifier + ":not(." + this.options.disabledClass + ")", this.handleDown), this.$element.on("change." + this.identifier, function (a, b) { if (!b || b.origin !== f.identifier) { var c = a.target.value, d = f.getPositionFromValue(c); f.setPosition(d) } }) } var i = "rangeslider", j = 0, k = b(), l = { polyfill: !0, rangeClass: "rangeslider", disabledClass: "rangeslider--disabled", fillClass: "rangeslider__fill", handleClass: "rangeslider__handle", startEvent: ["mousedown", "touchstart", "pointerdown"], moveEvent: ["mousemove", "touchmove", "pointermove"], endEvent: ["mouseup", "touchend", "pointerup"] }; h.prototype.init = function () { this.update(!0), this.$element[0].value = this.value, this.onInit && "function" == typeof this.onInit && this.onInit() }, h.prototype.update = function (a) { a = a || !1, a && (this.min = parseFloat(this.$element[0].getAttribute("min") || 0), this.max = parseFloat(this.$element[0].getAttribute("max") || 100), this.value = parseFloat(this.$element[0].value || this.min + (this.max - this.min) / 2), this.step = parseFloat(this.$element[0].getAttribute("step") || 1)), this.handleWidth = g(this.$handle[0], "offsetWidth"), this.rangeWidth = g(this.$range[0], "offsetWidth"), this.maxHandleX = this.rangeWidth - this.handleWidth, this.grabX = this.handleWidth / 2, this.position = this.getPositionFromValue(this.value), this.$element[0].disabled ? this.$range.addClass(this.options.disabledClass) : this.$range.removeClass(this.options.disabledClass), this.setPosition(this.position) }, h.prototype.handleDown = function (a) { if (a.preventDefault(), this.$document.on(this.moveEvent, this.handleMove), this.$document.on(this.endEvent, this.handleEnd), !((" " + a.target.className + " ").replace(/[\n\t]/g, " ").indexOf(this.options.handleClass) > -1)) { var b = this.getRelativePosition(a), c = this.$range[0].getBoundingClientRect().left, d = this.getPositionFromNode(this.$handle[0]) - c; this.setPosition(b - this.grabX), b >= d && b < d + this.handleWidth && (this.grabX = b - d) } }, h.prototype.handleMove = function (a) { a.preventDefault(); var b = this.getRelativePosition(a); this.setPosition(b - this.grabX) }, h.prototype.handleEnd = function (a) { a.preventDefault(), this.$document.off(this.moveEvent, this.handleMove), this.$document.off(this.endEvent, this.handleEnd), this.$element.trigger("change", { origin: this.identifier }), this.onSlideEnd && "function" == typeof this.onSlideEnd && this.onSlideEnd(this.position, this.value) }, h.prototype.cap = function (a, b, c) { return b > a ? b : a > c ? c : a }, h.prototype.setPosition = function (a) { var b, c; b = this.getValueFromPosition(this.cap(a, 0, this.maxHandleX)), c = this.getPositionFromValue(b), this.$fill[0].style.width = c + this.grabX + "px", this.$handle[0].style.left = c + "px", this.setValue(b), this.position = c, this.value = b, this.onSlide && "function" == typeof this.onSlide && this.onSlide(c, b) }, h.prototype.getPositionFromNode = function (a) { for (var b = 0; null !== a; ) b += a.offsetLeft, a = a.offsetParent; return b }, h.prototype.getRelativePosition = function (a) { var b = this.$range[0].getBoundingClientRect().left, c = 0; return "undefined" != typeof a.pageX ? c = a.pageX : "undefined" != typeof a.originalEvent.clientX ? c = a.originalEvent.clientX : a.originalEvent.touches && a.originalEvent.touches[0] && "undefined" != typeof a.originalEvent.touches[0].clientX ? c = a.originalEvent.touches[0].clientX : a.currentPoint && "undefined" != typeof a.currentPoint.x && (c = a.currentPoint.x), c - b }, h.prototype.getPositionFromValue = function (a) { var b, c; return b = (a - this.min) / (this.max - this.min), c = b * this.maxHandleX }, h.prototype.getValueFromPosition = function (a) { var b, c; return b = a / (this.maxHandleX || 1), c = this.step * Math.round(b * (this.max - this.min) / this.step) + this.min, Number(c.toFixed(this.toFixed)) }, h.prototype.setValue = function (a) { a !== this.value && this.$element.val(a).trigger("input", { origin: this.identifier }) }, h.prototype.destroy = function () { this.$document.off("." + this.identifier), this.$window.off("." + this.identifier), this.$element.off("." + this.identifier).removeAttr("style").removeData("plugin_" + i), this.$range && this.$range.length && this.$range[0].parentNode.removeChild(this.$range[0]) }, a.fn[i] = function (b) { var c = Array.prototype.slice.call(arguments, 1); return this.each(function () { var d = a(this), e = d.data("plugin_" + i); e || d.data("plugin_" + i, e = new h(this, b)), "string" == typeof b && e[b].apply(e, c) }) } });

/*! jQuery UI Touch Punch 0.2.3 | Copyright 2011–2014, Dave Furfero | Dual licensed under the MIT or GPL Version 2 licenses. */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(7(4){4.w.8=\'H\'G p;c(!4.w.8){f}d 6=4.U.D.L,g=6.g,h=6.h,a;7 5(2,r){c(2.k.F.J>1){f}2.B();d 8=2.k.q[0],l=p.N(\'O\');l.S(r,i,i,V,1,8.W,8.X,8.Y,8.A,b,b,b,b,0,C);2.z.E(l)}6.m=7(2){d 3=e;c(a||!3.I(2.k.q[0])){f}a=i;3.j=b;5(2,\'K\');5(2,\'s\');5(2,\'M\')};6.n=7(2){c(!a){f}e.j=i;5(2,\'s\')};6.o=7(2){c(!a){f}5(2,\'P\');5(2,\'Q\');c(!e.j){5(2,\'R\')}a=b};6.g=7(){d 3=e;3.u.T({v:4.9(3,\'m\'),x:4.9(3,\'n\'),y:4.9(3,\'o\')});g.t(3)};6.h=7(){d 3=e;3.u.Z({v:4.9(3,\'m\'),x:4.9(3,\'n\'),y:4.9(3,\'o\')});h.t(3)}})(4);',62,62,'||event|self|jQuery|simulateMouseEvent|mouseProto|function|touch|proxy|touchHandled|false|if|var|this|return|_mouseInit|_mouseDestroy|true|_touchMoved|originalEvent|simulatedEvent|_touchStart|_touchMove|_touchEnd|document|changedTouches|simulatedType|mousemove|call|element|touchstart|support|touchmove|touchend|target|clientY|preventDefault|null|mouse|dispatchEvent|touches|in|ontouchend|_mouseCapture|length|mouseover|prototype|mousedown|createEvent|MouseEvents|mouseup|mouseout|click|initMouseEvent|bind|ui|window|screenX|screenY|clientX|unbind'.split('|'),0,{}));
