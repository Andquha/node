const express = require("express");
const app = express();

app.listen(3001, () => {
  console.log("Backend server is running!");
});

app.get('/api', (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send({ "msg": "This has CORS enabled 🎈" });
})
