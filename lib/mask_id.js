const Hashids = require( 'hashids' );
const listhash = new Hashids( '', 12 );
const itemhash = new Hashids( '', 18 );

module.exports = {
	list: {
		encode: ( id ) => {
			return listhash.encode( id );
		},
		decode: ( id ) => {
			return listhash.decode( id )[0];
		}
	},
	item: {
		encode: ( id ) => {
			return itemhash.encode( id );
		},
		decode: ( id ) => {
			return itemhash.decode( id )[0];
		}
	}
};