/**
 * Example WebSocket module.
 */

class EchoChat {
    constructor( ws ) {
        this.ws = ws;
    }

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
