  const express = require('express')
  const app = express()
  const port = 3000
  const mainRoute = require('./routes/mainRoute')
  const cors = require('cors')
  const sequelize = require('../Server/config/config')
  const env = require('dotenv').config()

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({extended : true}))

  app.use('/',mainRoute)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })