const electron = require('electron');
const { app,BrowserWindow,Menu,ipcMain } = electron;
let mainWindow;
let addWindow;
app.on('ready',() => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('close',() => {app.quit()});
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
  ipcMain.on("senTodo",(event,data) => {
    addWindow.close();
    mainWindow.webContents.send("createTodo",data);
  })

})

function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 500,
    height: 400,
    title: "Add new to do"
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  //free memory
  addWindow.on("close",() => addWindow = null);
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New todo',
        click(){
          createAddWindow();
        },
        accelerator:process.platform === 'darwin'?'Command+N':'Ctrl+N'
      },
      {
        label:'Quit',
        click(){
        app.quit();
      },
        accelerator:process.platform === 'darwin'?'Command+Q':'Ctrl+Q'
      }
    ]
  }
]

if(process.platform === 'darwin'){
  menuTemplate.unshift({label:'qqq'})
}

if(process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label: 'View',
    submenu:[
      { role : 'reload'},
      {
        label: 'Toggle developer tool',
        accelerator:"Command+I",
        click(item,focusWindow){
          focusWindow.toggleDevTools();
        }
      }
    ]
  });
}
