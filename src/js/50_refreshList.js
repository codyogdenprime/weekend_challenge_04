console.log( "50_refreshList.js sourced" );

// Refreshes a given list by GET request of just that list.

var refreshList = function( id ) {

	console.log( "Reload list sdf sdf", id );

	var ajUrl = '/list/' + id;

	var listUl = $('#' + id );

	$.ajax({
		url: ajUrl,
		type: 'GET',
		dataType: 'json',
		success: function( data ) {

			console.log( 'Data received:', data );

			var items = data[0].items;

			listUl.empty();

			console.log( 'Data received:', data );

			listUl.append( genItem( items ) );

			findImages();

		}
	});
	
	
};