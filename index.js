require('dotenv').config();
const express = require('express');
const userrouter = require('./routes/user');
const taskrouter = require('./routes/task');
const mongoose  = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/user", userrouter)
app.use("/api/todo", taskrouter)

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port);
}

main();
