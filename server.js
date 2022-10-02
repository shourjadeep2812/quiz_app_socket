const { createSocket } = require('dgram');
const express = require('express');

const app = new express()
const http = require('http');
// const { ClientSession } = require('mongodb');
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
const quiznamespace = io.of('/quiz');

quiznamespace.on('connection',async (socket)=>{

  console.log("A client is connected with the id",socket.id)
  socket.on("First_message",(msg)=>{
    console.log(msg);
  })
  socket.join("room1")


  //  socket.broadcast.emit("Questions","ques")
  setTimeout(()=>{
    quiznamespace.to("room1").emit("Questions","ques")
    currentTime1 = +new Date();
    socket.on("answer",(answer)=>{
      console.log("Inside answer")
      currentTime2 = +new Date()
      var timeTaken = currentTime2 - currentTime1
      clients.push(socket.id)
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
     quiznamespace.to("room1").emit("winnerIs",winnerId)
    })
  },5000)
    


  
})


quiznamespace.on('disconnect',(evt)=>{
  console.log("Done")
  // console.log(answers)
})

server.listen(3000,()=>{
    console.log("Server is listening")
  })