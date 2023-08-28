import express, {Request, Response} from 'express'
export  const app = express()
const port = 3000

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!!!')
})

