const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlsShortner', {
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

app.get('/:id', (req, res) => {
    ShortUrl.findOne({
        short: req.params.id
    }, (err, post) => {
        if (post != null) {
            if (!err) {
                res.redirect(post.full)
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    })
})
 
app.listen(process.env.PORT || 3000);
