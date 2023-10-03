import { app } from './settings'
import {runDb} from "./repositories/db";
process.on('uncaughtException',(error)=>{
    console.log(error)})
process.on('unhandledRejection',(reason)=>{
    console.log(reason)})
const port = process.env.PORT || 3000
const startApp = async ()=> {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
const promise = new Promise(()=>{})
promise.then().catch().catch()