console.log( "01_add_item.js sourced" );

// POST /list to add a list to the Database

var addList = function() {

	var listName = $('.input-new-list');

	if( listName.val() === '' )
		return false;

	$.ajax({
		url: '/list',
		type: 'POST',
		dataType: 'json',
		data: {
			name: listName.val()
		},
		success: function( result ) {
 			console.log( 'List Added', result );
 			listName.val( '' );
 			listName.blur();
 			genList( result );

		}
	});

};