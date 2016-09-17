'use strict';
// File Path
const filepath = require('path');

// Config Module
const config = require( filepath.resolve('config') );
const port = config.get('port');

// Express Setup
const express = require('express');
const app = express();

// bodyParser Setup
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For kicks and giggles and good practice of not exposing sensitive data
// let's hash all the numerical IDs going to the client
// and decode them when they come back as parameters later
const mask = require( filepath.resolve( 'lib/mask_id' ) );
const hashitem = mask.item;
const hashlist = mask.list;

// PostgreSQL Setup
const pg_config = {
	host: 'localhost',
	database: 'checklist'
};
const Pool = require('pg').Pool;
const pool = new Pool( pg_config );

// App Listener
app.listen( port, () => {
	console.log( "App listening on port:", port );
});

app.use( ( req, res, next ) => {
	req.hashids = {};
	next();
});

/* -- API Routing -- */
const listRoute = express.Router();
const itemRoute = express.Router({ mergeParams: true });

// Make specific item routes in the main /list route
listRoute.use('/:listid/item', itemRoute );

// Set the main route for /list
app.use( '/list', listRoute );

// Middleware: Decode the hashed list ID
listRoute.param( 'listid', ( req, res, next, id ) => {
	req.hashids.listId = Number( hashlist.decode( id ) );
	next();
});

// Middleware: Decode the hashed item ID
itemRoute.param( 'itemid', ( req, res, next, id ) => {
	req.hashids.itemId = Number( hashitem.decode( id ) );
	next();
});

// /list Route
listRoute.route('/')
.get( ( req, res ) => {

	// See queries.sql for a pretified and commented version of this query
	pool.query( "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT json_agg( json_build_object( 'id', my_items.id,'content', my_items.content, 'status', my_items.status, 'pinned', my_items.pinned, 'active', my_items.active ) ) FROM my_items WHERE my_items.list_id=my_lists.id))) FROM my_lists;", ( err, result ) => {
		
		for( let i = 0; i < result.rows[0].json_agg.length; i++ ) {

			// Set a variable for each row
			var row = result.rows[0].json_agg[i];

			// If the row has items
			if( row.items !== null ) {

				// For every item
				for( let j = 0; j < row.items.length; j++ ) {

					// Hash the item's ID
					row.items[j].id = hashitem.encode( row.items[j].id );
				}

			}

			// Hash the row's ID
			row.id = hashlist.encode( row.id );
		}

		// Bypass the messy stuff
		// Send the JSON flying
		res.json( result.rows[0].json_agg );

	} );

} )
.post( ( req, res ) => {

	console.log("POST /list");

	// Only receiving a list's name when we create it. `id` and `active` columns are set DEFAULT
	pool.query( 'INSERT INTO list ( name ) VALUES ($1) RETURNING id, name', [ req.body.name ], ( err, result ) => {
		if ( err ) return res.status(500).send( 'Uh. Nope.' );
		// Redirect to a GET request if successful which provides client
		// with a refreshed version of the JSON.
		res.redirect('/list');
	} );

} );

// /list/:listid Route
listRoute.route('/:listid')
.get( ( req, res ) => {

	console.log( "GET /list/" + req.hashids.listId );

	// Similar Query as the one above
	// This one selects just ONE list based on the id parameter
	pool.query( "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT json_agg( json_build_object( 'id', item.id,'content', item.content, 'status', item.status, 'pinned', item.pinned, 'active', item.active ) ) FROM item WHERE list_id=my_lists.id))) FROM my_lists WHERE id=$1", [ req.hashids.listId ], ( err, result ) => {
		if ( err ) return res.status(404).send();

		// Make this easier to reference.
		var rows = result.rows[0].json_agg;

		// For every list returnted ( should only be one, but who knows! )
		for( let i = 0; i < rows.length; i++ ) {

			// Hash the list's ID
			rows[i].id = hashlist.encode( rows[i].id );

			// For ever item in the list
			for( let j = 0; j < rows[i].items.length; j++ ) {

				// Hash the item's ID
				rows[i].items[j].id = hashlist.encode( rows[i].items[j].id );
			}

		}
		// Launch the JSON
		res.json( rows );
	} );

} )
.put( ( req, res ) => {

	console.log( "PUT /list/" + req.hashids.listId );

	// The only things available to update are `name` and `active`
	pool.query("UPDATE list SET name=$1, active=$2 WHERE id=$3 RETURNING id, name, active", [ req.body.name, req.body.active, req.hashids.listId ], ( err, result ) => {

		// Redirect to a GET /list to get a refreshed version of the JSON
		res.redirect( '/list' );

	} );

} )
.delete( ( req, res ) => {

	console.log( "DELETE /list/" + req.hashids.listId );

	// We do not DELETE stuff. We make it inactive.
	pool.query("UPDATE list SET active=false WHERE id=$1 RETURNING id, active", [ req.hashids.listId ], ( err, result ) => {

		// Redirect to a GET /list to get a refreshed version of the JSON
		res.redirect( '/list' );

	} );

} );

itemRoute.route('/')
.post( ( req, res ) => {

	console.log( "POST /item/" + req.hashids.listId + "/item" );
	pool.query( 'INSERT INTO item ( content, list_id ) VALUES ( $1, $2 ) RETURNING *;', [ req.body.content, req.hashids.listId ], ( err, result ) => {
		if ( err ) return res.status(500).send( 'Error: Could not SELECT * FROM list' );
		result.rows[0].id = hashitem.encode( result.rows[0].id );
		res.json( result.rows );
	} );

} );

itemRoute.route('/:itemid')
.put( ( req, res ) => {

	console.log( "PUT /list/" + req.hashids.listId + "/item/" + req.hashids.itemId );

	console.log( req.body );

	var query = "";

	var values = [ req.hashids.itemId ];

	var count = 1;

	for( var key in req.body ) {
		count++;
		query += key + "=$" + count + " ";
		values.push( req.body[key] )
	}
	console.log( "Values:", values );

	console.log( "query", query );

	// We do not DELETE stuff. We make it inactive.
	pool.query("UPDATE item SET " + query + " WHERE id=$1 RETURNING id, active", values, ( err, result ) => {
		console.log( "Result:", err );
		// Redirect to a GET /list to get a refreshed version of the JSON
		res.redirect( '/list' );

	} );

} )
.delete( ( req, res ) => {

	console.log( "DELETE /list/" + req.hashids.listId + "/item/" + req.hashids.itemId );

	// We do not DELETE stuff. We make it inactive.
	pool.query("UPDATE item SET active=false WHERE id=$1 RETURNING id, active", [ req.hashids.itemId ], ( err, result ) => {

	// Redirect to a GET /list to get a refreshed version of the JSON
	res.redirect( '/list' );

	} );

} );