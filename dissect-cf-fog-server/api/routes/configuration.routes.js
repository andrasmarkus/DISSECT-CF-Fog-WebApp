const express = require('express');
const router = express.Router({caseSensitive:true});
const fs = require('fs');
const { isEmpty } = require('lodash');
const Parser = require("fast-xml-parser").j2xParser;
const path = require('path'); 
const cmd =require('node-cmd');
const fse = require('fs-extra');
const apiUtils = require('../util');

router.post('/', (req, res , next)=> {
  if(!checkConfigurationRequestBody(req)){
    throw new Error('Bad request!');
  }
  const parser = new Parser(apiUtils.getParserOptions('$'));
  
  const userEmail = req.body.configuration.email;
  const configTime = new Date().toISOString().replace('T', '_').replace(/\..+/, '').replace(/:/g, '-');
  const baseDirPath= './configurations/users_configurations/'+ userEmail +'/'+ configTime;

  saveResourceFiles(req, parser, baseDirPath);

  const command =  'cd dissect-cf && java -cp target/dissect-cf-0.9.7-SNAPSHOT-jar-with-dependencies.jar '+
  'hu.u_szeged.inf.fog.simulator.demo.CLFogSimulation .'+ baseDirPath + '/appliances.xml '+
  '.'+ baseDirPath + '/devices.xml .'+ baseDirPath + '/';
  const commandDemo =  'cd dissect-cf && java -cp target/dissect-cf-0.9.7-SNAPSHOT-jar-with-dependencies.jar '+
  'hu.u_szeged.inf.fog.simulator.demo.CLFogSimulation ../configurations/appliances_demo.xml '+
  '../configurations/devices_demo.xml .'+ baseDirPath + '/' ;

  cmd.get(
    command,
    (err, data, stderr) =>{
        if(err || stderr){
          return sendExecutionError(stderr, baseDirPath, res);
        }
        sendResponseWithSavingStdOut(baseDirPath, data, res, configTime);
    });

});

function sendResponseWithSavingStdOut(baseDirPath, data, res, directory) {
  const fileName = apiUtils.getLastCreatedHtmlFile(baseDirPath);
  const html = apiUtils.readFileSyncWithErrorHandling(baseDirPath + '/' + fileName);
  const stdOut = data.toString();
  const finalstdOut = stdOut.slice(stdOut.indexOf('~~Informations about the simulation:~~'));
  fse.outputFile(baseDirPath + '/stdout.txt', finalstdOut, (writeErr) => {
    if (writeErr)
      return console.log(writeErr);
    console.log('stdout > stdout.txt');
    return res.status(201).json({directory, html: html.toString(), data: finalstdOut, err: null });
  });
}

function sendExecutionError(stderr, baseDirPath, res) {
  const errorMsg = stderr.toString().split('\n')[0].split(':')[1];
  try {
    fse.removeSync(baseDirPath);
  } catch {
    throw new Error('Can not delete created folder, and can not create configuration files!');
  }
  return res.status(200).json({ html: 'Not created!', data: 'Error!', err: errorMsg });
}

function saveResourceFiles(req, parser, baseDirPath) {
  const pureAppliances = req.body.configuration.appliances;
  const pureDevices = req.body.configuration.devices;
  const appliances = parser.parse(pureAppliances);
  const devices = parser.parse(pureDevices);

  const xmlFileHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  writeToFile(baseDirPath + '/appliances.xml', xmlFileHeader + appliances);
  console.log('appliances > appliances.xml');
  writeToFile(baseDirPath + '/devices.xml', xmlFileHeader + devices);
  console.log('devices > devices.xml');
}

function writeToFile(filePath, data) {
  try{
    fse.outputFileSync(filePath, data);
  }catch {
    throw new Error('Can not write to file!');
  }
}

function checkConfigurationRequestBody(req){
  return req.body && req.body.configuration && req.body.configuration.appliances
    && req.body.configuration.devices && !isEmpty(req.body.configuration.appliances)
    && !isEmpty(req.body.configuration.devices)
}

module.exports = router
