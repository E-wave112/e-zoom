const express = require('express');
//initialize the app
const app = express();
const server = require('http').createServer(app);
//requiring the socket.io library
const io = require('socket.io')(server)
//an utility js library for creating unique ids
const { v4: uuidv4 } = require('uuid')
//the peer js library for enabling rtc between two users
const { ExpressPeerServer } = require('peer')
//initiate the peerjs server
const peerServer = ExpressPeerServer(server,{
    debug:true
});


app.set('view engine','ejs')
app.use(express.static('public'));
app.use('/peerjs', peerServer)

app.get('/', (req,res)=>{

    res.redirect(`/${uuidv4()}`)
})
//ROUTES

app.get('/:room', (req,res)=>{

    res.render('room',{roomId:req.params.room});
})

//activate the websocket to enable user connections
io.on('connection',(socket) => {
    socket.on('join-room',(roomId,userId) =>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('message',message =>{
            io.to(roomId).emit('createMessage', message)
        })
    })
    console.log('joined-room')
})

// const PORT = 3000

// app.listen(PORT);


server.listen(3030)