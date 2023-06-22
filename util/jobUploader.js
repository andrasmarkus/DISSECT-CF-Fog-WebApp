const mongodb = require("mongodb");
const fs = require('fs');

async function main() {
    const database = 'dissect';
    const uri = `mongodb://localhost:27017/${database}`;
    const client = new mongodb.MongoClient(uri);

    try {
        await client.connect();

        const stream = new mongodb.GridFSBucket(client.db("dissect")).openDownloadStream(new mongodb.ObjectId("648af5ddb587b6a7f427c057"));


        stream.read();
        return await new Promise((resolve, reject) => {
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

        //await listDatabases(client);

        /*
                const instances = await uploadFile(client, database,'../demo/XML_examples/instances.xml', 'instances.xml');
                const applications = await uploadFile(client, database,'../demo/XML_examples/applications.xml', 'applications.xml');
                const devices = await uploadFile(client, database,'../demo/XML_examples/devices.xml', 'devices.xml');
        */
        /* 
        await createFileReference(client, database, 'fs.files', instances._id, instances.filename);
        */
        /* 644911dd6a9c8861761ca029
         
         await createFileReference(client, database, 'fs.files', applications._id, applications.filename);
         */
        /* 644911ed0d42d6619704aa51
        
        await createFileReference(client, database, 'fs.files', devices._id, devices.filename);
        */

        /*
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
                  //PROVIDERS_FILE: new ObjectId("6359a9c5fa91e97693cb094a"),
                  IAAS_FILE0: new mongodb.ObjectId("648ac76b8cf4514caa8a5c77"),
                  IAAS_FILE1:new mongodb.ObjectId("648ac76b8cf4514caa8a5c75"),
                  //IAAS_FILE2: new ObjectId("6359a9c5fa91e97693cb0950")
                },
                
                createdDate: createdDate,
                lastModifiedDate: createdDate,
                })
                console.log(result.insertedId);
        */

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(`Database: ${db.name}`));
}

async function createFileReference(client, database, collection, id, filename) {
    const result = await client.db(database).collection(collection).insertOne({
        fileId: new mongodb.ObjectId(id),
        filename: filename
    })

    console.log(result);

    return result;
}

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

main().catch(console.error);