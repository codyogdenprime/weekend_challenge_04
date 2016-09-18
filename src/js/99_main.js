console.log( "99_main.js sourced" );

$(document).ready( function() {

	loadLists();

	$('body').on( 'change', '.new-item-input', addItem );

	$('body').on( 'change', '.item-input', editItem );

	$('body').on( 'dblclick', '.item-input', genActions );

	$('body').on( 'change', '.list-title-input', editList );

	$( '.input-new-list' ).on( 'enterKey', addList );

	$( '.input-new-list' ).on( 'keyup', function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});

});