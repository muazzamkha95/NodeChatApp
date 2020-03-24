let app = require('express')();
const express = require('express');
const session = require('express-session');
let http = require('http').Server(app);
let io = require('socket.io')(http);
const path = require('path');
// const pageRouter = require('./routes/pages');

app.set('view engine', 'pug');

// Routers
// app.use('/', pageRouter);
// for body parser. to collect data that sent from the client.
app.use(express.urlencoded( { extended : false}));


// Serve static files. CSS, Images, JS files ... etc
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
    secret:'youtube_video',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

app.get('/', (req, res) => {
    
    let user = req.session.user;
    if(user) {
        res.render('chat', {opp:req.session.opp, name:user.fullname});
         return;
     }else{
         res.render('chat', {opp:null, name:'Guest'});
     }
    res.sendFile(__dirname + '/index.html')
});

app.get('/login',(req, res, next)=>{
    res.render('loginPage', {title:"Login"});
});

app.get('/signup',(req, res, next)=>{
    res.render('signupPage', {title:"Register"});
});
http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    console.log('new user connected='+socket.id);
    socket.emit('connected',()=>{
        console.log('user Connected'+socket.id)
    });
    socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});