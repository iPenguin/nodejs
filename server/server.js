/**
 * This file contains routing code.
 */
var m = require( './message.js' );

let actions = {
    'send_message': m.echoMessage,

};

/**
 * Server class to respond to actions.
 */
class Server {
    constructor( app ) {
        this._app = app;
        this._actions = actions;
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
    processMessage( actionObj ) {

        if( typeof( actionObj.action ) == undefined ) {
            throw new Error( "Action Object missing action", actionObj );
        }
        if( typeof( this._actions[ actionObj.action ] ) !== 'function' ) {
            throw new Error( "Action is not a function:", actionObj.action );
        }
        if( typeof( actionObj.data ) == undefined ) {
            actionObj.data = {};
        }
        console.log( this._actions, actionObj );
        this._actions[ actionObj.action ]( actionObj.data );
    }
}

module.exports.Server = Server;
