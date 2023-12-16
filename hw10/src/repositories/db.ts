import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URL ||'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL)

export const client = new MongoClient(mongoUri)
export const dataBaseName = 'MyDataBase'
export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect()
        // Establish and verufy connection
        await client.db(dataBaseName).command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Can`t connect to db')
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}