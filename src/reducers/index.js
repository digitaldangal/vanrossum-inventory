import { ADD_FILE, ADD_ZONE, CANCEL, CHOOSE_PATH, EXISTING_ZONES, FILE_TRANSFORMED, IO_ERROR } from '../actions/types'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import createIpc, { send } from 'redux-electron-ipc'
import { addFile, fileTransformed, ioError, existingZones } from '../actions'

const initialState = {
    path: undefined,
    zones: [],
    file: undefined,
    success: '',
    error: ''
}

function reducer (state = initialState, action) {
    switch (action.type) {
        case ADD_FILE:
            return {
                ...state,
                file: state.path && action.payload.file,
                error: '',
                success: ''
            }
        case ADD_ZONE:
            return {
                ...state,
                zones: state.zones.concat(action.payload.zone),
                success: '',
                error: ''
            }
        case CANCEL:
            return {
                ...state,
                error: '',
                file: undefined
            }
        case CHOOSE_PATH:
            return {
                ...state,
                path: action.payload.path,
                success: '',
                error: ''
            }
        case EXISTING_ZONES:
            return {
                ...state,
                zones: [...new Set(state.zones.concat(action.payload.zones.map(e => +e)))]
            }
        case FILE_TRANSFORMED:
            return {
                ...state,
                zones: state.zones.concat(action.payload.zone).map(e => +e),
                file: undefined,
                success: action.payload.file,
                error: ''
            }
        case IO_ERROR:
            return {
                ...state,
                error: action.payload.error,
                file: action.payload.file
            }
        default: 
            return state
    }
}

const ipc = createIpc({
    'add-title': addFile,
    'file-transformed': fileTransformed,
    'io-error': ioError,
    'existing-zones': existingZones
})



const store = createStore(reducer, initialState, applyMiddleware(ipc))

export default store