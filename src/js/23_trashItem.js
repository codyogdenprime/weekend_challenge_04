var trashItem = function() {

	console.log( "Trash item" );

	var listId = $( this ).closest( '.list' ).data( 'id' );

	var data = $( this ).data();

	var ajUrl = '/list/' + data + '/items/trash';

	$.ajax({
		url: ajUrl,
		type: 'PUT',
		dataType: 'json',
		data: { id: data.id },
		success: function() {

			console.log( 'Moved item to trash!' );

			refreshList( listId );

		}
	});
	
	
};