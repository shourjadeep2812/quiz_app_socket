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
// let count = 0
let answers = {}
let questions = [
  {
    "id":1,
    "question":"Python is what type of language?",
    "optionA":"scripting",
    "optionB":"compiling",
    "optionC":"shell",
    "optionD":"None",
    "ans":"A"
  },
  {
    "id":2,
    "question":"What do we need to store huge amounts of data?",
    "optionA":"File system",
    "optionB":"Database system",
    "optionC":"Cloud",
    "optionD":"None",
    "ans":"B"
  },
  {
    "id":3,
    "question":"What marks the end to a statement in programming?",
    "optionA":",",
    "optionB":":",
    "optionC":";",
    "optionD":".",
    "ans":"C"
  }
]
let questionObj = {}
let index = 0
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
  // count++
  // questionObj["count"] = count
  // questionObj["ques"] = "ques"


  //  socket.broadcast.emit("Questions","ques")

  questions.forEach((ques,index)=>{
    let interval = setInterval(()=>{

      quiznamespace.to("room1").emit("Questions",ques)
      currentTime1 = +new Date();
      socket.on("answer",(answer)=>{
  
        // console.log("Inside answer")
          currentTime2 = +new Date()
          var timeTaken = currentTime2 - currentTime1
          clients.push(socket.id)
          answers[timeTaken] = {
            "timeTaken": timeTaken,
            "answer": answer,
            "clientId":socket.id
          }
          clients.push(timeTaken)
          console.log(answers,questions[index])
    })
          
          // if(index == questions.length)
          // {
          //   clearInterval(interval)
            
          //   let winningTime = Math.min(...clients)
          //   let winner = answers[winningTime]
          //   quiznamespace.to("room1").emit("winnerIs",winner)
             
          // }
  
    },5000*index)
  })
  

      


  //   socket.on("winner",(dummy)=>{

  //     if(clients.length == count)
  //     {
  //       let winningTime = Math.min(...clients)
  //       let winner = answers[winningTime]
  //       quiznamespace.to("room1").emit("winnerIs",winner)
  //     }   

  //     // quiznamespace.to("room1").emit("winnerIs",winnerId)
      
  // })


})


quiznamespace.on('disconnect',(evt)=>{
  console.log("Done")
  // console.log(answers)
})

server.listen(3000,()=>{
    console.log("Server is listening")
  })