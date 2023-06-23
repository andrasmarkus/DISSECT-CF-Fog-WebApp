const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user-controller");
const express = require('express');
const router = express.Router({ caseSensitive: true });
const { isEmpty } = require('lodash');
const mongodb = require('../../services/mongodb-service');
const {response} = require("express");


/* Sets the response header. */
router.use((req, res, next) => {
  res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/**
 * Sends back all the list of all users
 */
router.get("/", [authJwt.verifyToken], controller.getAllUser);

/**
 * Sends back the list of the configurations of the given user.
 */
router.post("/configuration/list", [authJwt.verifyToken], async (req, res, next) => {
  if (isEmpty(req.body.id)) {
    return res.status(404).send({message: 'Bad request!'})
  }

  await getConfigurationList(req.body.id).then(details => {
    return res.status(200).json(details);
  })
});

router.post("/configuration", [authJwt.verifyToken], (req, res, next) => {
  return sendConfig(req,res);
});

router.post("/configurations/download/appliances", [authJwt.verifyToken], (req, res, next) => {
  return sendFileMongo(req,res);
});

router.post("/configurations/download/devices", [authJwt.verifyToken], (req, res, next) => {
  return sendFileMongo(req,res);
});

router.post("/configurations/download/instances", [authJwt.verifyToken], (req, res, next) => {
  return sendFileMongo(req,res);
});

router.post("/configurations/download/timeline", [authJwt.verifyToken], (req, res, next) => {
  return sendFileMongo(req,res);
});

router.post("/configurations/download/devicesenergy", [authJwt.verifyToken], (req, res, next) => {
  return sendFileMongo(req,res);
});

router.post("/configurations/download/nodesenergy", [authJwt.verifyToken], (req, res, next) => {
  return sendFileMongo(req,res);
});

/**
 * Send back the list of the configurations for the given user
 * @param id The id of the user
 * @return {Promise<*|undefined>}
 */
async function getConfigurationList(id) {
  return await mongodb.getConfigurationsByUserId(id);
}

/**
 * Send back the given file as a string
 * @param req The received request
 * @param res The returned response
 * @return {Promise<void>}
 */
async function sendFileMongo(req, res) {
  checkResourceRequestBodyMongo(req, res);
  await mongodb.getFileById(req.body._id).then(file => {
    console.log(response);
    return res.send(file.toString());
  })
}

/**
 * Check whether the request is valid or not
 * @param req The received request
 * @param res The returned response
 * @return {*}
 */
function checkResourceRequestBodyMongo(req, res) {
  if (isEmpty(req.body._id)) {
    return res.status(404).send({ message: 'Bad request!' })
  }
}

/**
 * Send back the config of the requested id
 * @param req The received request
 * @param res The returned response
 * @return {Promise<*>}
 */
async function sendConfig(req,res){
  const config = await mongodb.getConfigurationById(req.body._id);

  const jobs = [];
  for (const job of config.jobs) {
    jobs.push(await mongodb.getSimulationById(job._id));
  }

  config.jobs = jobs;

  return res.status(201).json({config: config, err: null});
}

module.exports = router;