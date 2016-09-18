var editItem = function() {

	console.log( 'edit item', $( this ).closest( '.list' ).data('id') );

	var input = $( this );

	$( this ).addClass( 'in-focus' );

	var itemId = $( this ).data( 'id' );

	console.log( "Item ID:", itemId );

	var listId = $( this ).closest( '.list' ).data('id');

	var ajUrl = String( '/list/' + listId + '/items' );

	console.log( "url", ajUrl );

	$.ajax({
		url: ajUrl,
		type: 'PUT',
		dataType: 'json',
		data: {
			id: input.data( 'id' ),
			content: input.val()
		},
		success: function( data ) {

			console.log( "Edited item!", data );

			input.blur();

			input.trigger( 'mouseleave' );

			$(window).trigger('click');

		}
	});
	

};