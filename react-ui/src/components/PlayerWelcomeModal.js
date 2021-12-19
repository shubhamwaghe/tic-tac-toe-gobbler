import React, { Component } from 'react'
import Modal from 'react-bootstrap-modal'

import 'react-bootstrap-modal/lib/css/rbm-complete.css';

export default class PlayerWelcomeModal extends Component {

  constructor(props) {
      super(props);
      this.state = {
        open: true
    };
}

closeModal() {
    this.setState({ open: false });    
}

saveAndClose() {
    this.setState({ open: false })    
}

render() {

    return (
        <div>

            <Modal large
                show={this.state.open}
                aria-labelledby="ModalHeader">
                <Modal.Header closeButton>
                    <Modal.Title id='ModalHeader'>Welcome!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Some Content here</p>
                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-success' onClick={() => this.saveAndClose()}>
                        Save
                    </button>
                    <Modal.Dismiss className='btn btn-default' onClick={() => this.closeModal()}>Close</Modal.Dismiss>

                </Modal.Footer>
            </Modal>
        </div>
        )
    }
}
