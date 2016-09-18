var addItem = function() {

	console.log( "Add Item:", $( this ) );

	var input = $( this );

	console.log( "List ID:", $( this ).data( 'id' ) );

	var listId = input.data( 'id' );

	console.log( 'URL', '/list/' + listId + '/items' );

	$.ajax({
		url: '/list/' + listId + '/items',
		type: 'POST',
		dataType: 'json',
		data: { content: $( this ).val() },
		success: function ( data ) {

			console.log( 'Added Item!', data );

			input.val( '' );

			$('#' + listId).append( genItem( data ) );

			refreshList( listId );

		}
	});
	

};