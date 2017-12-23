import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import { cancel } from '../actions'

import WatchFolder from './WatchFolder'
import ChooseZone from './ChooseZone'

class Scan extends Component {
    fileFinder = () => {
        console.log(this.props)
        if (this.props.success) {
            return (
                <div>
                    <WatchFolder />
                    <h1>Gelukt! {this.props.success} opgeslagen</h1>
                    <h1>Scan een volgend bestand of sluit af</h1>
                </div>
            ) 
        } else if (this.props.error) {
            return (
                <div>
                    <WatchFolder />
                    <h1>Oeps! {this.props.error}</h1>
                    <h2>{this.props.file} bevat fout(en), bewerk het bestand en sla het op. Het wordt dan vanzelf opnieuw geprobeerd.</h2>
                    <button onClick={this.props.cancelEdit}>Annuleren</button>
                </div>
            ) 
        } else if (this.props.path && this.props.file) {
            return (
                <div>
                    <WatchFolder />
                    <h1>Bestand gevonden: {this.props.file}</h1>
                    <ChooseZone />
                </div>
            )
        } else {
            return (
                <div>
                    <WatchFolder />
                    <h1>Klaar om te scannen</h1>
                </div>
            )
        }
    }
    render () {
        return (
            <div className="app">
                {this.fileFinder()}
                {this.props.children}
            </div>
        )
    }
}

function mapStateToThis (state) {
    return {
        path: state.path,
        file: state.file,
        success: state.success,
        error: state.error
    }
}

function mapDispatchToThis (dispatch) {
    return {
        cancelEdit: () => {
            dispatch(cancel())
        }
    }
}

export default connect(mapStateToThis, mapDispatchToThis)(Scan)