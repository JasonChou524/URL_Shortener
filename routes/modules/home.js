const express = require('express')
const router = express.Router()
const Url = require('../../models/url')
const generateRandomCode = require('../../utils/generateRandomCode')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', async (req, res) => {
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

router.get('/:shortenUrl', (req, res) => {
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

module.exports = router
