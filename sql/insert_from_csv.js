import dotenv from "dotenv";
import csv from "csv-parser";
import fs from "fs";
import { truncateTable, query, end } from "../src/db.js";


dotenv.config();

// const MIMETYPES = [
//   'image/jpeg',
//   'image/png',
//   'image/gif',
// ];

// async function updateProductWithImage(req, res, next) {
//   const { id } = req.params;
//   const { title, price, description, category } = req.body;

//   // file er tómt ef engri var uploadað
//   const { file: { path, mimetype } = {} } = req;

//   const hasImage = Boolean(path && mimetype);

//   const product = { title, price, description, category };

//   const validations = await validateProduct(product, true, id);

//   if (hasImage) {
//     if (!validateImageMimetype(mimetype)) {
//       validations.push({
//         field: 'image',
//         error: `Mimetype ${mimetype} is not legal. ` +
//                `Only ${MIMETYPES.join(', ')} are accepted`,
//       });
//     }
//   }
//   if (hasImage) {
//     let upload = null;
//     try {
//       upload = await cloudinary.uploader.upload(path);
//     } catch (error) {
//       // Skilum áfram villu frá Cloudinary, ef einhver
//       if (error.http_code && error.http_code === 400) {
//         return res.status(400).json({ errors: [{
//           field: 'image',
//           error: error.message,
//         }] });
//       }

//       console.error('Unable to upload file to cloudinary');
//       return next(error);
//     }

//     if (upload && upload.secure_url) {
//       product.image = upload.secure_url;
//     } else {
//       // Einhverja hluta vegna er ekkert `secure_url`?
//       return next(new Error('Cloudinary upload missing secure_url'));
//     }
//   }

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
async function insertEpisodes(row) {
  // console.log(row);
  const q = `
  INSERT INTO
    episodes
    (name, number, airDate, overview, season, serie, serieId)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7)`;
    
  const values = [
    row.name,
    row.number,
    row.airDate == "" ? null : row.airDate,
    row.overview,
    row.season,
    row.serie,
    row.serieId
  ];


  return query(q, values);
}

async function insertSeasons(row) {
  const q = `
  INSERT INTO
    seasons
    (name, number, airdate, overview, poster, serie, serieId)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7)`;

  const values = [
    row.name,
    row.number,
    row.airDate == "" ? null : row.airDate,
    row.overview,
    row.poster,
    row.serie,
    row.serieId,
  ];
  // console.log(values);
  return query(q, values);
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

  console.info("inserting series");
  let file = "./data/series.csv";
  let rows = await parseCsv(file);  
  await truncateTable("series");
  for (let i = 0; i < rows.length; i++) {
    await insertSeries(rows[i]);
  }

  console.info("inserting genres");
  await truncateTable("genres");
  await insertGenres(rows);


  console.info("inserting seasons");
  file = "./data/seasons.csv";
  rows = await parseCsv(file);
  await truncateTable("seasons");
  for (let i = 0; i < rows.length; i++) {
    await insertSeasons(rows[i]);
  }

  console.info("inserting episodes");
  file = "./data/episodes.csv";
  rows = await parseCsv(file);
  await truncateTable("episodes");
  for (let i = 0; i < rows.length; i++) {
    await insertEpisodes(rows[i]);
  }

  
  console.info("End inserting");
  await end();
}

main().catch((err) => {
  console.error("Error inserting", err);
});
