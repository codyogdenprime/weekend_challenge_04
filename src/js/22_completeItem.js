console.log( "22_completeItem.js" );

// Request handler that toggles true/false whether an item is completed

var completeItem = function() {

	console.log( "Complete item" );

	var listId = $( this ).closest( '.list' ).data( 'id' );

	console.log( listId );

	var data = $( this ).data();

	console.log( data );

	var ajUrl = '/list/' + listId + '/items/complete';

	if( $( this ).data('complete') ) {

		method = 'DELETE';

	} else {
		method = 'PUT';
	}

	console.log( 'ajUrl', ajUrl );
	console.log( 'data.id', data.id );

	$.ajax({
		url: ajUrl,
		type: method,
		dataType: 'json',
		data: { id: data.id },
		success: function() {

			console.log( 'Completed item!' );

			refreshList( listId );

		}
	});
	
	
};