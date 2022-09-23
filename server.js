const { createSocket } = require('dgram');
const express = require('express');

const app = new express()
const http = require('http');
const { ClientSession } = require('mongodb');
const server = http.createServer(app)
const {Server} = require('socket.io')

var currentTime1 = 0
var currentTime2 = 0
let clients = []
let count = 0
let answers = {}
const io = new Server(server,{
  cors:{
    // origin:"http://127.0.0.1:8000",
    methods:['GET','POST']
  }
})

io.on('connection',async (socket)=>{

  console.log("A client is connected with the id",socket.id)

  setTimeout(()=>{
   socket.broadcast.emit("Questions","ques")
   currentTime1 = +new Date()
  },10000)

  // socket.on("First_message",(msg)=>{
  //   socket.emit("reply_message","Hello from server!!")
  //   console.log(msg)

  // })

  // io.emit("Hello","World")

  socket.on("answer",(answer)=>{
    currentTime2 = +new Date()
    var timeTaken = currentTime2 - currentTime1
    // clients.push(socket.id)
    answers[timeTaken] = {
      "timeTaken": timeTaken,
      "answer": answer,
      "clientId":socket.id
    }
    clients.push(timeTaken)
    console.log(answers)
  })

  socket.on("winner",(dump)=>{
    let winningTime = Math.min(...clients)
    let winnerId = answers[winningTime]["clientId"]
    socket.broadcast.emit("winnerIs",winnerId)
  })
})


io.on('disconnect',(evt)=>{
  console.log("Done")
  console.log(answers)
})

server.listen(3000,()=>{
    console.log("Server is listening")
  })