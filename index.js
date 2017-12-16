const electron = require('electron')
const chokidar = require('chokidar')
const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({ title: 'van Rossum Inventarisatie' })
    mainWindow.loadURL(`file://${__dirname}/main.html`)

    // const mainMenu = Menu.buildFromTemplate(menuTemplate)
    // Menu.setApplicationMenu(mainMenu)
})

// const menuTemplate = [
//     {
//         label: 'File',
//         submenu: [
//             {
//                 label: 'Afsluiten',
//                 accelerator: 'Ctrl+Q',
//                 click() {
//                     app.quit()
//                 }
//             }
//         ]
//     }
// ]

ipcMain.on('watch-folder', (event, folder) => {
    StartWatcher(folder[0])
})

ipcMain.on('add-zone', (event, arg) => {
    console.log(event, arg)
})

let watcher


function StartWatcher(path) {
    watcher = chokidar.watch(path, {
        ignored: /[\/\\]\./,
        persistent: true
    })

    function onWatcherReady() {
        console.info('From here can you check for real changes, the initial scan has been completed.')
        mainWindow.loadURL(`file://${__dirname}/klaarvoorscannen.html`)
    }

    watcher
        .on('add', function (path) {
            console.log('File', path, 'has been added')
            mainWindow.loadURL(`file://${__dirname}/kieszone.html`)
        })
        .on('addDir', function (path) {
            console.log('Directory', path, 'has been added')

        })
        .on('change', function (path) {
            console.log('File', path, 'has been changed')

        })
        .on('unlink', function (path) {
            console.log('File', path, 'has been removed')

        })
        .on('unlinkDir', function (path) {
            console.log('Directory', path, 'has been removed')

        })
        .on('error', function (error) {
            console.log('Error happened', error)

        })
        .on('ready', onWatcherReady)
}

// document.getElementById("start").addEventListener("click",function(e){
//     const {dialog} = require('electron').remote
//     dialog.showOpenDialog({
//         properties: ['openDirectory']
//     },function(path){
//         if(path){
//             StartWatcher(path[0])
//         }else {
//             console.log("No path selected")
//         }
//     })
// },false)

//  document.getElementById("stop").addEventListener("click",function(e){
//      if(!watcher){
//          console.log("You need to start first the watcher")
//      }else{
//          watcher.close()
//          document.getElementById("start").disabled = false
//          showInLogFlag = false
//          document.getElementById("messageLogger").innerHTML = "Nothing is being watched"
//      }
//  },false)

//  function resetLog(){
//      return document.getElementById("log-container").innerHTML = ""
//  }

//  function addLog(message,type){
//      var el = document.getElementById("log-container")
//      var newItem = document.createElement("LI")       // Create a <li> node
//      var textnode = document.createTextNode(message)  // Create a text node
//      if(type == "delete"){
//          newItem.style.color = "red"
//      }else if(type == "change"){
//          newItem.style.color = "blue"
//      }else{
//          newItem.style.color = "green"
//      }

//      newItem.appendChild(textnode)                    // Append the text to <li>
//      el.appendChild(newItem)
//  }