import React, { Component } from "react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import BACKEND_URL from "../../config";

import { ThreeDots } from 'react-loader-spinner'
import "./index.css"

class McqTest extends Component {
    state = {
        "timer": "",
        "min": "",
        "sec": "",
        "isLoading": true,
        "testDetails": [],
        "qDetails": {},
        "options": [],
        "submit": false
    }

    componentDidMount() {
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
        this.fetchTestDetails()
        this.startTimer()
    }

    startTimer = () => {
        const timer = setInterval(() => {
            const { min, sec } = this.state
            if (parseInt(min) === 0 && parseInt(sec) === 0) {
                this.endTest()
                clearInterval(timer)
            } else if (parseInt(sec) === 0) {
                this.setState(prev => ({ "min": parseInt(prev.min) - 1, "sec": "59" }))
            } else {
                this.setState(prev => ({ "sec": parseInt(prev.sec) - 1 }))
            }
        }, 1000);
        this.setState({ timer })
    }

    fetchTestDetails = async () => {
        const testId = window.location.pathname.split("/")[2]

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test_id: testId })
        };

        const response = await fetch(`${BACKEND_URL}/get-live-test-start-details`, options)
        const data = await response.json()
        const response1 = await fetch(`${BACKEND_URL}/get-mcq-question-details`, options)
        const data1 = await response1.json()
        this.setState({ "testDetails": data[0], "qDetails": data1[0], "isLoading": false, "min": data[0].minutes, "sec": data[0].seconds })
    }

    scrollPageNumsLeft = () => {
        document.getElementById("page-nums").scrollBy(-33, 0)
    }
    scrollPageNumsRight = () => {
        document.getElementById("page-nums").scrollBy(93, 0)
    }

    endTest = () => {
        console.log("test ended")
    }

    renderLoader = () => {
        return (
            <div className='d-flex justify-content-center m-5'>
                <ThreeDots
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="threedots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                />
            </div>
        )
    }

    renderTest = () => {
        const { testDetails, submit, qDetails, min, sec } = this.state
        const { name } = testDetails
        return (
            <div>
                <nav className="mcq-navbar sticky-top bg-light">
                    <div className='mcq-nav-header'>
                        <h1 className='mcq-name'>{name}</h1>
                        <div className='time-con'>
                            <p>{parseInt(min) < 10 && 0}{min} : {parseInt(sec) < 10 && 0}{sec}</p>
                        </div>
                        <button onClick={this.endTest} className='st-btn'>Submit Test</button>
                    </div>
                </nav>
                <div className="d-flex justify-content-center page-num-con">
                    <button className="page-btn" type="button" onClick={this.scrollPageNumsLeft}><FaAngleLeft /></button>
                    <div id="page-nums" className="d-flex page-numbers">
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                        <p>5</p>
                        <p>6</p>
                        <p>7</p>
                        <p>8</p>
                        <p>9</p>
                    </div>
                    <button className="page-btn" type="button" onClick={this.scrollPageNumsRight}><FaAngleRight /></button>
                </div>
                <div>
                    <p>Who is the prime minister of india..?</p>
                </div>
            </div>
        )
    }

    render() {
        const { isLoading } = this.state

        return (
            isLoading ? this.renderLoader() : this.renderTest()

        )
    }
}

export default McqTest