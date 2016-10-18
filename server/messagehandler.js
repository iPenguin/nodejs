/**
 * This class processes and redirects incoming WebSocket
 * messages and passes them to the correct module for response.
 *
 * Modules should export doAction( webSocket, messageObject )
 *
 */

class MessageHandler {
    constructor( ws ) {
        this._ws = ws;
    }

    /**
     * process incoming messages from the frontend.
     * Expected format:
     * {
     *    action: 'my_action',
     *    module: 'my_module',
     *    data: {
     *      param1: 'something',
     *      param2: 2,
     *    }
     * }
     */
    processMessage( messageText ) {

        let actionObj = JSON.parse( messageText );

        if( typeof( actionObj.module ) == undefined ) {
            throw new Error( "No module defined for action" );
        }

        let au = require( './' + actionObj.module );
        au.doAction( this._ws, actionObj );
    }
}

module.exports.MessageHandler = MessageHandler;
