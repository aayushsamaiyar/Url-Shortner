require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlsShortner', {
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true}, () => {
        console.log('connected to database.')
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.get('/',async (req,res) => {
    const shortUrls = await ShortUrl.find({}).then((shortUrls)=>{
        res.render('index',{
            shortUrls
        })
    }).catch(() => {
        res.redirect('/')
    }) 
})

app.post('/shortUrls', async (req,res) => {
    await ShortUrl.create({ full: req.body.fullurl })
    res.redirect('/')
});

app.get('/:shorturl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
    if (shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
 
app.listen(process.env.PORT || 3000, () =>{
    console.log('server started on localhost:3000')
});
