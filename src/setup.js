import { uploadImagesFromDisk } from "../sql/images.js";
import { promises } from 'fs';
import dotenv from 'dotenv';

import { query, end } from './db.js';

dotenv.config();

const shcemaFile= './sql/schema.sql';

const {
  DATABASE_URL: databaseUrl,
  /*CLOUDINARY_CLOUD = cloudinaryUrl,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,  
  IMAGE_FOLDER: imageFolder = "./data/img",*/
} = process.env;

async function main() {
  console.info(`Set upp gagnagrunn á ${databaseUrl}`);
 /* console.info(`Set uppp tengingu við Cloudinary á ${cloudinaryUrl}`);
  
  // senda myndir á Cloudinary
   try {
     images = await uploadImagesFromDisk(imageFolder);
     console.info(`Sendi ${images.length} myndir á Cloudinary`);
   } catch (e) {
     console.error("Villa við senda myndir á Cloudinary:", e.message);
   }*/

  const data = await promises.readFile(shcemaFile);

  await query(data.toString('utf-8'));

  await end();
}

main().catch((err) => {
    console.error(err);
});
  
