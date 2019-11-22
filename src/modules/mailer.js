const path       = require('path')
const nodemailer = require('nodemailer')
const hbs        = require('nodemailer-express-handlebars')
const { host, port, user, pass } = require('../config/mail.json')

const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass
    }
});

transporter.use('compile', hbs({
  viewEngine: {
    partialsDir: path.resolve('./src/resources/mail/'),
    layoutsDir: path.resolve('./src/resources/mail/'),
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
}))

module.exports = transporter
