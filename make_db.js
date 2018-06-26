// Node.js + Express server backend for petsapp
// v2 - use SQLite (https://www.sqlite.org/index.html) as a database
//
// COGS121 by Philip Guo
// https://github.com/pgbovine/COGS121

// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm pets.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('message.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE message_log (datetime TEXT, username TEXT, message TEXT, action TEXT, moderator TEXT, reason TEXT, channel TEXT)");

  // insert 3 rows of data:
  db.run("INSERT INTO message_log VALUES ('12-11-94', 'ashkon91', 'test', 'ban', 'ashkon', 'harassment', 'VGBC')");
  db.run("INSERT INTO message_log VALUES ('11-94-25', 'mang0', 'fuck mango', 'timeout', 'ashkon', 'harassment', 'VGBC')");
  db.run("INSERT INTO message_log VALUES ('test', 'hb0x', 'fuck hbox', 'ban', 'ashkon', 'harassment', 'VGBC')");

  console.log('successfully created the message_log table in message.db');

  // print them out to confirm their contents:
  db.each("SELECT datetime, username, message, action, moderator, reason, channel FROM message_log", (err, row) => {
      console.log(row.datetime + ": " + row.username + ' - ' + row.action);
  });
});

db.close();