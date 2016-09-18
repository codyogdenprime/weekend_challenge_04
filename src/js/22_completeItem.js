var completeItem = function() {

	console.log( "Complete item" );

	var listId = $( this ).closest( '.list' ).data( 'id' );

	console.log( listId );

	var data = $( this ).data();

	console.log( data.id );

	var ajUrl = '/list/' + listId + '/items/complete';

	$.ajax({
		url: ajUrl,
		type: 'PUT',
		dataType: 'json',
		data: { id: data.id },
		success: function() {

			console.log( 'Completed item!' );

			refreshList( listId );

		}
	});
	
	
};