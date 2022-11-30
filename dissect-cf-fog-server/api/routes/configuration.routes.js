const express = require('express');
const authJwt = require("../../middleware").authJwt;
const router = express.Router({caseSensitive:true});
const { isEmpty } = require('lodash');
const Parser = require("fast-xml-parser").j2xParser;
const apiUtils = require('../util');
const mongodb = require('../../services/mongodb-service');


// TODO remove console.logs
/**
 * It parses the appliances and devices to xml and writes out into files. The path consists of the email and and the time.
 * It runs the dissect application, and sends the directory's name, the html file in string format, stdout and an error property,
 * if it is failed somehow, it will try to delete the created folder and it will send an error response.
 */
router.post('/', [authJwt.verifyToken], async (req, res) => {
  const jobs = [];
  const configs = [];

  for (let config of req.body) {
    configs.push(config.configuration);
  }

  for (let config of configs) {
    if (!checkConfigurationRequestBody(config)) {
      throw new Error('Bad request!');
    }

    let obj = await saveResourceFiles(config);

    const prov = await mongodb.getProvidersFile({
      filename: "providers.xml"
    })

    let configFiles = {};
    configFiles["APPLIANCES_FILE"] = obj.appliancesId;
    configFiles["DEVICES_FILE"] = obj.devicesId;
    configFiles["INSTANCES_FILE"] = obj.instancesId;
    configFiles["PROVIDERS_FILE"] = prov.fileId;

    const resources = await mongodb.getResourceFiles();

    let counter = 0;

    for (const item of resources) {
      configFiles["IAAS_FILE" + counter] = item.fileId;
      counter += 1;
    }

    const job = await mongodb.addJob({
      user: req.userId,
      priority: "101",
      numberOfCalculation: 0,
      simulatorJobStatus: "SUBMITTED",
      configFiles: configFiles,
      createdDate: new Date().toISOString()
    })

    jobs.push(job.insertedId);
  }

  const new_config_id = await mongodb.addConfiguration({
    user: req.userId,
    time: new Date().toISOString(),
    jobs: jobs
  }).then(res => {
    return res.insertedId;
  });

  const config = await mongodb.getConfigurationById(new_config_id);

  return res.status(201).json({config: config, err: null});
});


/**
 * It wrties the files into the given directory. The data comes from the request' body.
 * @param {Request} req
 * @param {Parser} parser
 * @param {string} baseDirPath
 */
async function saveResourceFiles(config) {
  const parser = new Parser(apiUtils.getParserOptions('$'));

  const plainAppliances = config.appliances;
  const plainDevices = config.devices;
  const plainInstances = config.instances;

  const appliances = parser.parse(plainAppliances);
  const devices = parser.parse(plainDevices);
  const instances = parser.parse(plainInstances);

  const xmlFileHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

  const appliancesId = await mongodb.saveFile('appliances.xml',xmlFileHeader + appliances);
  const devicesId = await mongodb.saveFile('devices.xml', xmlFileHeader + devices);
  const instancesId = await mongodb.saveFile('Instances.xml', xmlFileHeader + instances);

  return {
    appliancesId: appliancesId,
    devicesId: devicesId,
    instancesId: instancesId
  }
}

/**
 * @param {Request} req
 */
function checkConfigurationRequestBody(req){
  return req.appliances && req.devices && !isEmpty(req.appliances) && !isEmpty(req.devices)
}

module.exports = router
