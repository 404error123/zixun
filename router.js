var express = require('express')

var router = express.Router()

router.get('/',function(req, res){
    res.render('index.html', {index : true})
})

router.get('/index.html',function(req, res){
    res.render('index.html', {index : true})
})

router.get('/page/column.html',function(req, res){
    res.render('page/column.html', {column : true})
})

router.get('/page/message.html',function(req, res){
    res.render('page/message.html', {message : true})
})

router.get('/page/user.html',function(req, res){
    res.render('page/user.html', {user : true})
})

module.exports = router