const express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
const connectDB = require('./config/db');
const socketio = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./user_socket.js');

const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

const router = require('./router');
app.use(router);

const server = http.createServer(app);
const io = socketio(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Connect DB
connectDB();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers",
'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  next();
});

io.on('connection', (socket) => {
  // console.log('New Connection ..');

  socket.on('join', ({ name, room }, callback) => {
    console.log(name,room);
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room); //Built in method to join user to room.

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});

    // Broadcast- send message to everyone except that particular user
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
   
   callback();

  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
    
    callback(); //Do smth after you send msg on front end.
  });


  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
    }
  })
});

// app.get('/', (req, res) => res.send('API Running')); removed while deploying to heroku

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));



// Serve ststic assets in production
if(process.env.NODE_ENV === 'production'){
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  });
}

// const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
