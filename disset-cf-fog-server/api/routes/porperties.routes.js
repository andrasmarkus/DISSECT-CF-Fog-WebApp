const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user.controller");
const express = require('express');
const router = express.Router({caseSensitive:true});
const fs = require('fs');
const parser = require('fast-xml-parser');

router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const defaultOptions = {
  attributeNamePrefix : "",
  ignoreAttributes: false,
  format: true,
  indentBy: '  ',
  supressEmptyNode: true
};

router.get("/strategies", /* [authJwt.verifyToken], */ (req, res , next) => {
  fs.readFile('configurations/strategies/Strategies.xml', (err,data) =>  {
    if (err) {
      return console.log(err);
    }
    const jsonObj = parser.parse(data.toString(),defaultOptions);
    res.status(200).json(jsonObj.strategies);
  });
});

router.get("/instances", /* [authJwt.verifyToken], */ (req, res , next) => {
  fs.readFile('configurations/instances/Instances.xml', (err,data) =>  {
    if (err) {
      return console.log(err);
    }
    const jsonObj = parser.parse(data.toString(),defaultOptions);
    res.status(200).json(jsonObj.instances);
  });
});

/*It should wait the files*/
router.get("/resources", /* [authJwt.verifyToken], */ async (req, res , next) => {
  var data = []
  await readFiles('configurations/resources/', (filename, content) => {
    const jsonContent = parser.parse(content.toString(),defaultOptions);
    data.push({name:filename, content:jsonContent});
    console.log(filename);
    console.log(jsonContent);
  }, (err) => {
    res.status(500).send({ message: 'Failed to load resources!', stack: err.stack });
  });
  console.log(data)
  res.status(200).json(data);
});

async function readFiles(dirname, onFileContent, onError) {
  fs.readdirSync(dirname, (err, filenames) => {
    if (err) {
      return onError(err);
    }
    filenames.forEach((filename) => {
      fs.readFileSync(dirname + filename, (errFile, content)  => {
        if (err) {
          return onError(errFile);
        }
        onFileContent(filename, content);
      });
    });
  });
}

module.exports = router;

