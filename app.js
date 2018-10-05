var express = require('express')
var path = require('path')
var router = require('./router')
var compression = require('compression');  

var app = express()

app.use(compression());  

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')))
app.use('/favicon.ico', express.static(path.join(__dirname, './public/img/favicon.ico')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views'))

app.use(router)

app.use(function(req, res){
    res.render('404.html')
})

app.listen(2018, function(){
    console.log('running')
})