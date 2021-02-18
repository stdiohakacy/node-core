import { ExpressServer } from './server';
import * as express from 'express'

ExpressServer.init((app: express.Application) => {})
    .createServer()
    .createConnection()
    .then(() => {
        ExpressServer.run('5000')
    })
