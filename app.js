const express = require('express')
const dotenv = require('dotenv')
const app = express()

dotenv.config()
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
