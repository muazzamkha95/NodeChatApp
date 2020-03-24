let app = require('express')();
const session = require('express-session');
let http = require('http').Server(app);
let io = require('socket.io')(http);
// const pageRouter = require('./routes/pages');

// Routers
// app.use('/', pageRouter);

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
    res.sendFile(__dirname + '/index.html')
});


http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {

    socket.emit('connect',()=>{
        console.log
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