const fs = require('fs');
const path = require('path');

/**
 * It returns the basic options for the xml/js parser.
 * @param {string} attributeNamePrefix - default value is an empty string
 */
function getParserOptions(attributeNamePrefix = ''){
  return {
    attributeNamePrefix,
    ignoreAttributes: false,
    format: true,
    indentBy: '  ',
    supressEmptyNode: true
  }
};

/**
 * Returns the last created html file in the given directory. This method is sync.
 * Throws error if can not find the file.
 * @param {string} dirName
 */
function getLastCreatedHtmlFile(dirName){
  const dir = readDirSyncWithErrorHandling(dirName);
  console.log('READ: dir: ', dirName);
  const files= dir.filter(file => path.extname(file) == ".html")
    .map(file => ({ file, mtime: fs.statSync(dirName + '/'+ file).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    if(files.length){
      return files[0].file;
    }else {
      console.log('ERROR: Can not find the last created file from: ', dirName);
      throw new Error('Can not find the file!');
    }
}

/**
 * Return the file sync with error handling.
 * @param {string} filePath
 */
function readFileSyncWithErrorHandling(filePath){
  try{
    return fs.readFileSync(filePath);
  }catch(err){
    if(err.code === 'ENOENT' || err.code === 'EACCES'){
      console.log('ERROR: Failed to get the file: ', filePath);
      throw new Error('Failed to get the file!');
    }else{
      console.log('ERROR: Unkonwn error at reading file: ', filePath);
      throw new Error('Unkonwn error occured during reading the file!');
    }
  }
}

/**
 * Return the directiry sync with error handling.
 * @param {string} filePath
 */
function readDirSyncWithErrorHandling(dirPath, withFileTypes = false){
  try{
    return fs.readdirSync(dirPath, { withFileTypes: withFileTypes });
  }catch(err){
    if(err.code === 'ENOENT' || err.code === 'EACCES'){
      console.log('ERROR: Failed to read the dir: ', dirPath);
      throw new Error('Failed to read directory!');
    }else{
      console.log('ERROR: Unkonwn error at reading dir: ', dirPath);
      throw new Error('Unkonwn error occured during reading the directory!');
    }
  }
}

const apiUtils = {
  getLastCreatedHtmlFile,
  readFileSyncWithErrorHandling,
  readDirSyncWithErrorHandling,
  getParserOptions
};

module.exports = apiUtils;