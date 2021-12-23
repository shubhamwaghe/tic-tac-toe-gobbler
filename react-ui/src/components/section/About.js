import React, { Component } from 'react';

export default class About extends Component {
    render() {
        return(
            <div className="about">
                <section>
                    <h1>About</h1>
                    <p>About Section</p>
                    <p>Total Games Played : <b>{this.props.gamesPlayed}</b></p>

                </section>
            </div>
        )
    }

}
