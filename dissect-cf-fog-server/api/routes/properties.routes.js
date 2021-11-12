const authJwt = require("../../middleware").authJwt;
const express = require('express');
const router = express.Router({ caseSensitive: true });
const parser = require('fast-xml-parser');
const apiUtils = require('../util');
const { storage } = require('../../models/firestore')

/* Sets the response header. */
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/**
 * It sends the strategies from scanned file with 200 status.
 * Throws error if some error is occured.
 */
router.get("/strategies/application", [authJwt.verifyToken], async (req, res, next) => {
  const jsonObj = await getResourceByPath('configurations/strategies/Application-strategies.xml');
  const result = jsonObj.strategies.strategy instanceof Array ?
    jsonObj.strategies : { strategy: [jsonObj.strategies.strategy] };
  res.status(200).json(result);
});

router.get("/strategies/device", [authJwt.verifyToken], async (req, res, next) => {
  const jsonObj = await getResourceByPath('configurations/strategies/Device-strategies.xml');
  const result = jsonObj.strategies.strategy instanceof Array ?
    jsonObj.strategies : { strategy: [jsonObj.strategies.strategy] };
  res.status(200).json(result);
});

/**
 * It sends the instances from scanned files with 200 status.
 * Throws error if some error is occured.
 */
router.get("/resources", [authJwt.verifyToken], async (req, res, next) => {
  const data = []

  storage.getFiles({
    prefix: 'configurations/resources/'
  }, function (err, files, nextQuery, apiResponse) {
    if (err) {
      console.log('ERROR: Failed to get the file: ', err);
      throw new Error('Can not read the file!');
    }

    var i = 0;
    const promises = [];
    const resources = files.filter(file => file.name.includes('.xml'))

    resources.forEach(res => promises.push(res.download()))

    Promise.all(promises).then(values => {
      values.forEach(val => {
        const jsonObj = parser.parse(val.toString(), apiUtils.getParserOptions());
        const resource = {
          name: getFileNameFromFilePath(resources[i].name),
          machines: getResponseMachines(jsonObj),
          repositories: getResponseRepositories(jsonObj)
        };
        data.push(resource);
        i++;
      })

      return res.status(200).json(data);
    })
  });
});

module.exports = router;

/**
 * Returns parsed scanned file with firebase.
 * @param {string} path 
 */
async function getResourceByPath(path) {
  const result = await getFile(path);

  return parser.parse(result, apiUtils.getParserOptions());
}

function getFileNameFromFilePath(filePath) {
  const paths = filePath.split(/\\\\|\\|\/\/|\//g);
  const file = paths[paths.length - 1];
  const fileFullName = file.split('.');
  const filename = fileFullName[0];
  return filename;
}

function getResponseRepositories(jsonObj) {
  const result = [];
  if (jsonObj.cloud.repository instanceof Array) {
    jsonObj.cloud.repository.forEach(repo =>
      result.push({
        id: repo.id,
        capacity: repo.capacity,
        inBW: repo.inBW,
        outBW: repo.outBW,
        diskBW: repo.diskBW
      })
    );
  } else {
    const repo = jsonObj.cloud.repository;
    
    result.push({
      id: repo.id,
      capacity: repo.capacity,
      inBW: repo.inBW,
      outBW: repo.outBW,
      diskBW: repo.diskBW
    })
  }
  return result;
}

function getResponseMachines(jsonObj) {
  const result = [];
  if (jsonObj.cloud.machine instanceof Array) {
    jsonObj.cloud.machine.forEach(mach =>
      result.push({
        id: mach.id,
        cores: mach.cores,
        processing: mach.processing,
        memory: mach.memory
      })
    );
  } else {
    const mach = jsonObj.cloud.machine;

    result.push({
      id: mach.id,
      cores: mach.cores,
      processing: mach.processing,
      memory: mach.memory
    })
  }
  return result;
}

async function getFile(filePath) {
  const file = storage.file(filePath);
  const filePromise = await file.download()

  return filePromise.toString();
}
