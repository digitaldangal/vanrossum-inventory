import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './reducers'

import Main from './components/Main'
import Scan from './components/Scan'

ReactDOM.render(
    <Provider store={store}>
        <Router>
        <div className="app">
            <Switch>
                <Route path="/scan" component={Scan} />
                <Route path="/" component={Main} />
            </Switch>
        </div>
        </Router>
    </Provider>,
    document.getElementById('root')
)
