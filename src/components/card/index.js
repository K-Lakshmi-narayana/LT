import React from 'react'
import { Component } from "react"
import Modal from 'react-modal'

import BACKEND_URL from "../../config";
import './index.css'

class Card extends Component {
  state = { "tmodalIsOpen": false, "dmodalIsOpen": false, "testsModalIsOpen": false, "allTestsModalIsOpen": false, "tdmodalIsOpen": false }

  clickCard = () => {
    const { unqId, type } = this.props

    type !== "tracks" ? window.location.assign(`/test/${type}_${unqId}`) : this.clickTrack()

  }

  clickDel = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "track_id": unqId })
    }
    await fetch( `${BACKEND_URL}/del-track`, options)
      .then(() => {
        window.location.replace("/")
      })
  }

  clickTrack = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "track_id": unqId })
    }
    const response = await fetch(`${BACKEND_URL}/get-stopic-id`, options)
    if (response.ok) {
      const data = await response.json()
      window.location.assign(`/tracks/${unqId}/${data.id}`)
    } else {
      window.location.assign(`/tracks/${unqId}/createTopic`)
    }

  }

  clickEdit = () => {
    const { unqId } = this.props
    window.location.assign(`/edit-track/${unqId}`)
  }

  openModal = () => {
    const {com, type} = this.props
    if (type === "tracks"){
      this.openTModal()
    } else if (com === "home"){
      this.openTestsModal()
    } else {
      this.openAllTestsModal()
    }
  }

  openTestsModal = () => {
    this.setState({ "testsModalIsOpen": true })
  }
  closeTestsModal = () => {
    this.setState({ "testsModalIsOpen": false })
  }
  openAllTestsModal = () => {
    this.setState({ "allTestsModalIsOpen": true })
  }
  closeAllTestsModal = () => {
    this.setState({ "allTestsModalIsOpen": false })
  }
  openTModal = () => {
    this.setState({ "tmodalIsOpen": true })
  }
  closeTModal = () => {
    this.setState({ "tmodalIsOpen": false })
  }
  openDModal = () => {
    this.setState({ "modalIsOpen": false, "dmodalIsOpen": true })
  }
  closeDModal = () => {
    this.setState({ "dmodalIsOpen": false })
  }
  openTDModal = () => {
    this.setState({ "allTestsModalIsOpen": false, "tdmodalIsOpen": true })
  }
  closeTDModal = () => {
    this.setState({ "tdmodalIsOpen": false })
  }

  goLive = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "test_id": unqId })
    }
    const response = await fetch(`${BACKEND_URL}/go-live-test`, options)
    
    if (response.ok){
      window.location.replace("/")
    }else{
      alert("error")
    }
  }
  stLive = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "test_id": unqId })
    }
    const response = await fetch(`${BACKEND_URL}/stop-live-test`, options)
    
    if (response.ok){
      window.location.replace("/")
    }else{
      alert("error")
    }
  }

  submission = () => {
    const { unqId } = this.props
    window.location.assign(`/submissions/mcq/${unqId}`)
  }

  delTest = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "test_id": unqId })
    }
    const response = await fetch(`${BACKEND_URL}/del-test`, options)
    
    if (response.ok){
      alert("Test Deleted Successfully!")
      window.location.reload()
    }else{
      alert("error")
    }
  }

  render() {
    const { image, heading, desc, tier } = this.props
    const { tmodalIsOpen, dmodalIsOpen, testsModalIsOpen, allTestsModalIsOpen, tdmodalIsOpen } = this.state
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
         right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid lightgreen',
        borderRadius: '7px',
        backgroundColor: 'rgb(242, 255, 250)'
      }
    }
    return (
      <>
        <div className="card-container" onClick={tier < 3 ? this.openModal : this.clickCard}>
          <img className='card-img m-1' src={image} alt="card-img" />

          <h1 className='card-heading'>{heading}</h1>
          <p className='card-desc'>{desc.replace(/\\n/g, "\n")}</p>
        </div>
        <div>
          <Modal
            isOpen={tmodalIsOpen}
            onRequestClose={this.closeTModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Track Modal"
          >
            <h1 className="tr-modal-desc">What would you like to do...?</h1>
            <button className="tr-modal-btn tr-m-open-btn" onClick={this.clickTrack}>Open</button>
            <button className="tr-modal-btn tr-m-edit-btn" onClick={this.clickEdit}>Edit</button>
            <button className="tr-modal-btn tr-m-del-btn" onClick={this.openDModal}>Delete</button>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={dmodalIsOpen}
            onRequestClose={this.closeDModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Deletion Modal"
          >
            <h1 className="tr-modal-desc">Confirm Delete Track</h1>
            <button className="tr-modal-btn tr-m-del-btn tr-m-open-btn" onClick={this.clickDel}>Yes</button>
            <button className="tr-modal-btn" onClick={this.closeDModal}>No</button>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={testsModalIsOpen}
            onRequestClose={this.closeTestsModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Track Modal"
          >
            <h1 className="tr-modal-desc">What would you like to do...?</h1>
            <button className="tr-modal-btn tr-m-open-btn big-modal-btn" onClick={this.clickCard}>Open Test</button>
            <button className="tr-modal-btn tr-m-edit-btn big-modal-btn" onClick={this.submission}>Submissions</button>
            <button className="tr-modal-btn tr-m-del-btn big-modal-btn" onClick={this.stLive}>Stop Live</button>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={allTestsModalIsOpen}
            onRequestClose={this.closeAllTestsModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Track Modal"
          >
            <h1 className="tr-modal-desc">What would you like to do...?</h1>
            <button className="tr-modal-btn tr-m-open-btn big-modal-btn" onClick={this.goLive}>Go Live</button>
            <button className="tr-modal-btn tr-m-edit-btn big-modal-btn" onClick={this.submission}>Submissions</button>
            <button className="tr-modal-btn tr-m-del-btn big-modal-btn" onClick={this.openTDModal}>Delete Test</button>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={tdmodalIsOpen}
            onRequestClose={this.closeTDModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Test Deletion Modal"
          >
            <h1 className="tr-modal-desc">Confirm Delete Test</h1>
            <button className="tr-modal-btn tr-m-del-btn tr-m-open-btn" onClick={this.delTest}>Yes</button>
            <button className="tr-modal-btn" onClick={this.closeTDModal}>No</button>
          </Modal>
        </div>
      </>
    )
  }
}

export default Card