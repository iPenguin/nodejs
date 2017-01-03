/**
 * This file contains the setup glue code.
 */
let express = require( 'express' );
let app = express();
let expressWs = require( 'express-ws' )( app );
let ejs = require( 'ejs' );
let db = require( 'nano' )( 'http://localhost:5984' );

app.use( express.static( 'client' ) );

app.use( function ( req, res, next ) {
    return next();
} );

let rs = require( './routeserver' );
let routeServer = new rs.RouteServer( app );

/**
 * The fallback or default route.
 * This route will check for a cached copy of the given filename.
 * If a cached copy exists it will render the cached copy, otherwise
 * it will check if a template exists with that name and attempt to
 * render the template. If no template exists it will give up. :,(
 */
app.get( '/:filename', function ( req, res, next ) {
    let settings = db.use( 'settings' );
    let cache_file = true;

    settings.view( 'by_site_view', 'by_site', {'site': 'localhost'}, function ( err, body ) {
        if( err ) {
            console.log( "error with view", err );
            return;
        }
        if( body.rows.length > 0 ) {
            let document = body.rows[ 0 ].value;
            cache_file = document.create_cache;
            console.log( "cache file", cache_file );
        }
    } );

    let fs = require( 'fs' );
    let cachedFileName = __dirname + '/cached/' + req.params.filename;
    let templateFileName = __dirname + '/templates/' + req.params.filename;

    let cacheExists = fs.existsSync( cachedFileName );

    if( cacheExists ) {
        let fileStream = fs.createReadStream( cachedFileName );
        fileStream.on( 'data', function ( data ) {
            res.end( data );

        } );
    }
    else {
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
                console.log( "render:", cache_file );
                if( cache_file ) {
                    fs.writeFile( __dirname + "/cached/" + req.params.filename, result, function ( err ) {
                        if( err ) {
                            return console.log( err );
                        }
                    } );
                }
                res.end( result );
            }
            else {
                res.end( err.toString() );
                console.log( err );
            }
        } );
    }
} );

app.listen( 8080 );
