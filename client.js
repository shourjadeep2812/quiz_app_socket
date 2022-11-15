const {io} = require('socket.io-client');
const socket = io.connect("http://127.0.0.1:3000/quiz")

socket.emit("First_message","Hey server!!")

let clientCount = 0

socket.on("Questions",(ques)=>{
    clientCount++
    console.log(ques)
    socket.emit("answer","answer to the question")
    // if(clientCount == ques["id"])
    // {
    //     socket.emit("winner","")
    // }
    
})



socket.on("winnerIs",(winner)=>{
    console.log(winner)
})
