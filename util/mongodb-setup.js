const mongodb = require("mongodb");
const fs = require('fs');

/**
 * Create a file reference in the specified collection that points to the
 * original reference of the file in the fs.files bucket
 */
async function createFileReference(client, database, collection, id, filename) {
    const result = await client.db(database).collection(collection).insertOne({
        fileId: new mongodb.ObjectId(id),
        filename: filename
    })

    console.log(result);

    return result;
}

/**
 * Upload a file to MongoDB using GridFs
 * @param client
 * @return {Promise<void>}
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
 * The 'main' function creates the database and its collections,
 * then uploads the files and adds their references to the right tables.
 */
async function main(){
    const database = 'dissect' // set to name of the database you want to create
    const uri = `mongodb://localhost:27017/${database}`; // set to the proper connection string
    const client = new mongodb.MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Create collections
        await client.db(database).createCollection('fs.files');
        await client.db(database).createCollection('fs.chunks');
        await client.db(database).createCollection('configurations');
        await client.db(database).createCollection('providers');
        await client.db(database).createCollection('resources');
        await client.db(database).createCollection('simulator_jobs');
        await client.db(database).createCollection('strategies');
        await client.db(database).createCollection('users');

        // Upload files
        const providers = await uploadFile(client, database,'./mongodb-setup-resources/providers.xml', 'providers.xml');
        const lpds32 = await uploadFile(client, database, './mongodb-setup-resources/LPDS_32.xml', 'LPDS_32.xml');
        const lpds16 = await uploadFile(client, database, './mongodb-setup-resources/LPDS_16.xml', 'LPDS_16.xml');
        const application_strategies = await uploadFile(client, database,'./mongodb-setup-resources/Application-strategies.xml', 'Application-strategies.xml');
        const device_strategies = await uploadFile(client, database,'./mongodb-setup-resources/Device-strategies.xml', 'Device-strategies.xml');

        // Add the references of the uploaded files to the right tables
        await createFileReference(client, database, 'providers', providers._id, providers.filename);
        await createFileReference(client, database, 'resources', lpds32._id, lpds32.filename);
        await createFileReference(client, database, 'resources', lpds16._id, lpds16.filename);
        await createFileReference(client, database, 'strategies', application_strategies._id, application_strategies.filename);
        await createFileReference(client, database, 'strategies', device_strategies._id, device_strategies.filename);

    } catch (e) {
        console.error(e);
    } finally {

    }
    await client.close();
}

main().catch(console.error);

