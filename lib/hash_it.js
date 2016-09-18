'use strict';
const Hashids = require( 'hashids' );
const listhash = new Hashids( 'list', 12 );
const itemhash = new Hashids( 'item', 24 );

console.log( "in hash_it", listhash.encode( 1 ) );

/*

	This module recursively hashes all `id` fields for two levels ( list.id > items.id )

*/

const hashit = ( rows ) => {

	if( rows ) {

		for( let i = 0; i < rows.length; i++ ) {

			rows[i].id = listhash.encode( rows[i].id );

			var items = rows[i].items;

			if( items ) {

				for( let j = 0; j < items.length; j++ ) {

					items[j].id = itemhash.encode( items[j].id );

				}

			}

		}

	}

	return rows;

};


module.exports = hashit;