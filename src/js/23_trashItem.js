console.log( "23_trashItem.js" );

// PUT handler that marks an item as status=3 ( trashed )

var trashItem = function() {

	console.log( "Trash item" );

	var confirm = window.confirm("Are you sure you'd like to delete that?");

	if( !confirm )
		return false;

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