console.log( "00_image_exists.js sourced" );

// The "callback" argument is called with either true or false
// depending on whether the image at "url" exists or not.
function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}

// This finds any inputs in any list and checks to see if is a URL and if you can make an image

// And if you can it loads it on the DOM

// This was hacked together at the last minute and may be a bit buggy.

var findImages = function() {

	console.log( 'find images' );

	// For every list

	$( '.list').each( function() {

		console.log( 'list' );

		// Find all the `li`s in the `ul`s

		$( this ).find('ul > li').each( function() {

			// Set up some variables

			var input = $( this ).find( 'input' );

			var inputId = $( this ).find( 'input' ).data( 'id' );

			var content = $( this ).find( 'input' ).data('content');

			// Check to see if the image will load

			imageExists( content, function( testing ) {

				console.log( testing );

				// If it returns true and there isn't an image as a sibling of the input already AND the parent isn't marked complete

				if( testing && input.siblings( 'img' ).length === 0 && !( input.parent().hasClass( 'item-complete' ) ) ) {

					// Create the image element in jQuery

					var img = $('<img />', {class:'preview-image'}).attr( 'src', content );

					// Insert the image on the DOM ( it is already loaded in the background )

					img.insertAfter( input );
				}

			});

		});

	});

};