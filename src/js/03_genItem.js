console.log( "03_genItem.js sourced" );

// Creates a jQuery element for each item

// Returns those elements in an array

var genItem = function( items ) {

	var itemsArr = [];

	if( items ) {

		for( var j = 0; j < items.length; j++ ) {

			var item = items[j];

			var li = $('<li />');

			console.log( 'item status', item.status );

			switch( item.status ) {



			}

			if( item.complete ) {

				li.addClass( 'item-complete' );

			}

			var liInput = $('<input />', { class: 'item-input', data: item, id: item.id } ).attr( 'type', 'text' ).val( item.content ).attr( 'disabled', 'true' );

			li.append( liInput );

			itemsArr.push( li );

		}
	}

	return itemsArr;

};