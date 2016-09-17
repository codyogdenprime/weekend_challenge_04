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

var items = express().Router();

app.use( '/items', items );

items.route('/')
.post( ( req, res ) => {
	console.log( "POST /item", req.body );

	var sql = "SELECT * FROM items";

	pool.query( sql, ( err, result ) => {

		res.send( result.rows );

	} );

} )
.get( ( req, res ) => {
	console.log( "GET /item", req.body );


} )
.put( ( req, res ) => {
	console.log( "PUT /item", req.body );


} )
.delete( ( req, res ) => {
	console.log( "DELETE /item", req.body );


} )