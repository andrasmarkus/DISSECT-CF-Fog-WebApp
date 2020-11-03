const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user.controller");
const express = require('express');
const router = express.Router({caseSensitive:true});
const fs = require('fs');
const parser = require('fast-xml-parser');
const { isEmpty } = require('lodash');
const apiUtils = require('../util');

router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const BASE_DIR = './configurations/users_configurations/';

router.get("/", [authJwt.verifyToken], controller.getAllUser);

router.post("/configurations",/*  [authJwt.verifyToken], */ (req, res , next)=> {
  if(isEmpty(req.body.email)){
    return res.status(404).send({message:'Bad request!'})
  }
  const userEmail = req.body.email;
  const dirs = apiUtils.readDirSyncWithErrorHandling(BASE_DIR+userEmail, true).filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const details = getConfigurationDetails(dirs, userEmail, res);
  return res.status(200).json(details);
});

router.post("/configurations/resultfile",/*  [authJwt.verifyToken], */ (req, res , next)=> {
  return sendResult(req, res);
});

router.post("/configurations/appliances",/*  [authJwt.verifyToken], */ (req, res , next)=> {
  return sendXmlResource(req, res, 'appliances');
});

router.post("/configurations/devices",/*  [authJwt.verifyToken], */ (req, res , next)=> {
  return sendXmlResource(req, res, 'devices');
});


function getConfigurationDetails(dirs, userEmail, res) {
  const details = [];
  for (const dirName of dirs) {
    const dateTime = getDateTimeStringFromDirName(dirName);
    const dirPath = BASE_DIR + userEmail + '/' + dirName;

    const appliacesData = apiUtils.readFileSyncWithErrorHandling(dirPath + '/appliances.xml');
    const appliances = parser.parse(appliacesData.toString(), apiUtils.getParserOptions());
    let numOfClouds;
    let numOfFogs;
    if(appliances.appliances.appliance.length){
      numOfClouds = appliances.appliances.appliance.filter(node => node.name.startsWith('cloud')).length;
      numOfFogs = appliances.appliances.appliance.filter(node => node.name.startsWith('fog')).length;
    }else{
      numOfClouds = appliances.appliances.appliance.name.startsWith('cloud') ? 1 : 0;
      numOfFogs = appliances.appliances.appliance.name.startsWith('fog') ? 1 : 0;
    }

    const devicesData = apiUtils.readFileSyncWithErrorHandling(dirPath + '/devices.xml');

    const devices = parser.parse(devicesData.toString(), apiUtils.getParserOptions());

    details.push({
      directory: dirName,
      time: dateTime,
      clouds: numOfClouds,
      fogs: numOfFogs,
      devices: devices.devices.device.length ? devices.devices.device.length : 1
    });
  }
  return details;
}

function getDateTimeStringFromDirName(dirName) {
  const stamp = dirName.split('_');
  const date = stamp[0];
  const time = stamp[1].replace(/-/g, ':').slice(0, 5);
  const dateTime = date + ' ' + time;
  return dateTime;
}

function sendXmlResource(req, res, fileName) {
  checkResourceRequsetBody(req, res);
  const userEmail = req.body.email;
  const directory = req.body.directory;
  const dirPath = BASE_DIR + userEmail + '/' + directory;
  const filePath = dirPath + '/' + fileName +'.xml';
  const file = apiUtils.readFileSyncWithErrorHandling(filePath);
  return res.status(200).json({ file: file.toString() });
}

function sendResult(req, res) {
  checkResourceRequsetBody(req, res);
  const userEmail = req.body.email;
  const directory = req.body.directory;
  const dirPath = BASE_DIR + userEmail + '/' + directory;
  const lastFileName = apiUtils.getLastCreatedHtmlFile(dirPath);
  const htmlFilePath = dirPath + '/' + lastFileName;
  const stdOutPath = dirPath + '/' + 'stdout.txt';
  const htmlFile = apiUtils.readFileSyncWithErrorHandling(htmlFilePath);
  const stdOut = apiUtils.readFileSyncWithErrorHandling(stdOutPath);
  return res.status(200).json({ html: htmlFile.toString(), data: stdOut.toString(), err:null});
}

function checkResourceRequsetBody(req, res){
  if(isEmpty(req.body.email) || isEmpty(req.body.directory)){
    return res.status(404).send({message:'Bad request!'})
  }
}

module.exports = router;

