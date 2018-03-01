import React from 'react'
import questService from '../services/quests'
import Toggleable from './Toggleable'
import "../index.css";

const QuestForm = ({ onSubmit, handleChange, name, description, points, type, activationCode }) => {
    return (
        <div className="createform">
            <h2>create new quest</h2>

            <form  onSubmit={onSubmit}>
                <div>
                    <p>name</p>
                <input 
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <p>description</p>
                    <input
                        type="textarea"
                        name="description"
                        value={description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <p>points</p>
                    <input
                        type="number"
                        name="points"
                        value={points}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <p>type</p>
                    <input
                        type="text"
                        name="type"
                        value={type}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <p>activationcode</p>
                    <input
                        type="text"
                        name="activationCode"
                        value={activationCode}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

class NewQuest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            description: "",
            points: 0,
            type: "",
            activationCode: ""
        }
        this.createNewQuest = props.createNewQuest
    }

    formVisibility = () => {
        this.setState({ visible: !this.state.visible })
    }

    addQuest = async (event) => {
        event.preventDefault()
        this.questForm.toggleVisibility()
        const questObject = {
            name: this.state.name,
            description: this.state.description,
            points: this.state.points,
            type: this.state.type,
            activationCode: this.state.activationCode
        }

        const newQuest = await questService.create(questObject)
        this.createNewQuest(newQuest)
        this.setState({
            name: "",
            description: "",
            points: "",
            type: "",
            activationCode: ""
        })
    }

    handleQuestChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }


    render() {
        return (
            <div>
                <Toggleable buttonLabel="new quest" ref={component => this.questForm = component}>
                    <QuestForm
                        onSubmit={this.addQuest}
                        handleChange={this.handleQuestChange}
                        name={this.state.name}
                        description={this.state.description}
                        points={this.state.points}
                        type={this.state.type}
                        activationCode={this.state.activationCode}
                    />
                </Toggleable>
            </div>
        )


    }
}

export default NewQuest