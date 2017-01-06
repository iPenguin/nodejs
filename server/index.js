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

let rs = require( './routeserver' );
let routeServer = new rs.RouteServer( app );

/**
 * The fallback route renders template files from the filesystem.
 */
app.get( '/:filename', function ( req, res, next ) {
    let fs = require( 'fs' );
    let templateFileName = __dirname + '/templates/' + req.params.filename;

    let tempExists = fs.existsSync( templateFileName );

    if( ! tempExists ) {
        res.writeHead( 404, { 'Content-Type': 'text/html' } );
        ejs.renderFile( __dirname + "/templates/404.html", {}, function ( err, result ) {
            if( ! err ) {
                res.end( result );
            }
            else {
                res.end( err.toString() );
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
} );

app.listen( 8080 );
