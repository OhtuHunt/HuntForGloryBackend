import React from 'react'
import Toggleable from './Toggleable'
import '../index.css'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { editQuest } from '../reducers/questReducer'
import validateQuest from '../validators/questValidator'
import { showErrors } from '../reducers/errorMessageReducer'


const QuestForm = ({ handleSubmit, handleChange, name, description, points, type, course, activationCode, deactivated, latitude, longitude, radius }) => {

    const handleEditClick = (event) => {
        event.preventDefault()
        let editedQuest = {}
        if (type !== 'location') {
            editedQuest = {
                name: event.target.name.value,
                description: event.target.description.value,
                points: event.target.points.value,
                type: type,
                course: course,
                activationCode: event.target.activationCode.value
            }
        } else {
            editedQuest = {
                name: event.target.name.value,
                description: event.target.description.value,
                points: event.target.points.value,
                type: type,
                course: course,
                activationCode: {
                    lat: event.target.latitude.value,
                    lng: event.target.longitude.value,
                    radius: event.target.radius.value
                }
            }
        }
        handleSubmit(editedQuest)
    }

    return (
        <div className='createform'>
            <h2>edit quest</h2>

            <form onSubmit={handleEditClick}>
                <div>
                    <p>name</p>
                    <input
                        type='text'
                        name='name'
                        value={name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <p>description</p>
                    <input
                        type='textarea'
                        name='description'
                        value={description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <p>points</p>
                    <input
                        type='number'
                        name='points'
                        value={points}
                        onChange={handleChange}
                    />
                </div>
                {type !== 'location' ?
                    <div>
                        <p>activationcode</p>
                        <input
                            type='text'
                            name='activationCode'
                            value={activationCode}
                            onChange={handleChange}
                        />
                    </div>
                    :
                    <div>
                        <p>Latitude</p>
                        <input
                            type='text'
                            name='latitude'
                            value={latitude}
                            onChange={handleChange}
                        />
                        <p>Longitude</p>
                        <input
                            type='text'
                            name='longitude'
                            value={longitude}
                            onChange={handleChange}
                        />
                        <p>Radius</p>
                        <input
                            type='text'
                            name='radius'
                            value={radius}
                            onChange={handleChange}
                        />
                    </div>
                }
                <button type='submit'>edit</button>
            </form>
        </div>
    )
}

class EditQuest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.quest.name,
            description: props.quest.description,
            points: Number(props.quest.points),
            type: props.quest.type,
            activationCode: props.quest.activationCode,
            deactivated: props.quest.deactivated,
            course: props.quest.course.id,
            id: props.quest.id,
            latitude: props.quest.activationCode.lat,
            longitude: props.quest.activationCode.lng,
            radius: props.quest.activationCode.radius
        }
    }

    formVisibility = () => {
        this.setState({ visible: !this.state.visible })
    }

    handleSubmit = async (editedQuest) => {
        this.questForm.toggleVisibility()
        this.setState({
            name: editedQuest.name,
            description: editedQuest.description,
            points: editedQuest.points,
            type: editedQuest.type,
            course: editedQuest.course,
            activationCode: editedQuest.activationCode,
            latitude: editedQuest.activationCode.lat,
            longitude: editedQuest.activationCode.lng,
            radius: editedQuest.activationCode.radius
        })
        const editedWithDeactivation = { ...editedQuest, deactivated: this.props.quest.deactivated }

        let errors = validateQuest(editedWithDeactivation)

        if (errors.length > 0) {
            this.props.showErrors(errors, 5000)
            window.scrollTo(0, 0)
            return
        }

        await this.props.editQuest(editedWithDeactivation, this.props.quest.id)
        window.scrollTo(0, 0)
        this.props.notify(`${editedQuest.name} has been edited.`, 4000)
    }

    handleQuestChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }


    render() {
        if (this.state.id !== this.props.quest.id) {
            this.setState({
                name: this.props.quest.name,
                description: this.props.quest.description,
                points: this.props.quest.points,
                type: this.props.quest.type,
                course: this.props.quest.course.id,
                activationCode: this.props.quest.activationCode,
                deactivated: this.props.quest.deactivated,
                id: this.props.quest.id,
                latitude: this.props.quest.activationCode.lat,
                longitude: this.props.quest.activationCode.lng,
                radius: this.props.quest.activationCode.radius
            })
            this.questForm.visibilityToFalse()
        }
        return (
            <div>
                <Toggleable buttonLabel='edit quest' cancelButtonLabel='Cancel' ref={component => this.questForm = component}>
                    <QuestForm
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleQuestChange}
                        name={this.state.name}
                        description={this.state.description}
                        points={this.state.points}
                        type={this.state.type}
                        course={this.state.course}
                        activationCode={this.state.activationCode}
                        latitude={this.state.latitude}
                        longitude={this.state.longitude}
                        radius={this.state.radius}
                    />
                </Toggleable>
            </div>
        )


    }
}

export default connect(null,
    { editQuest, notify, showErrors })(EditQuest)