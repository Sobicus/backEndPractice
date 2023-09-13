import {MongoClient} from 'mongodb'

const mongoUri = process.env.mongoUri || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoUri)
export const dataBaseName = 'dataBaseHW'
export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect()
        // Establish and verufy connection
        await client.db('dataBaseHW3').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Can`t connect to db')
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}