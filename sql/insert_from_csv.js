import dotenv from "dotenv";
import csv from "csv-parser";
import fs from "fs";
import { truncateTable, query } from "./db.js";

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
async function insertShows(row) {
 
  const q = `
  INSERT INTO
    shows
    (name, number, airDate, description, season)
  VALUES
    ($1, $2, $3, $4, $5)`;
  const values = [
    row.name,
    row.number,
    row.airDate,
    row.description,
    row.season
  ];
  return query(q, values);
}

async function insertSeason(row) {
  const q = `
  INSERT INTO
    seasons
    (name, number, airdate, description, poster, tvShowName)
  VALUES
    ($1, $2, $3, $4, $5, $6)`;

  const values = [
    row.name,
    row.number,
    row.airDate,
    row.description,
    row.poster,
    row.tvShows.name
  ];
}

async function insertTvShows(row) { 

  const q = `
    INSERT INTO
      tvShows
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

  await truncateTable("tvShows");
  for (let i = 0; i < rows.length; i++) {
    await insertTvShows(rows[i]);
  }

  await truncateTable("genres");
  await insertGenres(rows);

  console.info("End inserting");
}

await main().catch((err) => {
  console.error("Error inserting", err);
});
