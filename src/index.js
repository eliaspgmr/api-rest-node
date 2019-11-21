const express    = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * Route Test to test the comunication
 * of the server.
 *
 *  app.get('/', (req, res) => {
 *      return res.json({ message: 'Hello, world!' })
 *  })
 *
*/

require('./app/controllers')(app)

app.listen(3333)
