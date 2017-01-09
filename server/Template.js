/**
 * Template rendering and cache file creating.
 */
const ejs = require( 'ejs' );
const fs = require( 'fs' );

class Template {
    constructor( req ) {

        this.req = req;
        this.fileName = __dirname + '/templates/' + req.params.filename;

    }

    render( res ) {

        let templateExists = fs.existsSync( this.fileName );

        if( ! templateExists ) {
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

        ejs.renderFile( this.fileName, {}, function ( err, result ) {
            if( ! err ) {
                res.end( result );
            }
            else {
                res.end( err.toString() );
                console.log( err );
            }
        } );
    }


}

module.exports.Template = Template;
