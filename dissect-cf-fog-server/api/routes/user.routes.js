const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user.controller");
const { storage } = require('../../models/firestore')
const express = require('express');
const router = express.Router({ caseSensitive: true });
const parser = require('fast-xml-parser');
const { isEmpty } = require('lodash');
const apiUtils = require('../util');
const BASE_DIR = 'configurations/users_configurations/';

/* Sets the response header. */
router.use((req, res, next) => {
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
router.post("/configurations", [authJwt.verifyToken], (req, res, next) => {
  if (isEmpty(req.body.email)) {
    return res.status(404).send({ message: 'Bad request!' })
  }
  const userEmail = req.body.email;

  storage.getFiles({
    prefix: BASE_DIR + userEmail
  }, function (err, files, nextQuery, apiResponse) {

    dirs = files.filter(file => file.name.includes('Timeline.html'))
      .map(file => BASE_DIR + userEmail + '/' + file.name.split(userEmail)[1].substring(1, 20) + '/')

    getConfigurationDetailsFirestore(dirs, userEmail).then(details => {
      return res.status(200).json(details);
    });
  })
});

router.post("/configurations/resultfile", [authJwt.verifyToken], (req, res, next) => {
  return sendResult(req, res);
});

router.post("/configurations/download/appliances", [authJwt.verifyToken], (req, res, next) => {
  return sendXmlFile(req, res, 'appliances.xml');
});

router.post("/configurations/download/devices", [authJwt.verifyToken], (req, res, next) => {
  return sendXmlFile(req, res, 'devices.xml');
});

router.post("/configurations/download/timeline", [authJwt.verifyToken], (req, res, next) => {
  return sendHtmlFile(req, res, 'Timeline');
});

router.post("/configurations/download/devicesenergy", [authJwt.verifyToken], (req, res, next) => {
  return sendHtmlFile(req, res, 'Devices-Energy')
});

router.post("/configurations/download/nodesenergy", [authJwt.verifyToken], (req, res, next) => {
  return sendHtmlFile(req, res, 'Nodes-Energy')
});

function sendHtmlFile(req, res, fileName) {
  checkResourceRequsetBody(req, res);

  const directory = req.body.directory;
  let filePath = directory;

  storage.getFiles({
    prefix: filePath,
    versions: true
  }, function (err, files, nextQuery, apiResponse) {

    const htmlFilePath = files.filter(file => file.name.includes(fileName))
      .map(file => file.name);

    console.log('DOWNLOAD: ' + htmlFilePath);

    getFile(htmlFilePath).then(contents => {
      return res.send(contents[0].toString());
    });
  });
}

/**
 * Firestore : Returns configuration details. Finds the user folder by the given email and counts all details in the directory,
 * by reading files.
 * @param {string[]} dirs - user's directories
 * @param {string} userEmail - it determines, which folder is
 */
async function getConfigurationDetailsFirestore(dirs, userEmail) {
  const details = [];

  for (const dirName of dirs) {
    const dateTime = getDateTimeStringFromDirName(dirName.split(userEmail)[1].replace('/', ''));

    const appliancesFile = storage.file(dirName + 'appliances.xml');
    const devicesFile = storage.file(dirName + 'devices.xml');

    const appliancesPromise = appliancesFile.download()
    const devicesPromise = devicesFile.download()

    const contents = await Promise.all([appliancesPromise, devicesPromise])

    const appliances = parser.parse(contents[0].toString(), apiUtils.getParserOptions());
    const devices = parser.parse(contents[1].toString(), apiUtils.getParserOptions());

    let numOfClouds;
    let numOfFogs;
    if (appliances.appliances.appliance instanceof Array) {
      numOfClouds = appliances.appliances.appliance.filter(node => node.name.startsWith('cloud')).length;
      numOfFogs = appliances.appliances.appliance.filter(node => node.name.startsWith('fog')).length;
    } else {
      numOfClouds = appliances.appliances.appliance.name.startsWith('cloud') ? 1 : 0;
      numOfFogs = appliances.appliances.appliance.name.startsWith('fog') ? 1 : 0;
    }

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
function sendXmlFile(req, res, fileName) {
  checkResourceRequsetBody(req, res);

  const directory = req.body.directory;
  let filePath = directory + '/' + fileName;

  console.log('DOWNLOAD: ', filePath);

  getFile(filePath).then(contents => {
    return res.send(contents[0].toString());
  });
}

/**
 * Sends the directory's name, the scanned html file in string format and also the error message with 200 status.
 * The request should contain the email and the directory.
 * @param {Request} req - request
 * @param {Response} res - response
 */
async function sendResult(req, res) {
  checkResourceRequsetBody(req, res);
  const directory = req.body.directory;
  const stdOutPath = directory + 'run-log.txt';

  storage.getFiles({
    prefix: directory,
    versions: true
  }, function (err, files, nextQuery, apiResponse) {

    const htmlFilePaths = files.filter(file => file.name.includes('.html'))
      .map(file => file.name)

    getResultFiles(htmlFilePaths, stdOutPath).then(contents => {

      if (contents.length) {
        const finalHtmlResults = [];
        const finalStdout = contents[3].toString();
        
        finalHtmlResults.push(contents[0].toString());
        finalHtmlResults.push(contents[1].toString());
        finalHtmlResults.push(contents[2].toString());
        
        return res.status(200).json({ directory, html: finalHtmlResults, data: finalStdout, err: null });
      } else {
        return res.status(200).json({ html: 'Not created!', data: 'Error!', err: 'Something went wrong!' });
      }

    }).catch(console.error)
  })
}

async function getResultFiles(htmlFilePath, stdOutPath) {
  const resultFilePromises = [];

  // creating html response file promises
  htmlFilePath.forEach(file => {
    resultFilePromises.push(storage.file(file).download())
  });

  // creating run-log.txt file promise
  resultFilePromises.push(storage.file(stdOutPath).download());

  const contents = await Promise.all(resultFilePromises)

  return contents;
}

async function getFile(filePath) {
  const file = storage.file(filePath);

  const filePromise = file.download()

  const contents = await Promise.all([filePromise])

  return contents;
}

/**
 * Checks the request contain the user's email and the selected directory, if not it will send 404 with a message.
 * @param {Request} req - request
 * @param {Response} res - response
 */
function checkResourceRequsetBody(req, res) {
  if (isEmpty(req.body.email) || isEmpty(req.body.directory)) {
    return res.status(404).send({ message: 'Bad request!' })
  }
}

module.exports = router;