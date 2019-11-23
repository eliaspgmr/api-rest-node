const express  = require('express')
const cors     = require('cors')
const routes   = require('./routes')
//const mongoose = require('mongoose')

const app = express()

/**
 * Connection to the MogoDB Data Base Cluster.
 */
require('./database/connection')

app.use(cors()) // Allow access from every frontend.
app.use(express.json()) // This line turn possible tho return json format data.
app.use(routes) // Call to the routes.

/**
 * Route Test to test the comunication
 *
 * of the server.
 *
 * app.get('/', (req, res) => {
 *    return res.json({ message: 'Hello, world!' })
 * })
 */

app.listen(3333) // Port to be uses by Node server.
