import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer, remote } from 'electron'
import { choosePath } from '../actions'
import { Redirect } from 'react-router-dom'

class WatchFolder extends Component {
    clickHandler = () => {
        remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (path) => {
            if (path) {
                ipcRenderer.send('watch-folder', path)
                ipcRenderer.on('watcher-ready', () => {
                    this.props.selectFolder(path)
                })
            }else {
                console.log("No path selected")
            }
        })
    }

    show = () => {
        if (this.props.path) {
            return (
                <div>
                    <p>Bestanden die in {this.props.path} terechtkomen zullen worden omgezet</p>
                    {this.props.children}
                </div>
            )
        } else {
            return (
                <div>
                    <p>Selecteer map waar bestanden terecht komen:</p>
                    <button onClick={this.clickHandler}>Kies map</button>
                    {this.props.children}
                </div>
            )
        }
    }

    render () {
        return (
            <div className="watchfolder">
                { this.show() }
            </div>
        )
    }
}

function mapStateToThis (state) {
    return {
        path: state.path
    }
}

function mapDispatchToThis (dispatch) {
    return {
        selectFolder: (path) => {
            dispatch(choosePath(path[0]))
        }
    }
}

export default connect(mapStateToThis, mapDispatchToThis)(WatchFolder)
