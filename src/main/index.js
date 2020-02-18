/* globals INCLUDE_RESOURCES_PATH */
import { app } from 'electron'
import download from 'url-download'
import fs from 'fs'
import unzipper from 'unzipper'
import path from 'path'
import db from 'electron-db'

let userData = path.join(process.env.APPDATA, 'nsmultitools');

if (!fs.existsSync(userData)){
  fs.mkdirSync(userData);
}

if (fs.existsSync(path.join(userData, 'config.json'))) {
  console.log('Does exist')
} else {
  let obj = new Object();

  obj.dark = true;
  //Creates config file
  db.createTable('config', userData, (succ, msg) => {
    //add content obj.dark = true;
    db.insertTableContent('config', obj, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    })
  })
}

if (!fs.existsSync(path.join(userData, 'TegraRcmSmash'))){
  fs.mkdirSync(path.join(userData, 'TegraRcmSmash'));
  
  download('https://cdn.discordapp.com/attachments/540906974766956554/674703383445372949/TegraRcmSmash.exe', path.join(userData, 'TegraRcmSmash'))
  .on('close', function () {
    console.log('Download TegraRCMSmash');
  });
}

if (!fs.existsSync(path.join(userData, 'apx_driver'))){
  fs.mkdirSync(path.join(userData, 'apx_driver'));
  
  download('https://cdn.discordapp.com/attachments/558777274976174083/674745878648586251/apx_driver.zip', path.join(userData, 'apx_driver'))
  .on('close',async function () {
    console.log('Download apx_driver.zip');
    await fs.createReadStream(path.join(userData, 'apx_driver' , 'apx_driver.zip'))
      .pipe(unzipper.Extract({ path: path.join(userData) }));
    });
}

if (!fs.existsSync(path.join(userData, 'ssnc'))){
  fs.mkdirSync(path.join(userData, 'ssnc'));
  
  download('https://cdn.discordapp.com/attachments/540906974766956554/676825630628642818/serials.json', path.join(userData, 'ssnc'))
  .on('close',async function () {
    console.log('Download ssnc.json');
  });
}


/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined // eslint-disable-line no-underscore-dangle
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH // eslint-disable-line no-unused-expressions
if (__resources === undefined) console.error('[Main-process]: Resources path is undefined')

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// Load here all startup windows
require('./mainWindow')
