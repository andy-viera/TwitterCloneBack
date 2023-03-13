//node seeders/runAllSeeders.js
require("dotenv").config();

async function runAllSeeders() {
  await require("./userSeeder")();
  await require("./tweetSeeder")();

  console.log("[Database] ¡Los datos de prueba fueron insertados!");
  process.exit();
}

runAllSeeders();
