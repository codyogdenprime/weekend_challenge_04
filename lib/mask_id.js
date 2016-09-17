const Hashids = require( 'hashids' );
const itemhash = new Hashids( '', 18 );

module.exports = {
	encode: ( id ) => {
		return itemhash.encode( id );
	},
	decode: ( id ) => {
		return itemhash.decode( id )[0];
	}
};