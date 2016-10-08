/**
 * This file contains the setup glue code.
 */
let express = require( 'express' );
let app = express();
let expressWs = require( 'express-ws' )( app );
let ejs = require( 'ejs' );

app.use( express.static( 'client' ) );

app.use( function ( req, res, next ) {
    return next();
} );

app.get( '/hello', function ( req, res, next ) {
    ejs.renderFile( __dirname + '/templates/test.html', {}, function ( err, result ) {
        if( ! err ) {
            res.end( result );
        }
        else {
            res.end( err.toString() );
            console.log( err );
        }
    } );
} );

app.ws( '/', function ( ws, req ) {
    ws.on( 'message', function ( msg ) {
        let main = require( './server.js' );
        let server = new main.Server( app );

        let jsonObj = JSON.parse( msg );
        server.processMessage( jsonObj );
    } );
} );

app.listen( 8080 );
