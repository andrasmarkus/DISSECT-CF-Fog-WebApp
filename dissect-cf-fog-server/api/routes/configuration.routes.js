const express = require('express');
const authJwt = require("../../middleware").authJwt;
const router = express.Router({caseSensitive:true});
const { isEmpty, filter } = require('lodash');
const Parser = require("fast-xml-parser").j2xParser;
const fse = require('fs-extra');
const apiUtils = require('../util');
const child = require('child_process');
const { storage } = require('../../models/firestore')


/**
 * It parses the appliacnes and devices to xml and writes out into files. The path consists of the email and and the time.
 * It runs the dissect application, and sends the directory's name, the html file in string format, stdout and an error property,
 * if it is failed somehow, it will try to delete the created folder and it will send an error response.
 */
router.post('/', /* [authJwt.verifyToken],  */(req, res , next)=> {
  if(!checkConfigurationRequestBody(req)){
    console.log('ERROR: Bad req body: ', req.body);
    throw new Error('Bad request!');
  }
  const userEmail = req.body.configuration.email;

  let tzoffset;
  if(req.body.configuration.tzOffset !== undefined){
    tzoffset = req.body.configuration.tzOffset;
  }else{
    const tzOffsetInMin = new Date().getTimezoneOffset();
    tzoffset = tzOffsetInMin !== 0 ? tzOffsetInMin / 60 : 0;
    tzoffset *= -1;
  }
  tzoffset *= 3600000;
  const localISOTime = (new Date(Date.now() + tzoffset)).toISOString().slice(0, -1);
  const configTime = localISOTime.replace('T', '_').replace(/\..+/, '').replace(/:/g, '-');
  // const baseDirPath= `./configurations/users_configurations/${userEmail}/${configTime}`;
  const baseDirPath= `configurations/users_configurations/${userEmail}/${configTime}`;
  saveResourceFiles(req, baseDirPath);

  const command =  `cd dissect-cf && java -cp `+
  `target/dissect-cf-0.9.7-SNAPSHOT-jar-with-dependencies.jar `+
  `hu.u_szeged.inf.fog.simulator.demo.CLFogSimulation ../${baseDirPath}/appliances.xml ` +
  `../${baseDirPath}/devices.xml ../${baseDirPath}/ `;

  const process = child.spawnSync(command, {shell: true, maxBuffer: 1024 * 512});
  if(process.stderr.length > 0){
    return sendExecutionError(process.stderr, baseDirPath, res);
  }
  return sendResponseWithSavingStdOut(baseDirPath, process.stdout, res, configTime);
});

/**
 * It sends the response object in json format which contains
 * the directory's name, the html file in string format, stdout and an error property.
 * @param {string} baseDirPath
 * @param {string} data
 * @param {Response} res
 * @param {string} directory
 */
function sendResponseWithSavingStdOut(baseDirPath,data, res, directory) {
  console.log('**** Configuration succeed! ****');
  const fileName = apiUtils.getLastCreatedHtmlFile(baseDirPath);
  console.log(fileName)
  const html = apiUtils.readFileSyncWithErrorHandling(baseDirPath + '/' + fileName);
  writeToFile(baseDirPath + '/' + fileName, html.toString());

  const stdOut = data.toString();
  const finalstdOut = stdOut.slice(stdOut.indexOf('~~Informations about the simulation:~~'));
  writeToFile(baseDirPath + '/run-log.txt', finalstdOut);

  fse.outputFile(baseDirPath + '/run-log.txt', finalstdOut, (writeErr) => {
    if (writeErr){
      return console.log('ERROR: write file: ', baseDirPath + '/run-log.txt', '/n MSG: ', writeErr);
    }
    console.log('WRITE: run-log > ', baseDirPath + '/run-log.txt');
    const finalstdOut = stdOut.slice(stdOut.indexOf('~~Informations about the simulation:~~'));

    fse.removeSync(baseDirPath);

    return res.status(201).json({directory, html: html.toString(), data: finalstdOut, err: null });
  });
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
  console.log('errorMsg ' + stderr.toString())
  try {
    fse.removeSync(baseDirPath);
    console.log('REMOVED: dir: ', baseDirPath);
  } catch(e) {
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
function saveResourceFiles(req, baseDirPath) {
  const parser = new Parser(apiUtils.getParserOptions('$'));
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
    console.log(filePath)
    const file = storage.file(filePath);
    file.save(data)
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
