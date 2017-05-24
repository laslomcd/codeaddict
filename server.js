var express = require('express');
var methodOverride = require('method-override')
var fs = require('fs');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var http = require('http');
app.all('*', ensureSecure);
http.createServer(app).listen(80)
function ensureSecure(req, res, next){
    if(req.secure){
        // OK, continue
        return next();
    };
    // handle port numbers if you need non defaults
    // res.redirect('https://' + req.host + req.url); // express 3.x
    res.redirect('https://' + req.hostname + req.url); // express 4.x
}
var peer_options = {
    debug: true,
    ssl: {
        key: fs.readFileSync('/etc/letsencrypt/live/codeaddict.me/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/codeaddict.me/fullchain.pem')
    }
}
var options ={
    key: fs.readFileSync('/etc/letsencrypt/live/codeaddict.me/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/codeaddict.me/fullchain.pem')
}

var server = require('https').createServer(options, app );


app.use(methodOverride());
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/icons', express.static(__dirname + '/icons'));
app.engine('html', require('ejs').renderFile);
app.use('/peerjs', ExpressPeerServer(server, peer_options));

server.listen(443, function () {
    console.log('Express server listening on port 443');
});

app.get('/', function (req, res) {
    res.render('index.html');
});


server.on('connection', function(id) {
    console.log('user: ' + id + 'connected');

});

server.on('disconnect', function(id) {
    console.log('user: ' + id + 'disconnected');

});

/*socket.on('change', function (op) {
 if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
 socket.broadcast.to(socket.room).emit('change', op);

 }

 });
 socket.on('refresh', function (body_) {
 if (people[socket.id].inroom !== null || people[socket.id].inroom !== "undefined") {
 var room = people[socket.id].inroom;

 room.body = body_;
 }



 });*/





