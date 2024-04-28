//SQLITE-------
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// //NOTE - create citys table
// sql = `CREATE TABLE citys(id INTEGER PRIMARY KEY,Name,Distance)`;
// db.run(sql);

// //NOTE - Drop table
//db.run(`DROP TABLE citys`);

// //NOTE - create Vehicle table
// sql = `CREATE TABLE Vehicle(id INTEGER PRIMARY KEY,Kind,Range,Count)`;
// db.run(sql);

//db.run(`DROP TABLE Vehicle`);




// //NOTE - create cop's table
// sql = `CREATE TABLE Cops(id INTEGER PRIMARY KEY,Name)`;
// db.run(sql);


module.exports = db;