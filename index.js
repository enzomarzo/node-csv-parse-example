import { parse } from "csv-parse"; // use ESM instead of commonJS
import fs from "fs";

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  const confirmedPlanet = planet["koi_disposition"] === "CONFIRMED";
  const isHabitable = planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11;
  const isPlanetaryRadius = planet["koi_prad"] < 1.6
  return confirmedPlanet && isHabitable && isPlanetaryRadius
}

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#", // the comments on the csv is #, so I am telling the parser
      columns: true, // I also need to tell about the columns so I can have a proper javascript object from the columns instead of everything inside an array
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) habitablePlanets.push(data);
  })
  .on("error", (err) => console.log(err))
  .on("end", () => console.log(habitablePlanets.map((planet) => planet['kepler_name'])));
