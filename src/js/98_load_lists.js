console.log( "98_load_lists.js sourced" );

var loadLists = function() {

	$.ajax({
		url: '/list',
		type: 'GET',
		dataType: 'json',
		success: function( data ) {

			console.log( "genList data:", data );

			var lists = genList( data );

		}
	});
	

};