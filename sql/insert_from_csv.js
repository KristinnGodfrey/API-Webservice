import dotenv from "dotenv";
import csv from "csv-parser";
import fs from "fs";
import { truncateTable, query, end } from "../src/db.js";

dotenv.config();

async function insertGenres(rows) {
  let genres = [];
  let allGenres = [];

  await rows.forEach((row) => {
    allGenres = row.genres.split(",");
    allGenres.forEach((t) => {
      genres.push(t);
    });
  });
  genres = [...new Set(genres)];

  const q = "INSERT INTO genres (title) VALUES ($1)";
  await genres.forEach((genre) => {
    const values = [genre];
    query(q, values);
  });

  //todo tengitafla milli sjónvaprsþátta og sjónvarpsþáttategundar
}

async function insertSeries(row) { 
  const q = `
    INSERT INTO
      series
      (name, airdate, inProduction, tagline, image, description, language, network, webpage)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

  const values = [
    row.name,
    row.airDate,
    row.inProduction,
    row.tagline,
    row.image,
    row.description,
    row.language,
    row.network,
    row.homepage,
  ];
  return query(q, values);
}

function parseCsv(file) {
  let data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .on("error", (error) => {
        reject(error);
      })
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      });
  });
}
async function main() {
  console.info("Start inserting");
  const file = "./data/series.csv";
  const rows = await parseCsv(file);
  // console.log(rows);

  await truncateTable("series");
  for (let i = 0; i < rows.length; i++) {
    await insertSeries(rows[i]);
  }

  await truncateTable("genres");
  await insertGenres(rows);

  console.info("End inserting");
  await end();
}

await main().catch((err) => {
  console.error("Error inserting", err);
});
