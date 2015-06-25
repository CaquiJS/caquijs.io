/**
* Module dependencies.
*/

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, server = require('http').Server(app)
, io   = require('socket.io').listen(server)
, DataLinkProvider = require('./datalinkprovider').DataLinkProvider;

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function(){
    app.use(express.errorHandler());
});

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

var datalinkProvider= new DataLinkProvider('localhost', 27017);

//Routes

//index
app.get('/', function(req, res){
    datalinkProvider.findAll(req.query, function(error, dataLinks, alldataLinks){

        var tags = [];
        for(var i = 0; i < alldataLinks.length; i++){
            // tags.push( Object.keys(alldataLinks[i].tags).map(function(k) { return alldataLinks[i].tags[k] }));
            tags = tags.concat( alldataLinks[i].tags );
        }
        //tags = tags.map(function(v){ return {value: v}; });

        res.render('index', {
            title: 'CaquiJS',
            dataLinks: dataLinks,
            numLinks: Object.keys(dataLinks).length,
            tags: JSON.stringify(tags)
        });
    });
});

//cms
app.get('/dataLink/cms', function(req, res){
    datalinkProvider.findAll(function(error, dataLinks){
        res.render('cms', {
            title: 'CaquiJS',
            dataLinks: dataLinks,
            numLinks: Object.keys(dataLinks).length
        });
    });
});

//new dataLink
app.get('/dataLink/new', function(req, res) {
    res.render('dataLink_new', {//dataLink_new.jade
        title: 'New dataLink'
    });
});

//save new dataLink
app.post('/dataLink/new', function(req, res){
    datalinkProvider.save(
    {
        usertoken:   req.param('usertoken'),
        title:       req.param('title'),
        description: req.param('description'),
        imgurl:      req.param('imgurl'),
        link:        req.param('link'),
        tags:        req.param('tags')//separated of comma
    }, function( error, docs) {
        res.redirect('/dataLink/cms')
    });
});

//update an dataLink
app.get('/dataLink/:id/edit', function(req, res) {
    datalinkProvider.findById(req.param('_id'), function(error, dataLink) {
        res.render('dataLink_edit',
        {
            dataLink:    dataLink,
            title:       dataLink.title,
            usertoken:   dataLink.usertoken,
            description: dataLink.description,
            imgurl:      dataLink.imgurl,
            link:        dataLink.link,
            tags:        dataLink.tags
        });
    });
});

//save updated dataLink
app.post('/dataLink/:id/edit', function(req, res) {
    datalinkProvider.update(req.param('_id'),
    {
        usertoken:   req.param('usertoken'),
        title:       req.param('title'),
        description: req.param('description'),
        imgurl:      req.param('imgurl'),
        link:        req.param('link'),
        tags:        req.param('tags')//separated of comma
    }, function(error, docs) {
        res.redirect('/dataLink/cms')
    });
});

//delete an dataLink
app.post('/dataLink/:id/delete', function(req, res) {
    datalinkProvider.delete(req.param('_id'), function(error, docs) {
        res.redirect('/dataLink/cms')
    });
});

app.listen(process.env.PORT || 3000);
