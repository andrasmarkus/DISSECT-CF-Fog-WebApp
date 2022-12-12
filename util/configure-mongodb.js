const {MongoClient, ObjectId, GridFSBucket} = require('mongodb');
const fs = require('fs');

/*
 * In order to use dissect-cf and WebApp, MongoDB needs some preliminary configuration,
 * like creating the appropriate collections, uploading the necessary configuration files.
 *
 * This script provides methods that implement basic database operations that can be used to prepare the MongoDB database.
 */


/**
 * List the databases that can be found on the current MongoDB database server
 * @param client
 * @return {Promise<void>}
 */
async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(`Database: ${db.name}`));
}

/**
 * Get all documents of a collection
 * @param client
 * @return {Promise<void>}
 */
async function getDocumentsOfCollection(client) {
    let result = await new Promise(function(resolve, reject) {
        client.db("dissect").collection("strategies.files").find().toArray( function(err, docs) {
         if (err) {
           return reject(err)
         }
         return resolve(docs)
       })
     })

    console.log(result);
}

/**
 * Get the job of the given id
 * @param client
 * @param id
 * @return {Promise<void>}
 */
async function findJobById(client, id) {
    const result = await client.db("dissect").collection("simulator_jobs").findOne({
        _id: id
    });

    if (result) {
        console.log(result._id);
    } else {
        console.log("No job found");
    }
}

/**
 * Get the job of the given email
 * @param client
 * @return {Promise<void>}
 */
async function findJobByEmail(client){
    const result = await client.db("dissect").collection("simulator_jobs").find({
        email: 'test@gmail.com'
    });
}

/**
 * Create a job
 * @param client
 * @return {Promise<void>}
 */
async function createJob(client) {    
    const createdDate = new Date().toISOString();
    const result = await client.db("dissect").collection("simulator_jobs").insertOne({
        user: '6359a9c5fa91e97693cb0944',
        priority: "1000",
        numberOfCalculation: 0,
        simulatorJobStatus: "SUBMITTED",
        configFiles: {
          APPLIANCES_FILE: new ObjectId("6359a9c5fa91e97693cb0944"),
          DEVICES_FILE: new ObjectId("6359a9c5fa91e97693cb0946"),
          INSTANCES_FILE: new ObjectId("6359a9c5fa91e97693cb0948"),
          PROVIDERS_FILE:new ObjectId("6359a9c5fa91e97693cb094a"),
          IAAS_FILE0: new ObjectId("6359a9c5fa91e97693cb094c"),
          IAAS_FILE1:new ObjectId("6359a9c5fa91e97693cb094e"),
          IAAS_FILE2: new ObjectId("6359a9c5fa91e97693cb0950")
        },
        createdDate: createdDate,
        lastModifiedDate: createdDate,
    })
    console.log(result.insertedId);
}

/**
 * Create a file reference in the specified collection that points to the
 * original reference of the file in the fs.files bucket
 */
async function createFileReference(client) {
    const result = await client.db("dissect").collection("strategies").insertOne({
        fileId: new ObjectId("6373fd171eab4005b8f5d43a"),
        filename: "Device-strategies.xml"
    })
}

/**
 * Upload a file to MongoDB using GridFs
 * @param client
 * @return {Promise<void>}
 */
async function uploadFile(client) {
    const bucket = new GridFSBucket(client.db("dissect"));

     const result = await new Promise((resolve, reject) => {
         fs.createReadStream('./Device-strategies.xml')
           .pipe(bucket.openUploadStream('Device-strategies.xml'))
           .on('error', function (err) { reject(err); })
           .on('finish', function (file) { resolve(file); });
    });

    console.log(result);
}

/**
 * Download a file from MongoDB using GridFS
 * @param client
 * @return {Promise<void>}
 */
async function downloadFile(client) {
    const bucket = new GridFSBucket(client.db("dissect"), {bucketName: 'strategies'});
    
    await new Promise((resolve, reject) => {
         bucket.openDownloadStreamByName('Application-strategies.xml')
             .pipe(fs.createWriteStream('Application-strategies.xml'))
    });
}

/**
 * Get a file from MongoDB as a string
 * @param client
 * @return {Promise<void>}
 */
async function read(client) {
    const bucket = new GridFSBucket(client.db("dissect"), {bucketName: 'strategies'});

    const stream = bucket.openDownloadStreamByName('Device-strategies.xml');
    stream.read();
    const result = await new Promise((resolve, reject) => {
        const chunks = [];

        stream.on('data', data => {
            chunks.push(data);
        });

        stream.on('end', () => {
            const data = Buffer.concat(chunks);

            resolve(data);
        });

        stream.on('error', err => {
            reject(err);
        });
    });
    console.log(result.toString());
}

/**
 * The 'main' function where any of the functions listed above can be called and tested
 * @return {Promise<void>}
 */
async function main(){
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Call the method you want to use on the connected MongoDB like below
        await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
    
    }
    await client.close();

}

main().catch(console.error);

