const mongodb = require("mongodb");
const stream = require("stream");
const connectionString = "mongodb://localhost:27017";
const databaseName = "dissect";
const userCollectionName = "users";
const providersCollectionName = "providers";
const resourceCollectionName = "resources";
const strategiesCollectionName = "strategies";
const simulationCollectionName = "simulator_jobs";
const configurationCollectionName = "configurations";

async function addUser(user) {
    const client = await mongodb.MongoClient(connectionString).connect();
    try {
        return await client.db(databaseName).collection(userCollectionName).insertOne(user);
    } catch (e) {
        console.log('mongodb-service: addUser() error:' + e.message);
        throw e;
    } finally {
        await client.close();
    }
}

async function getUser(user) {
    const client = await mongodb.MongoClient(connectionString).connect();
    try {
        return await client.db(databaseName).collection(userCollectionName).findOne(user);
    } catch (e) {
        console.log('mongodb-service: getUser() error:' + e.message);
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
        console.log('mongodb-service: getAllUsers() error:' + e.message);
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
        console.log('mongodb-service: getProvidersFile() error:' + e.message);
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
        console.log('mongodb-service: getStrategyFile() error:' + e.message);
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
        console.log('mongodb-service: getResourceFiles() error:' + e.message);
        throw e;
    } finally {
        await client.close();
    }
}

async function addJob(job) {
    const client = await mongodb.MongoClient(connectionString).connect();
    job.user = new mongodb.ObjectId(job.user);

    try {
        return await client.db(databaseName).collection(simulationCollectionName).insertOne(job);
    } catch (e) {
        console.log('mongodb-service: addJob() error:' + e.message);
        throw e;
    } finally {
        await client.close();
    }
}

async function addConfiguration(configuration) {
    const client = await mongodb.MongoClient(connectionString).connect();
    configuration.user = new mongodb.ObjectId(configuration.user);

    try {
        return await client.db(databaseName).collection(configurationCollectionName).insertOne(configuration);
    } catch (e) {
        console.log('mongodb-service: addConfiguration() error:' + e.message);
        throw e;
    } finally {
        await client.close();
    }
}

async function getSimulationById(id){
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        const job = await client.db(databaseName).collection(simulationCollectionName).findOne(new mongodb.ObjectId(id));
        for (const property in job.results) {
            job.results[property] = await getFileById(job.results[property]).then(res => {
                return "'" + res + "'";
            });
        }

        return job;
    } catch (e) {
        console.log('mongodb-service: getSimulationById() error:' + e.message);
        throw e;
    } finally {
        await client.close();
    }
}

async function getConfigurationById(id) {
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        const config = await client.db(databaseName).collection(configurationCollectionName).findOne(new mongodb.ObjectId(id)).then(res => {
            return res;
        });

        let simulations = [];

        for (const jobId of config.jobs) {
            await getSimulationById(jobId).then(
                res => simulations.push(res));
        }

        config.jobs = simulations;

        return config;

    } catch (e) {
        console.log('mongodb-service: getConfigurationById() error:' + e.message);
        throw e;
    } finally {
        await client.close();
    }
}

async function getConfigurationsByUserId(id) {
    const client = await mongodb.MongoClient(connectionString).connect();

    try {
        return await client.db(databaseName).collection(configurationCollectionName).find({
            user: new mongodb.ObjectId(id.toString())
        }).toArray();
    } catch (e) {
        console.log('mongodb-service: getConfigurationsByUserId() error:' + e.message);
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
        console.log('mongodb-service: getFileById() error:' + e.message);
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
        console.log('mongodb-service: saveFile() error:' + e.message);
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
    getSimulationById,
    getConfigurationById,
    getConfigurationsByUserId,
    getFileById,
    saveFile
}