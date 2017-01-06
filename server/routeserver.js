/**
 * Create and manage routes on the server, by redirecting messages
 * to the correct module for a response.
 *
 * modules should be structured as follows:
 *
 * Module.js contains:
 *    class Module {
 *        constructor() {
 *            ...
 *        }
 *
 *        doAction( messageObj ) {
 *
 *        }
 *    }
 */

class RouteServer {
    constructor( app ) {
        let rs = this;
        rs._app = app;

        rs._app.ws( '/', function ( ws, req ) {
            ws.on( 'message', function ( messageString ) {
                rs._receiveMessage( ws, messageString );
            } );
        } );
    }

    /**
     * Process incoming messages from the frontend.
     * Expected format:
     * {
     *    call_id: 'unique_id',
     *    page_id: 'my_module',
     *    data: {
     *      action: 'do_something',
     *      param1: 'important data',
     *      param2: 2,
     *    }
     * }
     * The format of the data parameter is defined in the module being requested.
     *
     * If the module responds to client message requests, the reply to the
     * client should contain the call_id parameter to trigger any callbacks
     * that are waiting for data from this request.
     */
    _receiveMessage( ws, messageText ) {
        let messageObj = JSON.parse( messageText );

        if( typeof( messageObj.page_id ) == undefined ) {
            throw new Error( "No page_id defined for action" );
        }

        let customModule = require( './' + messageObj.page_id );
        let mod = new customModule[ messageObj.page_id ]( ws );

        if( typeof( mod.doAction ) != 'function' ) {
            throw new Error( "No doAction function for " + messageObj.page_id );
        }
        mod.doAction( messageObj );
    }
}

module.exports.RouteServer = RouteServer;
