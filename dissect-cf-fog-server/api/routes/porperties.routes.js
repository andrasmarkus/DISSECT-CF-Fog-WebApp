const authJwt = require("../../middleware").authJwt;
const express = require('express');
const router = express.Router({caseSensitive:true});
const fs = require('fs');
const parser = require('fast-xml-parser');
const nodeDir = require('node-dir');
const apiUtils = require('../util');

/* Sets the response header. */
router.use((req, res, next)=>{
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
router.get("/strategies/application", [authJwt.verifyToken], (req, res , next) => {
  const jsonObj = getResourceByPath('configurations/strategies/Application-strategies.xml');
  const result = jsonObj.strategies.strategy instanceof Array ?
    jsonObj.strategies : {strategy: [jsonObj.strategies.strategy]};
  res.status(200).json(result);
});

router.get("/strategies/device", [authJwt.verifyToken], (req, res , next) => {
  const jsonObj = getResourceByPath('configurations/strategies/Device-strategies.xml');
  const result = jsonObj.strategies.strategy instanceof Array ?
    jsonObj.strategies : { strategy: [jsonObj.strategies.strategy]};
  res.status(200).json(result);
});

/**
 * It sends the instances from scanned file with 200 status.
 * Throws error if some error is occured.
 */
router.get("/instances", [authJwt.verifyToken], (req, res , next) => {
  const jsonObj = getResourceByPath('configurations/instances/Instances.xml');
  const result = jsonObj.instances.instance instanceof Array ?
    jsonObj.instances : { instance: [jsonObj.instances.instance]};
  res.status(200).json(result);
});

/**
 * It sends the instances from scanned files with 200 status.
 * Throws error if some error is occured.
 */
router.get("/resources", [authJwt.verifyToken], (req, res , next) => {
  const data = []
  nodeDir.readFiles('configurations/resources/',
  (err, content, filePath, nextFile) => {
    if (err){
      console.log('ERROR: Failed to get the file: ', filePath);
      throw new Error('Can not read the file!');
    }
    console.log('READ: file: ', filePath);
    const jsonObj = parser.parse(content.toString(), apiUtils.getParserOptions());
    const resource = {
      name: getFileNameFromFilePath(filePath),
      machines: getResponseMachines(jsonObj),
      repositories: getResponseRepositories(jsonObj)
    };
    data.push(resource);
    nextFile();
  },
  (err, files)=>{
      if (err){
        console.log('ERROR: Failed to get the files: ', files);
        throw new Error('Can not read the files!');
      }
      return res.status(200).json(data);
  });
});

module.exports = router;

/**
 * Returns parsed scanned file.
 * @param {sring} path 
 */
function getResourceByPath(path) {
  const resultBuffer = fs.readFileSync(path, (err, data) => {
    if (err) {
      console.log('ERROR: Failed to get the file: ', path);
      throw new Error('Can not read the file!');
    }
  });
  console.log('READ: file: ', path);
  return parser.parse(resultBuffer.toString(), apiUtils.getParserOptions());
}

function getFileNameFromFilePath(filePath) {
  const paths = filePath.split(/\\\\|\\|\/\/|\//g);
  const file = paths[paths.length - 1];
  const fileFullName = file.split('.');
  const filename = fileFullName[0];
  return filename;
}

function getResponseRepositories(jsonObj) {
  const result= [];
  jsonObj.cloud.repository.forEach(repo =>
    result.push({
      id: repo.id,
      capacity: repo.capacity,
      inBW: repo.inBW,
      outBW: repo.outBW,
      diskBW: repo.diskBW
    })
  );
  return result;
}

function getResponseMachines(jsonObj) {
  const result= [];
  jsonObj.cloud.machine.forEach(mach =>
    result.push({
      id: mach.id,
      cores: mach.cores,
      processing: mach.processing,
      memory: mach.memory
    })
  );
  return result;
}

