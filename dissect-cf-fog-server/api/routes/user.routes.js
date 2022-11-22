const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user.controller");
const express = require('express');
const router = express.Router({ caseSensitive: true });
const { isEmpty } = require('lodash');
const mongodb = require('../../services/mongodb-service');
const {response} = require("express");


// TODO remove console.logs
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
router.post("/configurations", [authJwt.verifyToken], async (req, res, next) => {
  if (isEmpty(req.body.id)) {
    return res.status(404).send({message: 'Bad request!'})
  }

  // For configuration
  await getConfigurationDetailsMongo(req.body.id).then(details => {
    return res.status(200).json(details);
  })
});

router.post("/configurations/resultfile", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router user/configurations/resutlfile called");
  console.log("REQUEST: " + JSON.stringify(req.body));
  return sendJobMongo(req, res);
});

router.post("/configurations/job", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router user/configurations/job called");
  console.log("REQUEST: " + JSON.stringify(req.body));
  return sendConfigMongo(req, res);
});

router.post("/configurations/download/appliances", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router - user/configurations/download/appliances called");
  return sendFileMongo(req,res);
});

router.post("/configurations/download/devices", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router - user/configurations/download/devices called");
  return sendFileMongo(req,res);
});

router.post("/configurations/download/instances", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router - user/configurations/download/instances called");
  return sendFileMongo(req,res);
});

router.post("/configurations/download/timeline", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router - user/configurations/download/TIMELINE called");
  return sendFileMongo(req,res);
});

router.post("/configurations/download/devicesenergy", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router - user/configurations/download/devicesenergy called");
  return sendFileMongo(req,res);
});

router.post("/configurations/download/nodesenergy", [authJwt.verifyToken], (req, res, next) => {
  console.log("Router - user/configurations/download/nodesenergy called");
  return sendFileMongo(req,res);
});

async function getConfigurationDetailsMongo(id) {
  console.log("getConfigurationDetailsMongo() called - id: " + id);

  return await mongodb.getConfigurationsByUserId(id);
}

async function sendFileMongo(req, res) {
  console.log("sendFileMongo() called");

  checkResourceRequestBodyMongo(req, res);

  console.log('MONGO DOWNLOAD ID: ', req.body._id);

  await mongodb.getFileById(req.body._id).then(file => {
    console.log(response);
    return res.send(file.toString());
  })
}


// TODO implement proper checks
function checkResourceRequestBodyMongo(req, res) {
  if (isEmpty(req.body._id)) {
    return res.status(404).send({ message: 'Bad request!' })
  }
}

async function sendConfigMongo(req,res) {
  console.log("sendConfigMongo called");
  console.log(JSON.stringify(req.body));
  console.log("ID=" + req.body._id);

  const configuration = await mongodb.getConfigurationById(req.body._id);
  console.log("CONFIG=" + JSON.stringify(configuration));
  return res.status(201).json({directory: 'directory', data: null, job: null, jobs: configuration.jobs,html: null, err: null});
}

async function sendJobMongo(req, res) {
  // checkResourceRequestBodyMongo(req, res);
  console.log(JSON.stringify(req.body));
  console.log("ID=" + req.body._id);

  const simulatorJob = await mongodb.getSimulatorJobById(req.body._id); // JÓ

  console.log(simulatorJob);

  let htmlResults = [];
  for (const property in simulatorJob.results) {
    console.log(`${property}: ${simulatorJob.results[property]}`);
    const tmpString = await mongodb.getFileById(simulatorJob.results[property]).then(file => {
      return file.toString();
    });
    htmlResults.push(tmpString);
  }

  let vmi = {
    job: simulatorJob,
    html: htmlResults
  }

  console.log(vmi);

  htmlResults = htmlResults.map(x => x.replace('\r\n', ''));
  return res.status(201).json({directory: 'directory', data: JSON.stringify(simulatorJob.simulatorJobResult, undefined, 4), job: simulatorJob, html: htmlResults, err: null});
}

module.exports = router;