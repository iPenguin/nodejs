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

/**
 * This route will check for a cached copy of the given filename.
 * If a cached copy exists it will render the cached copy, otherwise
 * it will check if a template exists with that name and attempt to
 * render the template. If no template exists it will give up. :,(
 */
app.get( '/:filename', function ( req, res, next ) {

    let fs = require( 'fs' );
    let cachedFileName = __dirname + '/cached/' + req.params.filename;
    let templateFileName = __dirname + '/templates/' + req.params.filename;

    let cacheExists = fs.existsSync( cachedFileName );

    // Is a file?
    if( cacheExists ) {
        let fileStream = fs.createReadStream( cachedFileName );
        fileStream.on( 'data', function ( data ) {
            res.end( data );

        } );
    }
    else {
        let tempExists = fs.existsSync( templateFileName );

        // Is a file?
        if( ! tempExists ) {
            res.writeHead( 404, { 'Content-Type': 'text/html' } );
            ejs.renderFile( __dirname + "/templates/404.html", {}, function ( err, result ) {
                if( ! err ) {
                    res.end( result );
                }
                else {
                    res.end( err.toString() );
                    console.log( err );
                }
            } );
            return;
        }

        ejs.renderFile( templateFileName, {}, function ( err, result ) {
            if( ! err ) {
                res.end( result );
            }
            else {
                res.end( err.toString() );
                console.log( err );
            }
        } );
    }
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
