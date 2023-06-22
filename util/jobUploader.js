const mongodb = require("mongodb");
const fs = require('fs');

/**
 * Upload a file to MongoDB using GridFs.
 */
async function uploadFile(client, database, path, name) {
    const bucket = new mongodb.GridFSBucket(client.db(database));

    const result = await new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(bucket.openUploadStream(name))
            .on('error', function (err) { reject(err); })
            .on('finish', function (file) { resolve(file); });
    });

    console.log(result);

    return result;
}

/**
 * The function first uploads the necessery XML files, 
 * then create the simulation job. Please note that the ObjectIDs should
 * be manually added from the mongoDB. 
 */
async function main() {
    const database = 'dissect';
    const uri = `mongodb://localhost:27017/${database}`;
    const client = new mongodb.MongoClient(uri);

    try {
        await client.connect();

        // Upload the necessary XML files 
        const instances = await uploadFile(client, database, '../demo/XML_examples/instances.xml', 'instances.xml');
        const applications = await uploadFile(client, database, '../demo/XML_examples/applications.xml', 'applications.xml');
        const devices = await uploadFile(client, database, '../demo/XML_examples/devices.xml', 'devices.xml');

        // Create the simulation job
        const createdDate = new Date().toISOString();
        const result = await client.db("dissect").collection("simulator_jobs").insertOne({
            user: "null",
            priority: "1000",
            numberOfCalculation: 0,
            simulatorJobStatus: "SUBMITTED",
            configFiles: {
                APPLIANCES_FILE: new mongodb.ObjectId("648acb33f171ac4f5752c216"),
                DEVICES_FILE: new mongodb.ObjectId("648acb33f171ac4f5752c218"),
                INSTANCES_FILE: new mongodb.ObjectId("648acb33f171ac4f5752c214"),
                IAAS_FILE0: new mongodb.ObjectId("648ac76b8cf4514caa8a5c77"),
                IAAS_FILE1: new mongodb.ObjectId("648ac76b8cf4514caa8a5c75"),
            },

            createdDate: createdDate,
            lastModifiedDate: createdDate,
        })
        console.log(result.insertedId);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);