let actions = {
    'send_message': function( ws, options ) {
        sendMessage( ws, {
            user: "brian",
            message: "Server says: " + options.message,
        } );
    },
};

let WebSocketServer = require( 'ws' ).Server,
    wss = new WebSocketServer( { port: 8080, } );

wss.on( 'connection', function connection( ws ) {

    ws.on( 'message', function incoming( message ) {
        let d = parseMessage( message );
        actions[ d.action ]( ws, d );

    } );

    ws.send( 'Server Says... Connected!' );
} );

function parseMessage( stringData ) {
    return JSON.parse( stringData );
}

function sendMessage( ws, jsonObject ) {
    ws.send( JSON.stringify( jsonObject ) );
}
