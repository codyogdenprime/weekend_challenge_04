// Initialize Config Map
const config = new Map();

// Database Information
config.set( 'db_url', 'postgres://localhost:5432/checklist');
config.set( 'db_user', '' );
config.set( 'db_password', '' );

config.set( 'port', process.env.PORT || 3000 );

module.exports = config;