/**
 * The class processes and redirects incoming WebSocket
 * messages and passes them to the correct module for response.
 */

class MessageHandler {
    constructor( ws, messageText ) {
        this._ws = ws;

        let messageObj = JSON.parse( messageText );

        this.processMessage( ws, messageObj );
    }

    /**
     * process incoming messages from the frontend.
     * Expected format:
     * {
     *    action: 'my_action',
     *    data: {
     *      param1: 'something',
     *      param2: 2,
     *    }
     * }
     */
    processMessage( ws, actionObj ) {

        if( typeof( actionObj.module ) == undefined ) {
            throw new Error( "No module defined for action" );
        }

        let au = require( './' + actionObj.module );
        au.doAction( ws, actionObj );
    }

}

module.exports.MessageHandler = MessageHandler;
