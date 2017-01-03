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
        console.log( "process message", messageText );
        let actionObj = JSON.parse( messageText );
        console.log( "process message obj", actionObj );

        if( typeof( actionObj.page_id ) == undefined ) {
            throw new Error( "No page defined for action" );
        }

        let au = require( './' + actionObj.page_id );
        au.doAction( this._ws, actionObj );
    }
}

module.exports.MessageHandler = MessageHandler;
