import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addZone } from '../actions'
import { ipcRenderer } from 'electron'
import { withRouter } from 'react-router'

class ChooseZone extends Component {
    constructor(props) {
        super(props)
        this.state = {zone: ''}
    
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(event) {
        this.setState({zone: event.target.value})
    }
    
    handleSubmit(event) {
        event.preventDefault()
        if (this.state.zone > 9999 || this.state.zone < 1) {
            alert('zonenummer ongeldig')
        } else if (this.props.zones.includes(Number(this.state.zone))) {
            alert(`zone ${this.state.zone} bestaat al!`)
        } else {
            ipcRenderer.send('add-zone', this.state.zone, this.props.file)
            this.props.setZone(this.state.zone)
        }
    }

    render () {
        return (
            <div className="choosezone">
                <h1>Kiez Zone</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="number" value={this.state.zone} onChange={this.handleChange}/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}

function mapStateToThis (state) {
    return {
        zones: state.zones,
        file: state.file
    }
}

function mapDispatchToThis (dispatch) {
    return {
        setZone: (zone) => {
            dispatch(addZone(Number(zone)))
        }
    }
}

export default withRouter(
    connect(mapStateToThis, mapDispatchToThis)(ChooseZone)
)