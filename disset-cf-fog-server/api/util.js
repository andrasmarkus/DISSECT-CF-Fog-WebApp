const fs = require('fs');
const path = require('path');

function getParserOptions(attributeNamePrefix = ''){
  return {
    attributeNamePrefix,
    ignoreAttributes: false,
    format: true,
    indentBy: '  ',
    supressEmptyNode: true
  }
};

function getLastCreatedHtmlFile(dirName){
  const dir = readDirSyncWithErrorHandling(dirName);
  const files= dir.filter(file => path.extname(file) == ".html")
    .map(file => ({ file, mtime: fs.statSync(dirName + '/'+ file).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    if(files.length){
      return files[0].file;
    }else {
      throw new Error('Can not find the file!');
    }
}

function readFileSyncWithErrorHandling(filePath){
  try{
    return fs.readFileSync(filePath);
  }catch(err){
    if(err.code === 'ENOENT' || err.code === 'EACCES'){
      throw new Error('Failed to get the file!');
    }else{
      throw new Error('Unkonwn error occured during reading the file!');
    }
  }
}

function readDirSyncWithErrorHandling(dirPath, withFileTypes = false){
  try{
    return fs.readdirSync(dirPath, { withFileTypes: withFileTypes });
  }catch(err){
    if(err.code === 'ENOENT' || err.code === 'EACCES'){
      throw new Error('Failed to read directory!');
    }else{
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