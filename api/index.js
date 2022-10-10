const express = require("express");
const app = express();

app.listen(3001, () => {
  console.log("Backend server is running!");
});

app.get('/api', (req,res) => {
  res.json({
    message: "Hello from backend"
  })
})