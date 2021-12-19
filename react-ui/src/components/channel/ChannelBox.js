import React, { Component } from 'react';
import { ChannelList } from './ChannelList';

export class ChannelBox extends Component {

    state = {
        channels: [{ id: 1, name: 'first', participants: 10 }]
    }
    render() {
        return (
            <div classname="chat-app">
                <ChannelList channels={this.state.channels}></ChannelList>
            </div>
            
        );
    }
}