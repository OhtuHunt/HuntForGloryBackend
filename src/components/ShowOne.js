import React from 'react'
import { Card, CardBody } from "react-simple-card";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import AdminToolsForQuest from './AdminToolsForQuest'
import { finishQuest } from '../reducers/questReducer'
import { get } from 'mongoose'
import { notify } from '../reducers/notificationReducer'

class ShowOne extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
    this.handleDelete = this.props.handleDelete
    this.handleDeactivate = this.props.handleDeactivate
    this.handleActivationCodeChange = this.props.handleActivationCodeChange
    this.handleStart = this.props.handleStart
    this.handleComplete = this.props.handleComplete
  }

  changeLoading = () => {
    this.setState({
      loading: this.state.loading === true ? false : true
    })
  }

  handleStartSubmit = async (event) => {
    event.preventDefault();
    this.changeLoading()
    await this.handleStart(this.props.quest)
    this.changeLoading()
  }

  handleCompleteSubmit = async (event) => {
    event.preventDefault()
    this.changeLoading()
    await this.handleComplete(this.props.quest)
    this.changeLoading()
  }

  loadPosition = async () => {
    try {
      const position = await this.getCurrentPosition()
      const { latitude, longitude } = position.coords
      return {
        lat: latitude,
        lng: longitude
      }
    } catch (error) {
      console.log(error)
    }
  }

  getCurrentPosition = (options = {}) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  handleLocationSubmit = async (event) => {
    event.preventDefault()
    this.changeLoading()

    const activationCode = await this.loadPosition()
	try {
		await this.props.finishQuest(this.props.quest.id, activationCode)
	} catch (exception) {
		this.props.notify("Wrong location!", 5000)
	}
  }

  ShowStartButton = () => {
    return (
      <div>
        {this.state.loading === true ?
          <div style={{ marginLeft: '49%' }}>
            <Spinner name="circle" fadeIn="none" />
          </div>
          :
          <div>
            <button className="startButton" onClick={this.handleStartSubmit}>
              Start quest
        </button>
          </div>
        }
      </div>
    )
  }

  ShowActivationCodeForm = () => {
    if (this.props.quest.type === 'location') {
      return (
        this.ShowLocationSubmitButton()
      )
    }

    return (
      <div className="activationCodeForm">
        <input
          type="text"
          onChange={this.handleActivationCodeChange}
          name="activationCode" />
        {this.state.loading === true ?
          <div style={{ marginLeft: '49%' }}>
            <Spinner name="circle" fadeIn="none" />
          </div>
          :
          <div>
            <button onClick={this.handleCompleteSubmit}> Complete </button>
          </div>
        }
      </div>
    )
  }

  ShowLocationSubmitButton = () => {
    return (
      <div className="activationCodeForm">
        <button onClick={this.handleLocationSubmit}> Complete location </button>
      </div>
    )
  }

  QuestInfo = () => {
    return (
      <div>
        <AdminToolsForQuest quest={this.props.quest} handleDelete={this.handleDelete} handleDeactivate={this.handleDeactivate} />
        <h1> {this.props.quest.name} </h1>
        {this.props.quest.course ? <h2>Course: {this.props.quest.course.name} </h2> : <div></div>}
        <div className="soloDesc" style={{ height: window.innerHeight * 0.4 }}>{this.props.quest.description}</div>
      </div>
    )
  }

  render() {
    if (this.props.quest === undefined) {
      return <div></div>
    }

    return (
      <div>
        <Card style={{ height: '100%', width: 'auto' }}>
          <CardBody>
            {this.QuestInfo()}
            {this.props.quest.finished === true ?
              <h2> Quest Completed! </h2>
              :
              <div> {this.props.quest.deactivated === true ?
                <div> This quest has been deactivated </div>
                :
                <div>{this.props.quest.started === true ?
                  <div>{this.ShowActivationCodeForm()}</div>
                  :
                  <div>{this.ShowStartButton()}</div>}</div>}</div>}
          </CardBody>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    activationCode: state.activationCode,
    loggedUser: state.loggedUser,
    quests: state.quests
  }
}

export default connect(mapStateToProps, { finishQuest, notify })(ShowOne)
