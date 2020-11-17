const express = require('express');
const router = express.Router({caseSensitive:true});
const { isEmpty } = require('lodash');
const Parser = require("fast-xml-parser").j2xParser;
const path = require('path'); 
const cmd =require('node-cmd');
const fse = require('fs-extra');
const apiUtils = require('../util');
const promise = require('bluebird');

/**
 * It parses the appliacnes and devices to xml and writes out into files. The path consists of the email and and the time.
 * It runs the dissect application, and sends the directory's name, the html file in string format, stdout and an error property,
 * if it is failed somehow, it will try to delete the created folder and it will send an error response.
 */
router.post('/', (req, res , next)=> {
  if(!checkConfigurationRequestBody(req)){
    console.log('ERROR: Bad req body: ', req.body);
    throw new Error('Bad request!');
  }
  const parser = new Parser(apiUtils.getParserOptions('$'));
  
  const userEmail = req.body.configuration.email;
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  const configTime = localISOTime.replace('T', '_').replace(/\..+/, '').replace(/:/g, '-');
  const baseDirPath= './configurations/users_configurations/'+ userEmail +'/'+ configTime;

  saveResourceFiles(req, parser, baseDirPath);

  const command =  'cd dissect-cf && java -cp target/dissect-cf-0.9.7-SNAPSHOT-jar-with-dependencies.jar '+
  'hu.u_szeged.inf.fog.simulator.demo.CLFogSimulation .'+ baseDirPath + '/appliances.xml '+
  '.'+ baseDirPath + '/devices.xml .'+ baseDirPath + '/' + ' > .'+ baseDirPath + '/run-log.txt  2>&1';

  const getAsync = promise.promisify(cmd.get, {
    multiArgs: true,
    context: cmd
  });

  getAsync(command)
    .then(() => sendResponseWithSavingStdOut(baseDirPath, res, configTime))
    .catch( err => sendExecutionError(err, baseDirPath, res));

});

/**
 * It sends the response object in json format which contains
 * the directory's name, the html file in string format, stdout and an error property.
 * @param {string} baseDirPath
 * @param {string} data
 * @param {Response} res
 * @param {string} directory
 */
function sendResponseWithSavingStdOut(baseDirPath, res, directory) {
  console.log('**** Configuration succeed! ****');
  const fileName = apiUtils.getLastCreatedHtmlFile(baseDirPath);
  const html = apiUtils.readFileSyncWithErrorHandling(baseDirPath + '/' + fileName);
  console.log('READ: file: ', baseDirPath + '/' + fileName);
  const log = apiUtils.readFileSyncWithErrorHandling(baseDirPath + '/run-log.txt');
  const stdOut = log.toString();
  const finalstdOut = stdOut.slice(stdOut.indexOf('~~Informations about the simulation:~~'));
  return res.status(201).json({directory, html: html.toString(), data: finalstdOut, err: null });
}

/**
 * It tries to remove the created directory and sends the error.
 * If it can not remove the direcotry, it will throw an error about it.
 * @param {Error} stderr
 * @param {string} baseDirPath
 * @param {Response} res
 */
function sendExecutionError(stderr, baseDirPath, res) {
  console.log('---- Configuration fail! ----');
  const errorMsg = stderr.toString().split('\n')[0].split(':')[1];
  try {
    fse.removeSync(baseDirPath);
    console.log('REMOVED: dir: ', baseDirPath);
  } catch {
    console.log('ERROR: Can not delete the dir: ', baseDirPath);
    throw new Error('Can not delete created folder, and can not create configuration files!');
  }
  return res.status(200).json({ html: 'Not created!', data: 'Error!', err: errorMsg });
}

/**
 * It wrties the files into the given directory. The data comes from the request' body.
 * @param {Request} req
 * @param {Parser} parser
 * @param {string} baseDirPath
 */
function saveResourceFiles(req, parser, baseDirPath) {
  const pureAppliances = req.body.configuration.appliances;
  const pureDevices = req.body.configuration.devices;
  const appliances = parser.parse(pureAppliances);
  const devices = parser.parse(pureDevices);

  const xmlFileHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  writeToFile(baseDirPath + '/appliances.xml', xmlFileHeader + appliances);
  console.log('WRITE: appliances > ', baseDirPath + '/appliances.xml');
  writeToFile(baseDirPath + '/devices.xml', xmlFileHeader + devices);
  console.log('WRITE: devices > ', baseDirPath + '/devices.xml');
}

/**
 * @param {string} filePath
 * @param {string} data
 */
function writeToFile(filePath, data) {
  try{
    fse.outputFileSync(filePath, data);
  }catch {
    console.log('ERROR: Can not write to file: ', filePath);
    throw new Error('Can not write to file!');
  }
}

/**
 * @param {Request} req
 */
function checkConfigurationRequestBody(req){
  return req.body && req.body.configuration && req.body.configuration.appliances
    && req.body.configuration.devices && !isEmpty(req.body.configuration.appliances)
    && !isEmpty(req.body.configuration.devices)
}

module.exports = router
