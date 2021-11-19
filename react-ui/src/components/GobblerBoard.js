import React, { Component } from 'react';
import GobblerSquare from './GobblerSquare';

export default class GobblerBoard extends Component {

    renderGobblerSquare(position){
        return <GobblerSquare pieces={this.props.squares[position]}
        onClick={()=>this.props.onClick(position)}
        />
    }

    render() {
        return (
            <div>
                <div className="border-row">
                    {this.renderGobblerSquare("A3")}
                    {this.renderGobblerSquare("B3")}
                    {this.renderGobblerSquare("C3")}
                </div>
                <div className="border-row">
                    {this.renderGobblerSquare("A2")}
                    {this.renderGobblerSquare("B2")}
                    {this.renderGobblerSquare("C2")}
                </div>
                <div className="border-row">
                    {this.renderGobblerSquare("A1")}
                    {this.renderGobblerSquare("B1")}
                    {this.renderGobblerSquare("C1")}
                </div>
                
            </div>
        )
    }

}