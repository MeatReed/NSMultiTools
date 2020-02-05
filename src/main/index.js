/* globals INCLUDE_RESOURCES_PATH */
import { app } from 'electron'
import download from 'url-download'
import fs from 'fs'
import unzipper from 'unzipper'

if (!fs.existsSync(`${process.cwd()}/TegraRcmSmash/`)){
    fs.mkdirSync(`${process.cwd()}/TegraRcmSmash/`);
    
    download('https://cdn.discordapp.com/attachments/540906974766956554/674703383445372949/TegraRcmSmash.exe', `${process.cwd()}/TegraRcmSmash/`)
    .on('close', function () {
      console.log('Download TegraRCMSmash');
    });
}

if (!fs.existsSync(`${process.cwd()}/apx_driver/`)){
  fs.mkdirSync(`${process.cwd()}/apx_driver/`);
  
  download('https://cdn.discordapp.com/attachments/558777274976174083/674745878648586251/apx_driver.zip', `${process.cwd()}/apx_driver/`)
  .on('close',async function () {
    console.log('Download apx_driver.zip');
    await fs.createReadStream(`${process.cwd()}/apx_driver/apx_driver.zip`)
      .pipe(unzipper.Extract({ path: `${process.cwd()}/` }));
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
