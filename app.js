const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Url = require('./models/url')
const generateRandomCode = require('./generateRandomCode')

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

app.post('/', async (req, res) => {
  try {
    const url = req.body.url
    const data = await Url.findOne({ url: url }).lean()
    let shortenUrl
    let isExist = 1
    if (data) {
      shortenUrl = data.shortenUrl
    } else {
      while (isExist) {
        shortenUrl = generateRandomCode(5)
        isExist = await Url.exists({ shortenUrl: shortenUrl })
      }
      Url.create({ url, shortenUrl })
    }
    return res.render('output', { shortenUrl })
  } catch (err) {
    console.log(err)
  }
})

app.get('/:shortenUrl', (req, res) => {
  const shortenUrl = req.params.shortenUrl
  Url.findOne({ shortenUrl })
    .lean()
    .then((data) => {
      if (data) {
        res.redirect(data.url)
      } else {
        res.render('error')
      }
    })
    .catch((error) => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
