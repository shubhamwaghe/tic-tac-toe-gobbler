import React, { Component } from 'react';
import tttimage from '../img/tic-tac-toe-image.png'
import { Link } from 'react-router-dom';

export default class SideNav extends Component {
    render() {
        return(
            <div className="sidenav">
                <div className="image-wrapper" align="center">
                    <img src={tttimage} className="tttimage" alt="Gobbler Logo" />
                </div>
                <div className="navigation-wrapper" align="center">
                    <Link to="/"><div className="nav-item" align="left">Home</div></Link>
                    <Link to="/about"><div className="nav-item" align="left">About</div></Link>
                </div>
            </div>

        )
    }

}
