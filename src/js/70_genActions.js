console.log( "70_genActions.js sourced" );

// This dymanically creates and appends the three buttons Complete, Archive and Trash
// whenever an item input is double clicked

var genActions = function() {

	console.log( 'Generate action buttons', $( this ) );

	var input = $( this );

	input.removeAttr( 'disabled' );

	input.blur().focus();

	input.val( input.val() );

	$('.item-buttons').empty();

	var div = $('<div />', { class: 'item-buttons' });

	var done = $('<button />', { class: 'done-button' }).html( 'Complete' );

		done.on( 'click', completeItem );

		done.data( input.data() );

	//var archive = $('<button />', { class: 'archive-button' }).html('Archive');

		//archive.on( 'click', archiveItem );

		//archive.data( input.data() );

	var trash = $('<button />', { class: 'trash-button' }).html('Trash');

		trash.on( 'click', trashItem );
		
		trash.data( input.data() );

	if( input.closest( 'li' ).hasClass( 'item-complete' ) ) {

		input.closest( 'li' ).removeClass( 'item-complete' );

		done.html('To List');

		input.on( 'blur', function() {

			$( this ).closest( 'li' ).addClass( 'item-complete' );
			
		} );

	}

	div.append( [ done, trash ] );

	div.insertAfter( input );

	input.on( 'mouseleave', function() {

		$(window).on( 'click', function() {

			input.attr( 'disabled', 'true' );

			div.detach();

		} );

		input.parent().on( 'click', function( event ) {

			event.stopPropagation();

		} );

	});

};