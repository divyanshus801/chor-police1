const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const routes = require("./routes/route.js");
//NOTE - export db
require("./config/db.js");


//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());



//NOTE - router
app.use(routes);

//NOTE - testing api
app.use("/working", async (req, res) => {
  res.send({
    status: 200,
    message: "working",
  });
});

//SQLITE-------
// const sqlite3 = require('sqlite3').verbose();
// let db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Connected to the SQLite database.');
//   }
// });








//NOTE - local host
app.listen(port, () => {
  console.log(`Server Running On http://localhost:${port}`);
});
