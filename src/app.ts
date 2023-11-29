import express from 'express'
import Helmet from 'helmet'
import Cors from 'cors'
import Morgan from 'morgan'
import api from './api'
import { deserializeUserAndRoles } from './middleware/auth.middleware'
import { notFound, errorHandler } from './middleware/error.middleware'

const app = express()

app.use(express.json())
app.use(Helmet())
app.use(Cors())
app.use(Morgan('dev'))
app.use(deserializeUserAndRoles)
app.use('/api/v1', api)

app.use(notFound)
app.use(errorHandler)

export default app
