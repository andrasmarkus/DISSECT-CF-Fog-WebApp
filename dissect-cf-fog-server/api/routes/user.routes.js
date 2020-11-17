const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user.controller");
const express = require('express');
const router = express.Router({caseSensitive:true});
const parser = require('fast-xml-parser');
const { isEmpty } = require('lodash');
const apiUtils = require('../util');

const BASE_DIR = './configurations/users_configurations/';

/* Sets the response header. */
router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", [authJwt.verifyToken], controller.getAllUser);

/**
 * It sends the configuration deatils with 200 status.
 * If the email is missing, it will send 404 response with message.
 */
router.post("/configurations", [authJwt.verifyToken], (req, res , next)=> {
  if(isEmpty(req.body.email)){
    return res.status(404).send({message:'Bad request!'})
  }
  const userEmail = req.body.email;
  const dirs = apiUtils.readDirSyncWithErrorHandling(BASE_DIR+userEmail, true).filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const details = getConfigurationDetails(dirs, userEmail);
  return res.status(200).json(details);
});

router.post("/configurations/resultfile", [authJwt.verifyToken], (req, res , next)=> {
  return sendResult(req, res);
});

router.post("/configurations/download/appliances", [authJwt.verifyToken], (req, res , next)=> {
  return sendFile(req, res, 'appliances');
});

router.post("/configurations/download/devices", [authJwt.verifyToken], (req, res , next)=> {
  return sendFile(req, res, 'devices');
});

router.post("/configurations/download/diagram", [authJwt.verifyToken], (req, res , next)=> {
  return sendFile(req, res, 'diagram');
});

/**
 * Returns configuration details. Finds the user folder by the given email and counts all details in the drectory,
 * by reading files in sync.
 * @param {string[]} dirs - user's directories
 * @param {string} userEmail - it determines, which folder is
 */
function getConfigurationDetails(dirs, userEmail) {
  const details = [];
  for (const dirName of dirs) {
    const dateTime = getDateTimeStringFromDirName(dirName);
    const dirPath = BASE_DIR + userEmail + '/' + dirName;

    const appliacesData = apiUtils.readFileSyncWithErrorHandling(dirPath + '/appliances.xml');
    console.log('READ: file: ', dirPath + '/appliances.xml');
    const appliances = parser.parse(appliacesData.toString(), apiUtils.getParserOptions());
    let numOfClouds;
    let numOfFogs;
    if(appliances.appliances.appliance instanceof Array){
      numOfClouds = appliances.appliances.appliance.filter(node => node.name.startsWith('cloud')).length;
      numOfFogs = appliances.appliances.appliance.filter(node => node.name.startsWith('fog')).length;
    }else{
      numOfClouds = appliances.appliances.appliance.name.startsWith('cloud') ? 1 : 0;
      numOfFogs = appliances.appliances.appliance.name.startsWith('fog') ? 1 : 0;
    }

    const devicesData = apiUtils.readFileSyncWithErrorHandling(dirPath + '/devices.xml');
    console.log('READ: file: ', dirPath + '/devices.xml');
    const devices = parser.parse(devicesData.toString(), apiUtils.getParserOptions());

    details.push({
      directory: dirName,
      time: dateTime,
      clouds: numOfClouds,
      fogs: numOfFogs,
      devices: devices.devices.device instanceof Array ? devices.devices.device.length : 1
    });
  }
  return details;
}

/**
 * Parses the dirname to readable time string.
 * @param {string} dirName
 */
function getDateTimeStringFromDirName(dirName) {
  const stamp = dirName.split('_');
  const date = stamp[0];
  const time = stamp[1].replace(/-/g, ':').slice(0, 5);
  const dateTime = date + ' ' + time;
  return dateTime;
}

/**
 * Sends the specific file by given name, which can be downloaded on client side.
 * The request should contain the eamil and the directory.
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {string} fileName
 */
function sendFile(req, res, fileName) {
  checkResourceRequsetBody(req, res);
  const userEmail = req.body.email;
  const directory = req.body.directory;
  const dirPath = BASE_DIR + userEmail + '/' + directory;
  let filePath = dirPath + '/';
  if(fileName === 'diagram'){
    filePath += apiUtils.getLastCreatedHtmlFile(dirPath);
  }else{
    filePath += fileName +'.xml';
  }
  console.log('DOWNLOAD: ', filePath);
  return res.download(filePath);
}

/**
 * Sends the directory's name, the scanned html file in string format and also the error message with 200 status.
 * The request should contain the eamil and the directory.
 * @param {Request} req - request
 * @param {Response} res - response
 */
function sendResult(req, res) {
  checkResourceRequsetBody(req, res);
  const userEmail = req.body.email;
  const directory = req.body.directory;
  const dirPath = BASE_DIR + userEmail + '/' + directory;
  const lastFileName = apiUtils.getLastCreatedHtmlFile(dirPath);
  const htmlFilePath = dirPath + '/' + lastFileName;
  const stdOutPath = dirPath + '/' + 'run-log.txt';
  const htmlFile = apiUtils.readFileSyncWithErrorHandling(htmlFilePath);
  console.log('READ: file: ', htmlFilePath);
  const stdOut = apiUtils.readFileSyncWithErrorHandling(stdOutPath).toString();
  const finalStdout = stdOut.slice(stdOut.indexOf('~~Informations about the simulation:~~'));
  console.log('READ: file: ', stdOutPath);
  return res.status(200).json({directory, html: htmlFile.toString(), data: finalStdout, err:null});
}

/**
 * Checks the request contain the user's email and the selected directory, if not it will send 404 with a message.
 * @param {Request} req - request
 * @param {Response} res - response
 */
function checkResourceRequsetBody(req, res){
  if(isEmpty(req.body.email) || isEmpty(req.body.directory)){
    return res.status(404).send({message:'Bad request!'})
  }
}

module.exports = router;

