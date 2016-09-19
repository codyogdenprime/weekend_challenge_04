console.log( "11_editlist.js sourced" );

// Handles the PUT for editing the list title.

var editList = function() {

	console.log( "This data:", $( this ).data() );

	$( this ).blur();

	var listId = $( this ).data('id');

	var ajUrl = String( '/list/' + listId ); // The listId is passed as a parameter

	$.ajax({
		url: ajUrl,
		type: 'PUT',
		dataType: 'json',
		data: { name: $( this ).val() },
		success: function( data ) {

			console.log( "Edited list!", data );

		}
	});
	

};