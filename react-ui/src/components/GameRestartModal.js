import React from 'react'
import Modal from 'react-bootstrap-modal'

import 'react-bootstrap-modal/lib/css/rbm-complete.css';

export default function GameRestartModal({ gameRestartModalShow, gameRestartRequestColor, playerNames, acceptGameRestartRequest, rejectGameRestartRequest }) {

    function acceptGameRestartRequestBtn() {
        acceptGameRestartRequest();
    }

    function rejectGameRestartRequestBtn() {
        rejectGameRestartRequest();
    }

    return (
        <div>

            <Modal
                show={gameRestartModalShow}
                backdrop="static"
                keyboard={false}
                aria-labelledby="GameRestartModalHeader">
                <Modal.Header closeButton>
                    <Modal.Title id='GameRestartModalHeader'>Game Restart Request!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h2>{playerNames[gameRestartRequestColor]} wants to Restart the Game!</h2>
                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-success' onClick={() => acceptGameRestartRequestBtn()}>
                        <b>Accept</b>
                    </button>
                    <button className='btn btn-default' onClick={() => rejectGameRestartRequestBtn()}>
                        <b>Reject</b>
                    </button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}
