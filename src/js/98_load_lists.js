console.log( "98_load_lists.js sourced" );

// Well...it loads all the lists from the database and puts them on the DOM

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