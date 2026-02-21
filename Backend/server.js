/*
server ko start krna
databse se connect krna
*/
require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/config/database");

connectToDb();

app.listen(3000, () => {
    console.log("server is running on port 3000")
});


// hmne render pr hmara ye pura Full Stack deploy toh kr diya and uska root Backend set krke because dist ki folders bhi hm public me le aaye the.
// but yaha ek dikkt aa rhi hai ki pehle hm localhost 3000 pr backend run ho rha tha and ab use ek url mil gya hai "https://full-stack-1-o577.onrender.com/" jo ki cloude pr run ho rha hai but jo hmari apis thi get post delete wali wo abhi bhi localhost pr hai. toh hm unn apis me localhost ki jgh render ki url dalenge.
// example: http://localhost:3000/api/notes  [ye localhost ki hai]
// ise hm change kr denge: https://full-stack-1-o577.onrender.com/api/notes
// toh frontend ke app.jsx me jaha jaha bhi localhost api fetch kr rhe hai wha wha isse replace kr denge.