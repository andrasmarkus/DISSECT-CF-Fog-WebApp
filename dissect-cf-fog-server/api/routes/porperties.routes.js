const authJwt = require("../../middleware").authJwt;
const express = require('express');
const router = express.Router({caseSensitive:true});
const fs = require('fs');
const parser = require('fast-xml-parser');
const nodeDir = require('node-dir');
const apiUtils = require('../util');

router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/strategies", [authJwt.verifyToken], (req, res , next) => {
  fs.readFile('configurations/strategies/Strategies.xml', (err,data) =>  {
    if (err) {
      throw new Error('Can not read the file!');
    }
    const jsonObj = parser.parse(data.toString(),apiUtils.getParserOptions());
    res.status(200).json(jsonObj.strategies);
  });
});

router.get("/instances", [authJwt.verifyToken], (req, res , next) => {
  fs.readFile('configurations/instances/Instances.xml', (err,data) =>  {
    if (err) {
      throw new Error('Can not read the file!');
    }
    const jsonObj = parser.parse(data.toString(),apiUtils.getParserOptions());
    res.status(200).json(jsonObj.instances);
  });
});

router.get("/resources", [authJwt.verifyToken], (req, res , next) => {
  const data = []
  nodeDir.readFiles('configurations/resources/',
  (err, content, filePath, nextFile) => {
    if (err){
      throw new Error('Can not read the file!');
    }
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
        throw new Error('Can not read the file!');
      }
      return res.status(200).json(data);
  });
});

module.exports = router;

function getFileNameFromFilePath(filePath) {
  const paths = filePath.split('\\');
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

