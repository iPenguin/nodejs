{
    /**
     * makeId function leveraged from with modifications:
     * http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
     */
    function makeId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( let i = 0; i < 8; i++ ) {
            text += possible.charAt( Math.floor( Math.random() * possible.length ) );
        }
        return text;
    }

    let cbSuccess = {};
    let cbError = {};

/**
 * Socket - WebSocket wrapper class.
 *
 * @page - name of code module.
 * @options -
 *     url - url used to connect to the websocket, including ws://
 *     open - function onopen
 *     close - function onclose
 *     error - function onerror
 */
    class Socket {
        constructor( page, options ) {

            let url = ( typeof( options.url ) == 'string' ? options.url : 'ws://localhost:8080' );

            this._ws = new WebSocket( url );
            this._page = page;

            if( options ) {
                this._ws.onopen = ( typeof( options.open ) == 'function' ? options.open : this._onOpen );
                this._ws.onclose = ( typeof( options.close ) == 'function' ? options.close : this._onClose );
                this._ws.onerror = ( typeof( options.error ) == 'function' ? options.error : this._onError );
            }

            this._ws.onmessage = this._processMessages;
        }

        // Default onerror event handler if none specified.
        _onError( error ) {
            console.log( 'WebSocket Error: ' + error );
        }

        // Default onopen event handler if none specified.
        _onOpen( event ) {
            console.log( 'WebSocket On Open: ' + event );
        }

        // Default onclose event handler if none specified.
        _onClose( event ) {
            console.log( 'WebSocket On Close: ' + event );
        }

        /**
         * Process response messages from the server.
         */
        _processMessages( event ) {
            let responseData = JSON.parse( event.data );

            if( responseData.isSuccess && responseData.call_id ) {
                if( typeof( cbSuccess[ responseData.call_id ] ) == 'function' ) {
                    cbSuccess[ responseData.call_id ]( responseData.data );
                }
                else if( typeof( cbError[ responseData.call_id ] ) == 'function' ) {
                    cbError[ responseData.call_id ]( responseData.data );
                }
            }

            // Do memory management on the callback stack.
            delete cbSuccess[ responseData.call_id ];
            delete cbError[ responseData.call_id ];
        }

        // Default success handler.
        _onSuccess( jsonData ) {
            console.log( "Success is empty if you don't have anyone to share it with." );
        }

        // Default error handler.
        _onError( jsonData ) {
            console.log( "You wont learn anything if you don't handle your errors better" );
        }

        /**
         * Send data to the server, and define callbacks when the server responds.
         * options: {
         *     success: ( jsondData ) => {},
         *     error: ( jsondData ) => {},
         * }
         */
        send( jsonData, options ) {
            let callId = makeId();
            jsonData.call_id = callId;
            jsonData.page_id = this._page;
            this._ws.send( JSON.stringify( jsonData ) );

            cbSuccess[ callId ] = ( typeof( options.success ) == 'function' ? options.success : this._onSuccess );
            cbError[ callId ] = ( typeof( options.error ) == 'function' ? options.error : this._onError );
        }

        close() {
            this._ws.close();
        }
    }


    // Export global class
    window.Socket = Socket;
}
