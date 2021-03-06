window.onload = function () {

    // Get references to elements on the page.
    let form = document.getElementById( 'message-form' );
    let messageField = document.getElementById( 'message' );
    let messagesList = document.getElementById( 'messages' );
    let socketStatus = document.getElementById( 'status' );
    let closeBtn = document.getElementById( 'close' );
    let respondBtn = document.getElementById( 'respond' );

    // Create a new WebSocket.
    let socket = new Socket( 'EchoChat', {
        open: ( event ) => {
            socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.url;
            socketStatus.className = 'open';
        },
        close: ( event ) => {
            // Show a disconnected message when the WebSocket is closed.
            socketStatus.innerHTML = 'Disconnected from WebSocket.';
            socketStatus.className = 'closed';
        },
    } );

    // Send a message when the form is submitted.
    form.onsubmit = ( e ) => {
        e.preventDefault();

        let message = messageField.value;

        socket.send( {
            action:  'echo_message',
            message: message,
        }, /* options */ {
            success: ( jsonData ) => {
                messagesList.innerHTML += '<li class="received"><span>user: ' + jsonData.user + '</span>' +
                    jsonData.message + '</li>';
            }
        } );

        // Add the message to the messages list.
        messagesList.innerHTML += '<li class="sent"><span>Me:</span>' + message + '</li>';

        // Clear out the message field.
        messageField.value = '';

        return false;
    };

    respondBtn.onclick = ( e ) => {
        e.preventDefault();

        let message = messageField.value;

        socket.send( {
            action:  'send_response',
            message: message,
        }, /* options */ {
            success: ( jsonData ) => {
                messagesList.innerHTML += '<li class="received"><span>user: ' + jsonData.user + '</span>' +
                    jsonData.message + '</li>';
            }
        } );

        // Add the message to the messages list.
        messagesList.innerHTML += '<li class="sent"><span>Me:</span>' + message + '</li>';

        // Clear out the message field.
        messageField.value = '';
    };

    // Close the WebSocket connection when the close button is clicked.
    closeBtn.onclick = ( e ) => {
        e.preventDefault();

        // Close the WebSocket.
        socket.close();

        return false;
    };
};
