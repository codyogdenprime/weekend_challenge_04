console.log( "01_show_image.js sourced" );


var showIfImage = function( content, that ) {

	var input = $( that );

	console.log( "Input id", input.data( ) );

	var img = new Image();
	img.onload = function() {
		var li = $("<li />");
	};
	img.onerror = function() {

		console.log( "Is not image" );

	};
	img.src = content;

};