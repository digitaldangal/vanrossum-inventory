import { ADD_FILE, ADD_ZONE, CANCEL, CHOOSE_PATH, EXISTING_ZONES, IO_ERROR, FILE_TRANSFORMED } from './types'

export function addZone (zone) {
    return {
        type: ADD_ZONE,
        payload: { zone }
    }
}

export function choosePath (path) {
    return {
        type: CHOOSE_PATH,
        payload: { path }
    }
}

export function addFile (event, file) {
    return {
        type: ADD_FILE,
        payload: { file }
    }
}

export function cancel () {
    return {
        type: CANCEL
    }
}

export function fileTransformed (event, file) {
    return {
        type: FILE_TRANSFORMED,
        payload: { file }
    }
}

export function ioError (event, error, file) {
    return {
        type: IO_ERROR,
        payload: { error, file }
    }
}

export function existingZones (event, zones) {
    return {
        type: EXISTING_ZONES,
        payload: { zones }
    }
}