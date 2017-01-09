/**
 * This file contains the setup glue code.
 */
let express = require( 'express' );
let app = express();
let expressWs = require( 'express-ws' )( app );
const t = require( './Template' );

app.use( express.static( 'client' ) );

app.use( function ( req, res, next ) {
    return next();
} );

let rs = require( './routeserver' );
let routeServer = new rs.RouteServer( app );

/**
 * The fallback route renders template files from the filesystem.
 */
app.get( '/:filename', function ( req, res, next ) {
    let template = new t.Template( req );
    template.render( res );
} );

app.listen( 8080 );
