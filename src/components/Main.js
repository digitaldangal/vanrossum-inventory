import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer, remote } from 'electron'
import { Redirect } from 'react-router-dom'

import WatchFolder from './WatchFolder'

class Main extends Component {
    redirect = () => {
        if (this.props.ready) {
            return <Redirect to="/scan" />
        } else {
            return <div/>
        }
    }

    render () {
        return (
            <div className="main">
                <WatchFolder/>
                {this.props.children}
                {this.redirect()}
            </div>
        )
    }
}

function mapStateToThis (state) {
    return {
        ready: state.path
    }
}

export default connect(mapStateToThis)(Main)
