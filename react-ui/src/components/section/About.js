import React, { Component } from 'react';

export default class About extends Component {
    render() {
        return(
            <div className="about">
                <section>
                    <h1>About</h1>
                    <h4>Game Launch Date: 31st December 2021</h4>
                    {/*<p>Total Games Played : <b>{this.props.gamesPlayed}</b></p>*/}

                </section>
            </div>
        )
    }

}
