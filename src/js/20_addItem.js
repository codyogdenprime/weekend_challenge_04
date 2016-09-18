var addItem = function() {

	console.log( "Add Item:", $( this ) );

	var input = $( this );

	console.log( "List ID:", $( this ).data( 'id' ) );

	var listId = input.data( 'id' );

	console.log( 'URL', '/list/' + listId + '/items' );

	$.ajax({
		url: '/list/' + listId + '/items',
		type: 'POST',
		dataType: 'json',
		data: { content: $( this ).val() },
		success: function ( data ) {

			console.log( 'Added Item!', data );

			var imgurl = input.val();

			input.val( '' );

			$('#' + listId).append( genItem( data ) );

			//refreshList( listId );
			
			imageExists( imgurl, function( isImage ) {

				var img = $('<img />', { class: 'preview-image' }).attr( 'src', imgurl );

				img.insertAfter( '#' + data[0].id );

			});

		}
	});
	

};