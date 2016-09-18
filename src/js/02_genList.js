console.log( "02_genList.js sourced" );

/*


HTML Output:

<div class="list">

	<div class="list-title">
		
		<input type="text" value=" LIST NAME VALUE " />

	</div>

	<ul>
		FOR EVERY LIST ITEM
		<li><input class="item-input" type="text" value=" ITEM VALUE " /></li>
		END FOR LOOP
	</ul>

	<div class="list-new-item">
		
		<input type="text" placeholder="Add an item..." />

	</div>

</div>

*/


var genList = function ( data ) {

	var lists = $();

	for( var i = 0; i < data.length; i++ ) {

		var listDiv = $( '<div />', { class: 'list', data: data[i]});

		var listTitle = $( '<div />', { class: 'list-title' });

		var listTitleInput = $( '<input />', { class:'list-title-input', data: data[i] }).attr( 'type', 'text' ).val( data[i].name );

		var listMenu = $( '<button />', { class: 'list-menu' } ).html( '...' );

		var ul = $('<ul />').attr( 'id', data[i].id );

		var items = genItem( data[i].items );

		var itemDiv = $( '<div />', { class: 'list-new-item' });

		var newItemInput = $( '<input />', { class: 'new-item-input', data: data[i] }).attr( 'placeholder', 'Add new item...' );

		listTitle.append( [ listTitleInput, listMenu ] );

		listDiv.append( listTitle );

		ul.append( items );

		listDiv.append( ul );

		itemDiv.append( newItemInput );

		listDiv.append( itemDiv );

		lists = lists.add( listDiv );

	}

	lists.insertBefore( '.add-list' );

};