import React, { useState } from 'react'
import Modal from 'react-bootstrap-modal'
import happyemoji from '../img/happy-emoji.png'

import 'react-bootstrap-modal/lib/css/rbm-complete.css';

export default function PlayerWelcomeModal({ joinBluePlayer, joinRedPlayer }) {

    const [open, setOpen] = useState(true);
    const [bluePlayerName, setBluePlayerName] = useState("");
    const [redPlayerName, setRedPlayerName] = useState("");
    const [bluePlayerErrorDisplay, setBluePlayerErrorDisplay] = useState(false);
    const [redPlayerErrorDisplay, setRedPlayerErrorDisplay] = useState(false);

    function joinBluePlayerBtn() {
        if (!bluePlayerName || bluePlayerName === "") {
            setBluePlayerErrorDisplay(true);
            return;
        } else {
            joinBluePlayer(bluePlayerName);
            setOpen(false);
        }
    }

    function joinRedPlayerBtn() {
        if (!redPlayerName || redPlayerName === "") {
            setRedPlayerErrorDisplay(true);
            return;
        } else {
            joinRedPlayer(redPlayerName);
            setOpen(false);
        }
    }

    function saveAndClose() {
        setOpen(false);
    }

    function updateBluePlayerName(evt) {
        setBluePlayerName(evt.target.value);
        setBluePlayerErrorDisplay(false);
    }

    function updateRedPlayerName(evt) {
        setRedPlayerName(evt.target.value);
        setRedPlayerErrorDisplay(false);

    }


    return (
        <div>

            <Modal large
                show={open}
                backdrop="static"
                keyboard={false}
                aria-labelledby="ModalHeader">
                <Modal.Header closeButton>
                    <Modal.Title id='ModalHeader'>Welcome to Tic Tac Toe - Gobbler!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h3>Join Channel</h3>
                    <div>Blue Player Plays First :)</div>
                    <div>
                        <div>
                            <input className="join-input-box" placeholder="Enter Your Name" 
                            value={bluePlayerName} onChange={evt => updateBluePlayerName(evt)} />
                            <button type="submit" className='btn blue-join-button' onClick={() => joinBluePlayerBtn()} >
                                <b>Join as BLUE Player</b>
                            </button>
                            <div className={`error-message ${!bluePlayerErrorDisplay ? 'hidden' : undefined }`}>
                                <span><small><i>Name : Blue Player Name is Required!</i></small></span>
                            </div>
                        </div>
                        <div>
                            <input className="join-input-box" placeholder="Enter Your Name" 
                            value={redPlayerName} onChange={evt => updateRedPlayerName(evt)} />
                            <button type="submit" className='btn red-join-button' onClick={() => joinRedPlayerBtn()} >
                                <b>Join as RED Player</b>
                            </button>
                            <div className={`error-message ${!redPlayerErrorDisplay ? 'hidden' : undefined }`}>
                                <span><small><i>Name : Red Player Name is Required!</i></small></span>
                            </div>
                        </div>
                    </div>
                    <h3>Rules</h3>
                    <p>
                        Just as with tic-tac-toe, you need to try and get three of your pieces in a 
                        row without any interceptions from your opponent. 
                    </p>
                    <p>
                        Unlike tic-tac-toe, you can <b><i>Gobble</i></b> your opponent's pieces to claim the spot 
                        on the grid as your own!
                    </p>

                    <p>You can gobble up any smaller size Gobbler </p>
                    <p>It does not have to be the next size down </p>
                    <h4>The first player to align 3 pieces wins!</h4>
                    <p>So when you wish to move a piece try to remember what is under it!</p>

                    <h1 className="flex-box">
                        Enjoy the Game!! 
                        <img src={happyemoji} className="happy-image" alt="Happy" />
                    </h1>
                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-success' onClick={() => saveAndClose()}>
                        <b>Close And Play Offline</b>
                    </button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}
