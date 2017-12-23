const electron = require('electron')
const chokidar = require('chokidar')
const { app, BrowserWindow, Menu, ipcMain } = electron
const fs = require('fs')
const path = require('path')
const child = require('child_process').exec

let mainWindow
let mainFolder
let sender
let watcher

app.on('ready', () => {
    mainWindow = new BrowserWindow({ title: 'van Rossum Inventarisatie' })
    mainWindow.loadURL(`file://${__dirname}/src/index.html`)
})

ipcMain.on('watch-folder', (event, folder) => {
    watcher = undefined
    StartWatcher(folder[0], event.sender)
    mainFolder = folder[0]
    if (!fs.existsSync(`${mainFolder}/output`)) {
        fs.mkdirSync(`${mainFolder}/output`)
        fs.mkdirSync(`${mainFolder}/input`)
    } else {
        let files = fs.readdirSync(`${mainFolder}/output`)
        let zones = files.map(file => {
            return Number(file.slice(3, -4))
        })
        event.sender.send('existing-zones', zones)
    }
})

ipcMain.on('add-zone', (event, zone, file) => {
    console.log(`zone ${zone} added for ${file}`)
    let inputDest = `${mainFolder}/input/${('0000' + zone).slice(-4)}.txt`
    let outputDest = `${mainFolder}/output/stk${('0000' + zone).slice(-4)}.txt`
    let contents = fs.readFileSync(file, 'utf8')
    fs.writeFileSync(inputDest, contents)
    try {
        const transformedContents = contents
            .split('\r\n')
            .filter(e => e.length && !e.includes('\t9999'))
            .map((line, index) => {
                let [isbn, amount] = line.split('\t')
                if (amount > 9999 || isbn.toString().length > 13 || isbn.toString().length < 10) {
                    throw new Error('leesfout op lijn ' + (index + 1))
                }
                return [('0000' + zone).slice(-4), isbn, ('0000' + amount).slice(-4)].join(',')
            })
            .join('\r\n')
        fs.writeFileSync(outputDest, transformedContents)
        fs.unlinkSync(file)
        event.sender.send('file-transformed', `stk${('0000' + zone).slice(-4)}.txt`, zone)
    } catch (error) {
        let editor = process.platform.includes('win32') ? 'notepad': 'atom'
        child(`${editor} ${file}`)
        event.sender.send('io-error', error.message, inputDest)
    }
})


function StartWatcher(path, sender) {
    watcher = chokidar.watch(path, {
        ignored: [/[\/\\]\./, `${path}/input/*`, `${path}/output/*`],
        persistent: true
    })

    function onWatcherReady() {
        console.info('From here can you check for real changes, the initial scan has been completed.')
        sender.send('watcher-ready')
    }

    watcher
        .on('add', function (path) {
            console.log('File', path, 'has been added')
            sender.send('add-title', path)
        })
        .on('change', function (path) {
            console.log('File', path, 'has been changed')
            sender.send('add-title', path)
        })
        .on('ready', onWatcherReady)
}
