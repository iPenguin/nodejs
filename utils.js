#!/usr/bin/env node
/**
 * Utility script for generating cached files
 * and other site functions.
 */

const fs = require( 'fs' );
// Get command line options.
const program = require( 'commander' );
const ejs = require( 'ejs' );

program
    .arguments( '<path>' )
    .option( '-c, --cache <page>', 'Generate a cached copy of [page]' )
    .option( '-a, --all', 'Generate cached copies of all pages' )
    .parse( process.argv );

main( program );

/*****************************************************************************
 *****************************************************************************/

function main( program ) {

    if( typeof( program.cache ) !== 'undefined' ) {
        createCachedPage( program.cache );
    }
    else if( typeof( program.all ) !== 'undefined' ) {
        let templateFolder = __dirname + '/server/templates/';
        fs.readdir( templateFolder, ( err, files ) => {
            for( let i in files ) {
                let file = files[ i ];
                let stat = fs.lstatSync( templateFolder + '/' + file );
                if( stat.isFile() ) {
                    createCachedPage( file );
                }
            }
        } );
    }
}

/**
 * Create a cached copy of the template fileName
 */
function createCachedPage( fileName ) {
    let cachedFileName = __dirname + '/server/cached/' + fileName;
    let templateFileName = __dirname + '/server/templates/' + fileName;

    let tempExists = fs.existsSync( templateFileName );

    if( ! tempExists ) {
        console.log( "No template exists for the file: " + templateFileName );
        return;
    }

    ejs.renderFile( templateFileName, {}, function ( err, result ) {
        if( ! err ) {
            fs.writeFile( cachedFileName, result, function ( err ) {
                if( err ) {
                    return console.log( "Error: could not write cache file.", err );
                }
                console.log( "Finished rendering template " + templateFileName + " -> " + cachedFileName );
            } );
        }
        else {
            console.log( "Error: could not render template.", err );
        }
    } );
}
