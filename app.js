const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Url = require('./models/url')
const randomCode = require('./randomCode')

require('dotenv').config()

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.url
  console.log(`url = ${url}`)
  const shortenUrl = randomCode(5)
  return Url.create({ url, short_url: shortenUrl }).then(() => {
    res.render('output', { shortenUrl })
  })
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
