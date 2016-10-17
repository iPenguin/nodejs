/**
 * Example WebSocket module.
 */

function echoChat( ws, messageObj ) {

    ws.send( JSON.stringify( {
        message: messageObj.data.message,
        user:    'brian',
    } ) );

}

function doAction( ws, messageObj ) {

    echoChat( ws, messageObj );
}

module.exports.doAction = doAction;
