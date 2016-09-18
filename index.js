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


// Bespoke Module for handling errors ( especially API errors )
const tossErr = require( './lib/errors' );

// For kicks and giggles and good practice of not exposing sensitive data
// let's hash all the numerical IDs going to the client
// and decode them when they come back as parameters later
const Hashids = require( 'hashids' );
const listhash = new Hashids( 'list', 12 );
const itemhash = new Hashids( 'item', 24 );

// Bespoke module for multi-level hashing `id` fields in objects ( inquire inside for details )
const hashit = require( './lib/hash_it' );

// Middleware ensures hashed `id`s can be saved in the `req` object
app.use( ( req, res, next ) => {
	req.hashids = {};
	next();
});

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

// Our Routes
var list = express.Router();
var items = express.Router();

// List needs to be able to see items
list.use(['/:id/item', '/:id/items'], items);

// App needs to be able to see list
app.use('/list', list);

// :id parameter handler
// Runs every time :id is given in the list route
list.param( 'id', ( req, res, next, id ) => {

	req.hashids.list = Number( listhash.decode( id ) );

	next();

} );

/* -- /list Route -- */

// /list
list.route( '/' )

// GET /list
// Returns a JSON object of all lists and their respective items where status is 'normal'
.get( ( req, res ) => {

	console.log( "GET /list" );

	var sql = "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT  json_agg( json_build_object(  'id', my_items.id, 'content', my_items.content, 'status', my_items.status, 'complete', my_items.complete ) ) FROM my_items WHERE list_id=my_lists.id ) ) ) AS lists FROM my_lists WHERE status=1;"

	pool.query( sql, ( err, result ) => {

		if( err ) tossErr( err, "GET /list failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} )

// POST /list
// Adds a list. Only a list name can be passed.
// Redirects to GET /list
.post( ( req, res ) => {

	console.log( "POST /list" );

	var sql = "INSERT INTO list ( name, status ) VALUES ( $1, 1 ) RETURNING id, name, status";

	var values = [ req.body.name ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list failed." );

		res.redirect( '/list' );

	} );

} );

// /list/archive
list.route( '/archive' )

// GET /list/archive
// Returns JSON of all lists and their items, respectfully
.get( ( req, res ) => {

	console.log( "GET /list/archive" );

	var sql = "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT  json_agg( json_build_object(  'id', my_items.id, 'content', my_items.content, 'status', my_items.status, 'pinned' ) ) FROM my_items WHERE list_id=my_lists.id ) ) ) AS lists FROM my_lists WHERE status=2;"

	pool.query( sql, ( err, result ) => {

		console.log( result );

		if( err ) tossErr( err, "GET /archive failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} );

// /list/:id/archive
list.route( '/:id/archive')

// PUT /list/:id/archive
// Sets the status of the list with `:id` to 2 ( archived )
// Redirects to GET /list
.put( ( req, res ) => {

	console.log( "PUT /list/archive" );

	var sql = "UPDATE list SET status=2 WHERE id=$1";

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list failed." );

		res.redirect( '/list' );

	} );

} )

// DELETE /list/:id/archive
// Sets the status of the list with `:id` to 1 ( normal )
// Redirects to GET /list
.delete( ( req, res ) => {

	console.log( "DELETE /list/archive" );

	var sql = "UPDATE list SET status=1 WHERE id=$1";

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list failed." );

		res.redirect( '/list' );

	} );

} );

// /list/trash
list.route( '/trash' )

// GET /list/trash
// Returns JSON of all lists and their archived with status = 3 ( trashed )
.get( ( req, res ) => {

	console.log( "GET /list/trash" );

	var sql = "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT  json_agg( json_build_object(  'id', my_items.id, 'content', my_items.content, 'status', my_items.status, 'pinned' ) ) FROM my_items WHERE list_id=my_lists.id ) ) ) AS lists FROM my_lists WHERE status=3;"

	pool.query( sql, ( err, result ) => {

		if( err ) tossErr( err, "GET /list/trash failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} )

// PURGE /list/trash
// Permanently deletes all lists with status = 3 ( trashed )
// Redirects to GET /list
.purge( ( req, res ) => {

	console.log( "PURGE /list/trash" );

	var sql = "DELETE FROM list WHERE status=3";

	pool.query( sql, ( err, result ) => {

		if( err ) tossErr( err, "PURGE /list/trash failed." );

		res.redirect( '/list' );

	} );

} );;

// /list/:id/trash
list.route( '/:id/trash')

// PUT /list/:id/trash
// Changes list with :id to status = 3 ( trashed )
// Redirects to GET /list
.put( ( req, res ) => {

	console.log( "PUT /list/trash", req.hashids.list );

	var sql = "UPDATE list SET status=3 WHERE id=$1";

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "PUT /list/trash failed." );

		res.redirect( '/list' );

	} );

} )
// PUT /list/:id/trash
// Changes list with :id to status = 1 ( normal )
// Redirects to GET /list
.delete( ( req, res ) => {

	console.log( "DELETE /list/trash", req.hashids.list );

	var sql = "UPDATE list SET status=1 WHERE id=$1";

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "DELETE /list/trash failed." );

		res.redirect( '/list' );

	} );

} );

// /list/:id
list.route( '/:id' )

// GET /list/:id
// Returns JSON of specific list with :id and items of that list
.get( ( req, res ) => {

	console.log( "GET /list/:id", req.hashids.list );

	var sql = "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT  json_agg( json_build_object(  'id', my_items.id, 'content', my_items.content, 'status', my_items.status, 'pinned' ) ) FROM my_items WHERE list_id=my_lists.id ) ) ) AS lists FROM my_lists WHERE id=$1;"

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "GET /list failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} )
// PUT /list/:id
// Change the name of a list
// Returns just the list object.
.put( ( req, res ) => {

	console.log( "PUT /list/:id", req.hashids.list );

	var sql = "UPDATE list SET name=$2 WHERE id=$1";

	var values = [ req.hashids.list, req.body.name ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "PUT /list failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} );

/* -- /list Route -- */

// /list/items
items.route( '/' )
// POST /list/items
// Adds an item. You can pass content. That's all.
// Redirects to GET /list
.post( ( req, res ) => {

	console.log( "POST /items" );

	var sql = "INSERT INTO item ( list_id, content, last_updated ) VALUES ( $1, $2, NOW() );";

	var values = [ req.body.id, req.body.content ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list/:id/items failed." );

		res.redirect( '/list' );

	} );

} )
// PUT /list/items
// Update an item's content
// Must Pass a body with { id: <hash>, content: <string> }
// Redirects to GET /list
.put( ( req, res ) => {

	var sql = "UPDATE item SET content=$2, last_updated=NOW() WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ), req.body.content ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list/:id/items failed." );

		res.redirect( '/list' );

	} );

} );

// /list/items/complete
items.route( '/complete' )

// PUT /list/items/complete
// Mark an item as complete
// Must Pass a body with { id: <hash> }
// Redirects to GET /list
.put( ( req, res ) => {

	console.log( "PUT /items/complete" );

	var sql = "UPDATE item SET complete=true WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ) ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "PUT /list/:id/items/complete failed." );

		res.redirect( '/list' );

	} );

} )
// DELETE /list/items/
// Mark an item as complete
// Must Pass a body with { id: <hash> }
// Redirects to GET /list
.delete( ( req, res ) => {

	console.log( "PUT /items/complete" );

	var sql = "UPDATE item SET complete=false WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ) ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "PUT /list/:id/items/complete failed." );

		res.redirect( '/list' );

	} );

} );

// /list/:id/items/archive
items.route( '/archive' )

// GET /list/:id/items/archive
// Returns JSON of the list with :id and its items with status = 2 ( archived )
.get( ( req, res ) => {

	console.log( "GET /items/archive" );

	var sql = "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT  json_agg( json_build_object(  'id', my_items.id, 'content', my_items.content, 'status', my_items.status, 'pinned' ) ) FROM my_items WHERE list_id=my_lists.id AND status=2 ) ) ) AS lists FROM my_lists WHERE id=$1;"

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list/:id/items failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} )
// PUT /list/:id/items/archive
// Sets an item's status = 2 ( archived )
// Must pass object { id: hash }
// Redirects to GET /list
.put( ( req, res ) => {

	console.log( "PUT /items/archive" );

	var sql = "UPDATE item SET status=2 WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ) ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "PUT /list/:id/items/archive failed." );

		res.redirect( '/list' );

	} );

} )
// DELETE /list/:id/items/archive
// Sets an item's status = 1 ( normal )
// Must pass object { id: hash }
// Redirects to GET /list
.delete( ( req, res ) => {

	console.log( "DELETE /items/archive" );

	var sql = "UPDATE item SET status=1 WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ) ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "DELETE /list/:id/items/archive failed." );

		res.redirect( '/list' );

	} );

} );

items.route( '/trash' )
// GET /list/:id/items/trash
// Returns JSON of a list with :id and all its items
// Redirects to GET /list
.get( ( req, res ) => {

	console.log( "GET /items/trash" );

	var sql = "SELECT json_agg( json_build_object( 'id', my_lists.id, 'name', my_lists.name, 'items', ( SELECT  json_agg( json_build_object(  'id', my_items.id, 'content', my_items.content, 'status', my_items.status, 'pinned' ) ) FROM my_items WHERE list_id=my_lists.id AND status=3 ) ) ) AS lists FROM my_lists WHERE id=$1;"

	var values = [ req.hashids.list ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "POST /list/:id/items failed." );

		var rows = result.rows[0].lists;

		rows = hashit( rows );

		res.send( rows );

	} );

} )
// PUT /list/:id/items/trash
// Sets an item's status = 3 ( trashed )
// Must pass object { id: hash } ( for item )
// Redirects to GET /list
.put( ( req, res ) => {

	console.log( "PUT /items/trash" );

	var sql = "UPDATE item SET status=3 WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ) ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "PUT /list/:id/items/trash failed." );

		res.redirect( '/list' );

	} );

} )
// DELETE /list/:id/items/trash
// Sets an item's status = 1 ( normal )
// Must pass object { id: hash } ( for item )
// Redirects to GET /list
.delete( ( req, res ) => {

	console.log( "DELETE /items/trash" );

	var sql = "UPDATE item SET status=1 WHERE id=$1";

	var values = [ Number( itemhash.decode( req.body.id ) ) ];

	pool.query( sql, values, ( err, result ) => {

		if( err ) tossErr( err, "DELETE /list/:id/items/trash failed." );

		res.redirect( '/list' );

	} );

} )
// PURGE /list/:id/items/trash
// In list with :id, this permanently deletes all items having status = 3 ( trashed )
.purge( ( req, res ) => {

	console.log( "PURGE /items/trash" );

	var sql = "DELETE FROM item WHERE status=3 AND list_id=$1";

	var values = [ req.hashids.list ];

	pool.query( sql, ( err, result ) => {

		if( err ) tossErr( err, "PURGE /list/:id/items/trash failed." );

		res.redirect( '/list' );

	} );

} );