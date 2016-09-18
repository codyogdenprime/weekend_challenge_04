var refreshList = function( id ) {

	console.log( "Reload list", id );

	var ajUrl = '/list/' + id;

	var listUl = $('#' + id );

	$.ajax({
		url: ajUrl,
		type: 'GET',
		dataType: 'json',
		success: function( data ) {

			var items = data[0].items;

			listUl.empty();

			listUl.append( genItem( items ) );

		}
	});
	
	
};