/**
 * Example WebSocket module.
 */

function echoChat( ws, messageObj ) {

    ws.send( JSON.stringify( {
        isSuccess: true,
        call_id:   messageObj.call_id,
        data:      {
            message:   messageObj.message,
            user:      'brian',
        },
    } ) );

}

function doAction( ws, messageObj ) {

    echoChat( ws, messageObj );
}

module.exports.doAction = doAction;
