const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const routes = require("./routes/route.js");
const db = require("./config/db.js");
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

//NOTE - get
app.use("/GET_VEHICLE",async (req,res)=>{
  try {
    const VEHICLES = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM Vehicle", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    return res.status(200).send(VEHICLES);
} catch (err) {
    console.error(err.message);
}
})

//NOTE - local host
app.listen(port, () => {
  console.log(`Server Running On http://localhost:${port}`);
});
