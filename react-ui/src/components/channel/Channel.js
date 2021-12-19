import React, { Component } from 'react';
export class Channel extends Component {
    render() {
        return (
            <div>
                <div className="channel-item"></div>
                <div> {this.props.name} </div>
                <span>{this.props.participants}</span>
            </div>
            
        )
    }
}