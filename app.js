const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
