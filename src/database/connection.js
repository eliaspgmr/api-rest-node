const mongoose  = require('mongoose')
const { dbserver, host, database } = require('../config/connection.json') 

mongoose.connect(`${dbserver}://${host}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
