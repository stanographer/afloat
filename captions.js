// Dynamically changes the color scheme of the caption box.
function stylePad (data) {
	var googleFontsLink = '<link href="https://fonts.googleapis.com/css?family=' + data.fontStyle.id + '" rel="stylesheet">';

	console.log('foreground: ' + data.fontColor + ' and ' + 'background: ' + data.bgColor + ' and fontSize: ' + data.fontSize + ' and fontstyle: ' + data.fontStyle.name + data.fontStyle.id + ' line height: ' + data.lineHeight);
	
	$('#captionArea').css("font-size", data.fontSize + 'px');
	$('#captionArea').css("font-family", '\'' + data.fontStyle.name + '\', sans-serif');
	$('#captionArea').css("line-height", data.lineHeight + '%');

	// Dynamically imports the Google font required.
	$('head').append(googleFontsLink);

	var style = document.createElement('style');
		style.appendChild(document.createTextNode('.captionText { background-color: #' + data.bgColor + '; color: #' + data.fontColor + '}'));
		if (!data.transparency) {
			style.appendChild(document.createTextNode('body { background-color: #' + data.bgColor + ';'));
		}

		document.head.appendChild(style);
	}

var pad = document.getElementById('pad');
var captionArea = document.getElementById('captionArea');
var previousText;

var paintCaptions = function () {
	var text = pad.value.replace(/\n\s*\n/g, '<br />').replace(/\n\r?/g, '<br />');
	previousText = text;

	var htmlified = '<span class="captionText" id="captionText">' + text + '</span>';
	captionArea.innerHTML = htmlified;
}

var detectChange = function () {
	if (previousText != pad.value) {
		return true;
	}
	return false;
}


$(document).ready(function () {
	captionArea.innerHTML = '<span class="captionText" id="captionText">MS. SPEAKER: These are test captions for positioning purposes.<br />Bacon ipsum dolor amet pastrami corned.<br />Beef tenderloin tail picanha fatback t-bone hamburger cupim flank cow swine.</span>'
});

setInterval(function () {
	if (detectChange()) {
		paintCaptions();
	}
}, 100);

// Autoscroll functionality.
var scrollLoopId;

var autoScroll = function () {
	$(document).scrollTop($(document).height());
	console.log('scrolling has started again!')
}
var startScroll = function () {
	scrollLoopId = setInterval(autoScroll, 400);
}
var stopScroll = function () {
	clearInterval(scrollLoopId);
	console.log('scrolling has stopped!');
}


var idleTimer = null;
var idleState = false;
var idleWait = 2000;

(function ($) {

    $(document).ready(function () {
        $('*').bind('mousemove keydown scroll', function () {
            clearTimeout(idleTimer);
                
            if (idleState == true) { 
                // Reactivated event
                stopScroll();
            }
            idleState = false;
            idleTimer = setTimeout(function () { 
                // Idle Event
                startScroll(); 
                idleState = true; }, idleWait);
        });
        $("body").trigger("scroll");
    
    });
}) (jQuery)

// Copies caption text into the div.
pad.addEventListener('input', paintCaptions());