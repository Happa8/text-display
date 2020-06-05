import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
const fs = require("fs");
import * as localshortcut from "electron-localshortcut";

let mainWindow: BrowserWindow | null;
let settingWindow: BrowserWindow | null;

const createWindow = async () => {
  var filedata: Array<string> = [];

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 200,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
  });
  mainWindow.loadURL(`file:///${__dirname}/index.html`);
  mainWindow.webContents.openDevTools;
  //mainWindow.setMenu(null);

  mainWindow.on("closed", () => {
    settingWindow.close();
    mainWindow = null;
  });

  settingWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });
  settingWindow.loadURL(`file:///${__dirname}/setting.html`);
  settingWindow.on("close", (event: any) => {
    event.preventDefault();
    settingWindow.hide();
  });

  ipcMain.on("setSetting", (event, arg) => {
    mainWindow.webContents.send("reload", "setting");
  });

  ipcMain.on("opensetting", (event, arg) => {
    console.log("showsetting");
    settingWindow.show();
  });
  ipcMain.on("filepath", (event, arg) => {
    console.log(arg);
    fs.readFile(arg, (error: any, data: any) => {
      if (error != null) {
        alert("file open error.");
        return;
      }
      filedata = data.toString().split("\n");
      console.log(filedata);

      event.reply("filedata", filedata);
    });
  });

  localshortcut.register(mainWindow, "CommandOrControl+Q", () => {
    settingWindow.close();
    settingWindow.destroy();
    settingWindow = null;
    mainWindow = null;
    app.quit();
  });
};

app.on("ready", createWindow);
