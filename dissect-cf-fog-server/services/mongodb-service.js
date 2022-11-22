const mongodb = require("mongodb");
const stream = require("stream");
const connectionString = "mongodb://localhost:27017";
const databaseName = "dissect";
const userCollectionName = "users";
const providersCollectionName = "providers";
const resourceCollectionName = "resources";
const strategiesCollectionName = "strategies";
const jobCollectionName = "simulator_jobs";
const configurationCollectionName = "configurations";

async function addUser(user) {
    const client = await mongodb.MongoClient(connectionString).connect();
    try {
        return await client.db(databaseName).collection(userCollectionName).insertOne(user);
    } catch (e) {
        console.log(' mongodb addUser() error:' + e.message);
    } finally {
        await client.close();
    }
}

async function getUser(user) {
    const client = await mongodb.MongoClient(connectionString).connect();
    try {
        return await client.db(databaseName).collection(userCollectionName).findOne(user);
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function getAllUsers() {
    const client = await mongodb.MongoClient(connectionString).connect();
    try {
        return await client.db(databaseName).collection(userCollectionName).find();
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function getProvidersFile(filename){
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        return await client.db(databaseName).collection(providersCollectionName).findOne(filename);
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }

}

async function getStrategyFile(filename) {
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        return await client.db(databaseName).collection(strategiesCollectionName).findOne(filename);
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function getResourceFiles(){
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        return await client.db(databaseName).collection(resourceCollectionName).find().toArray();
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function addJob(job) {
    const client = await mongodb.MongoClient(connectionString).connect();
    console.log("JOOOOOB " + job.user);
    job.user = new mongodb.ObjectId(job.user);

    try {
        return await client.db(databaseName).collection(jobCollectionName).insertOne(job);
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function addConfiguration(configuration) {
    const client = await mongodb.MongoClient(connectionString).connect();
    console.log('COOONFIG' + configuration.user);
    configuration.user = new mongodb.ObjectId(configuration.user);

    try {
        return await client.db(databaseName).collection(configurationCollectionName).insertOne(configuration);
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function getSimulatorJobById(id){
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        return await client.db(databaseName).collection(jobCollectionName).findOne(new mongodb.ObjectId(id));
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function getConfigurationById(id) {
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        return await client.db(databaseName).collection(configurationCollectionName).findOne(new mongodb.ObjectId(id));
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

async function getConfigurationsByUserId(id) {
    const client = await mongodb.MongoClient(connectionString).connect();
    console.log('IDDDD' + JSON.stringify(id));
    const what = new mongodb.ObjectId(id);

    try {
        return await client.db(databaseName).collection(configurationCollectionName).find({
            user: new mongodb.ObjectId(id.toString())
        }).toArray();
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }

}

async function getFileById(id){
    const client = await mongodb.MongoClient(connectionString).connect();
    const stream = new mongodb.GridFSBucket(client.db(databaseName)).openDownloadStream(new mongodb.ObjectId(id));

    try {
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
    } catch (e){
        throw e;
    } finally {
        await client.close();
    }
}

async function saveFile(name, data) {
    const client = await mongodb.MongoClient(connectionString).connect();
    const bucket = new mongodb.GridFSBucket(client.db(databaseName));

    try {
        const s = new stream.Readable();
        s.push(data);
        s.push(null);

        const res = await new Promise((resolve, reject) => {
            s.pipe(bucket.openUploadStream(name))
                .on('error', function (err) {
                    reject(err);
                })
                .on('finish', function (file) {
                    resolve(file);
                });
        })

        return res._id;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }

}

module.exports = {
    addUser,
    getUser,
    getAllUsers,
    getProvidersFile,
    getResourceFiles,
    getStrategyFile,
    addJob,
    addConfiguration,
    getSimulatorJobById,
    getConfigurationById,
    getConfigurationsByUserId,
    getFileById,
    saveFile
}