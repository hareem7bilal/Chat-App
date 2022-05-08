const express=require('express');
const http=require('http');
const socketio = require('socket.io');
var cors = require('cors');
const PORT=process.env.PORT||5000

const {addUser,removeUser,getUser,getUsersInRoom}=require('./users.js')

const router=require('./router');

const app=express();
const server=http.createServer(app);

const io=socketio(server);



io.on('connection',(socket)=>{

    socket.on('join',({name, room},callback)=>{//socket.on for backend
        const {error,user}=addUser({id:socket.id,name,room})
        if(error) return callback(error)
        socket.emit('message',{user:'admin',text:`${user.name}, welcome to the room ${user.room}!`})//socket.on for frontend
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined!`})//everyone can see this msg
        socket.join(user.room)
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
        callback();
    })
    
    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id);
        io.to(user.room).emit('message',{user:user.name,text:message})
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
        callback();
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);
        if(user){
        io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left.`})
        }
    })
});

app.use(cors());
app.use(router);

server.listen(PORT,()=>console.log(`Server has started on port ${PORT}`));