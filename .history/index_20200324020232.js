let app = require('express')();
const express = require('express');
const session = require('express-session');
const User = require('core/user');
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

// Post login data
app.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    user.login(req.body.username, req.body.password, function(result) {
        if(result) {
            // Store the user data in a session.
            req.session.user = result;
            req.session.opp = 1;
            
            io.emit('Connected', req.body.username);
            // redirect the user to the home page.
            res.redirect('/');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    })

});


// Post register data
app.post('/register', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastId) {
            // Get the user data by it's id. and store it in a session.
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });

        }else {
            console.log('Error creating a new user ...');
        }
    });

});


// Get loggout page
app.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
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