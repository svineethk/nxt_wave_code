const express = require("express");
const path = require("path");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET API
app.get("/players/", async (request, response) => {
  const getBookQuery = `select * from cricket_team order by player_id`;
  const playerArray = await db.all(getBookQuery);
  response.send(playerArray);
});

// POST API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `Insert Into cricket_team (player_name , jersey_number , role) values ('${player_name}' , ${jersey_number} , '${role}')`;
  let res = await db.run(addPlayerQuery);
  const playerId = res.lastID;
  response.send({ playerId: playerId });
});
