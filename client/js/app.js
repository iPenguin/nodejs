window.onload = function() {

    // Get references to elements on the page.
    var form = document.getElementById( 'message-form' );
    var messageField = document.getElementById( 'message' );
    var messagesList = document.getElementById( 'messages' );
    var socketStatus = document.getElementById( 'status' );
    var closeBtn = document.getElementById( 'close' );

    // Create a new WebSocket.
    let socket = new WebSocket( 'ws://localhost:8080' );

    // Handle any errors that occur.
    socket.onerror = function( error ) {
        console.log( 'WebSocket Error: ' + error );
    };

    // Show a connected message when the WebSocket is opened.
    socket.onopen = function( event ) {
        socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.url;
        socketStatus.className = 'open';
    };

    // Handle messages sent by the server.
    socket.onmessage = function( event ) {
        console.log( event );
        let response = parseResponse( event.data );

        messagesList.innerHTML += '<li class="received"><span>user: ' + response.user + '</span>' +
                                   response.message + '</li>';
    };

    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = function( event ) {
        socketStatus.innerHTML = 'Disconnected from WebSocket.';
        socketStatus.className = 'closed';
    };

    // Send a message when the form is submitted.
    form.onsubmit = function( e ) {
        e.preventDefault();

        let message = messageField.value;

        generateRequest( socket, {
            action: 'send_message',
            message: message,
        } );

        // Add the message to the messages list.
        messagesList.innerHTML += '<li class="sent"><span>Me:</span>' + message +
                                  '</li>';

        // Clear out the message field.
        messageField.value = '';

        return false;
    };

    // Close the WebSocket connection when the close button is clicked.
    closeBtn.onclick = function( e ) {
        e.preventDefault();

        // Close the WebSocket.
        socket.close();

        return false;
    };

    function generateRequest( socket, options ) {
        console.log( "Request:", options );
        socket.send( JSON.stringify( options ) );
    }

    function parseResponse( eventData ) {
        let responseObj = JSON.parse( eventData );
        console.log( "Response:", responseObj );
        return responseObj;
    }

};
