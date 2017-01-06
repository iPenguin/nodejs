/**
 * Example WebSocket module.
 */

class EchoChat {
    constructor( ws ) {
        this.ws = ws;
    }

    /**
     * Default message routing function for this object.
     * The routing server assumes all modules will have a
     * doAction() function.
     */
    doAction( messageObj ) {
        console.log( "do action", messageObj );
        switch( messageObj.data.action ) {
            case 'echo_message':
                this.echoMessage( messageObj );
                break;
            case 'send_response':
                this.sendResponse( messageObj );
                break;
        }
    }

    /**
     * Simple function to echo the user message back to them.
     */
    echoMessage( messageObj ) {
        this.ws.send( JSON.stringify( {
            isSuccess: true,
            call_id:   messageObj.call_id,
            data:      {
                message: messageObj.data.message,
                user:    'dan',
            }
        } ) );
    }

    /**
     * Send the user a generic response message
     */
    sendResponse( messageObj ) {
        this.ws.send( JSON.stringify( {
            isSuccess: true,
            call_id:   messageObj.call_id,
            data:      {
                message: 'Response Message',
                user:    'brian',
            }
        } ) );
    }
}

module.exports.EchoChat = EchoChat;
