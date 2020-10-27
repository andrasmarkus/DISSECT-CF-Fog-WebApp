const express = require('express');
const router = express.Router({caseSensitive:true});
const fs = require('fs');
const { isEmpty } = require('lodash');
const Parser = require("fast-xml-parser").j2xParser;
const path = require('path'); 
const cmd =require('node-cmd');

router.post('/', (req, res , next)=> {
  if(checkConfigurationRequestBody(req)){
    const defaultOptions = {
      attributeNamePrefix: '$',
      ignoreAttributes: false,
      format: true,
      indentBy: '  ',
      supressEmptyNode: true
    };
    const parser = new Parser(defaultOptions);
  
    const pureAppliances = req.body.configuration.appliances;
    const pureDevices = req.body.configuration.devices;
    const appliances = parser.parse(pureAppliances);
    const devices = parser.parse(pureDevices);
    const xmlFileHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    fs.writeFile('./configurations/appliances.xml', xmlFileHeader+appliances, function (err) {
      if (err) return console.log(err);
      console.log('appliances > appliances.xml');
    });
    fs.writeFile('./configurations/devices.xml', xmlFileHeader+devices, function (err) {
      if (err) return console.log(err);
      console.log('devices > devices.xml');
    });

    const command =  'cd dissect-cf && java -cp target/dissect-cf-0.9.7-SNAPSHOT-jar-with-dependencies.jar '+
    'hu.u_szeged.inf.fog.simulator.demo.CLFogSimulation ../configurations/appliances.xml '+
    '../configurations/devices.xml ../configurations/';

    /* const commandDemo =  'cd dissect-cf && java -cp target/dissect-cf-0.9.7-SNAPSHOT-jar-with-dependencies.jar '+
    'hu.u_szeged.inf.fog.simulator.demo.CLFogSimulation ../configurations/appliances_demo.xml '+
    '../configurations/devices_demo.xml ../configurations/' */;

    cmd.get(
      command,
      (err, data, stderr) =>{
          if(err || stderr){
            console.log(stderr);
            const errorMsg = stderr.toString().split('\n')[0].split(':')[1];
            return res.status(200).json({html: 'Not created!', data: 'Error!', err:errorMsg });
          }
          const fileName = getLastCreatedHtmlFile('configurations').file;
          //const fileName = '2020-10-22-12-50-31.html'
          const html = fs.readFileSync( 'configurations/' + fileName );
          const stdOut = data.toString();
          const finalstdOut = stdOut.slice(stdOut.indexOf('~~Informations about the simulation:~~'))
          console.log(finalstdOut);
          fs.writeFile('./configurations/stdout.txt', finalstdOut, (writeErr) => {
            if (writeErr) return console.log(writeErr);
            console.log('stdout > stdout.txt');
            return res.status(201).json({html: html.toString(), data: finalstdOut, err: null});
          });
      });
    const getLastCreatedHtmlFile = (dirName) => {
      console.log(fs.readdirSync(dirName));
      const files = fs.readdirSync(dirName)
        .filter(file => path.extname(file) == ".html")
        .map(file => ({ file, mtime: fs.statSync('./' + dirName + '/'+ file).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      return  files.length ? files[0] : undefined;
    }
  }else{
    return res.status(500).json({message:'Bad request!'})
  }
});

function checkConfigurationRequestBody(req){
  return req.body && req.body.configuration && req.body.configuration.appliances
    && req.body.configuration.devices && !isEmpty(req.body.configuration.appliances)
    && !isEmpty(req.body.configuration.devices)
}

module.exports = router
