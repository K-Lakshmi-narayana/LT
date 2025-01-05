import React from 'react'
import { Component } from "react"
import { ThreeDots } from 'react-loader-spinner'
import Header from '../header'
import Card from "../card"

import mcq from '../../imgs/mcq.jpeg'
import coding from '../../imgs/coding.jpeg'

import BACKEND_URL from './config';
import './index.css'

class AllTests extends Component {
    state = { "testDetails": [], "isLoading": true, "tier": "", "mcqSearch": "", "codingSearch": "" }

    componentDidMount() {
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
        this.checkTier()
        this.fetchAllDetails()
    }

    checkTier = async () => {
        const token = window.localStorage.getItem("token");
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        }
        const response = await fetch(`${BACKEND_URL}/get-tier`, options)
        const data = await response.json()
        if (data.tier === 3) {
            window.location.replace("/")
        }
        this.setState({"tier": data.tier})
    }

    fetchAllDetails = async () => {
        const response = await fetch(`${BACKEND_URL}/get-details`)
        const data = await response.json()
        this.setState({ "testDetails": data[0], "isLoading": false })
    }

    renderLoader = () => {
        return (
            <div className='d-flex justify-content-center m-5'>
                <ThreeDots
                    height="80vh"
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

    searchMCQ = e => {
        this.setState({"mcqSearch": e.target.value})
    }
    searchCoding = e => {
        this.setState({"codingSearch": e.target.value})
    }

    renderMCQs = () => {
        const { testDetails, tier, mcqSearch } = this.state
        const elements = []
        for (let i = 0; i < testDetails.length; i++) {
            const testObj = testDetails[i]
            testObj.type === "mcq" && testObj.name.toLowerCase().includes(mcqSearch.toLowerCase()) && elements.push(
                <Card com={"all-tests"} tier={tier} image={mcq} type={testObj.type} heading={testObj.name} desc={testObj.description} unqId={testObj.id} key={testObj.id} />
            )
        }
        if (elements.length === 0){
            return <div className='d-flex w-100 justify-content-center'><h1 className="all-tests-head">No MCQ Tests...</h1></div>
        }
        return elements
    }

    renderCoding = () => {
        const { testDetails, tier, codingSearch } = this.state
        const elements = []
        for (let i = 0; i < testDetails.length; i++) {
            const testObj = testDetails[i]
            testObj.type === "coding" && testObj.name.toLowerCase().includes(codingSearch.toLowerCase()) && elements.push(
                <Card com={"all-tests"} tier={tier} image={coding} type={testObj.type} heading={testObj.name} desc={testObj.description} unqId={testObj.id} key={testObj.id} />
            )
        }
        if (elements.length === 0){
            return <div className='d-flex w-100 justify-content-center'><h1 className="all-tests-head">No Coding Tests...</h1></div>
        }
        return elements
    }

    render() {
        const { isLoading } = this.state
        return (
            isLoading ? this.renderLoader() :
                <>
                    <Header />
                    <div className="all-tests-head-con">
                        <h1 className="all-tests-head">MCQ Tests</h1>
                        <input onChange={this.searchMCQ} type='text' placeholder='Search by Title...' className='search-input'/>
                    </div>
                    <div className="d-flex all-tests-cards-container">
                        {this.renderMCQs()}
                    </div>
                    <div className="all-tests-head-con">
                        <h1 className="all-tests-head">Coding Tests</h1>
                        <input onChange={this.searchCoding} type='text' placeholder='Search by Title...' className='search-input'/>
                    </div>
                    <div className="d-flex all-tests-cards-container">
                        {this.renderCoding()}
                    </div>

                </>
        )
    }
}

export default AllTests