import React, { Component } from 'react';

export default class SocketContainer extends Component {
    render() {
        return(
            
        )
    }

}


export default class SocketUtil {
    static instance = null;
    static socket = null;

    constructor(socket, movePieceFunction) {
        this.instance = this.createInstance(socket);
        console.log(movePieceFunction);
        this.movePiece = movePieceFunction;
    }

    createInstance(socket) {
        this.socket = socket;
        this.registerInteraction();
        this.helloWorld();
        return SocketUtil.instance;
    }

    static getInstance() {
        return SocketUtil.instance;
    }

    registerInteraction() {
        this.socket.on('result', function(data){
            console.log('The data is: ' + data);
            this.movePiece('BL1', 'BLUE_GROUND', 'C1');
            // BL1 BLUE_GROUND C1
        });

    }

    helloWorld() {
        this.socket.emit('chat', 'Hello');
        console.log("Hello World... (^_^)/ !!")
    }
}
