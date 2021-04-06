const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost:27017/urlsShortner', {
    useNewUrlParser:true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.get('/',async (req,res) => {
    const shortUrls = await ShortUrl.find() 
    res.render('index',{ ShortUrls: shortUrls })
})

app.post('/shortUrls', async (req,res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shorturl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
    if (shortUrl == null) return res.sendStstus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
 
app.listen(process.env.PORT || 5000);
