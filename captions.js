// Dynamically changes the color scheme of the caption box.
function stylePad (fg, bg) {
	console.log(fg + bg);
	var textBox = document.getElementById('pad');
	$('#pad').css("color", fg);
	$('body').css("color", fg);
	$('body').css("background-color", bg);

}