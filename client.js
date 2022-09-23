const {io} = require('socket.io-client');
const socket = io.connect("http://127.0.0.1:3000")

socket.emit("First_message","Hey server!!")



socket.on("Questions",(ans)=>{
    console.log(ans)
})

socket.emit("answer","answer to the question")
socket.emit("winner","")

socket.on("winnerIs",(winner)=>{
    console.log(winner)
})
