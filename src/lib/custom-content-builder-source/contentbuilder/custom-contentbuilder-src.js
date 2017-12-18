/**
 * Created by ravjayaraman on 4/18/16.
 * This file contains all custom fix for pagebuilder contentbuilder-src.js
 */
//START : This script added if user pasting it in the pagebuilder content builder.
var setHubImage=true;
// $(document).on('paste','[contenteditable]',function(e) {
//     //IE doesn't support getting the clipboard data
//     if(GetIEVersion() === 0){
//         e.preventDefault();
//         var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
//         window.document.execCommand('insertText', false, text);
//     }

// });
//END : This script added if user pasting it in the pagebuilder content builder.

//To Check the browser version
function GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");

    // If IE, return version number.
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        return 11;

    else
        return 0; //It is not IE
}

function setImageInCanvas(context,tmpCanvas, sourceX, sourceY, dw, dh){
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        context.drawImage(tmpCanvas, sourceX, sourceY, dw, dh);
    }else if(GetIEVersion > 0){
        context.drawImage(tmpCanvas, sourceX, sourceY);
    }
    else{
        try{
            context.drawImage(tmpCanvas, sourceX, sourceY, dw, dh, 0, 0, dw, dh);
        }catch(e){
            context.drawImage(tmpCanvas, sourceX, sourceY);
        }
    }
}
