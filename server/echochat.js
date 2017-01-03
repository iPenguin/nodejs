/**
 * Example WebSocket module.
 */

function echoChat( ws, messageObj ) {
    if( messageObj.data.action == 'send_message' ) {
        ws.send( JSON.stringify( {
            isSuccess: true,
            call_id:   messageObj.call_id,
            data:      {
                message:   messageObj.data.message,
                user:      'brian',
            },
        } ) );
    }
}

function doAction( ws, messageObj ) {

    echoChat( ws, messageObj );
}

module.exports.doAction = doAction;
