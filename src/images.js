import dotenv from "dotenv";
import cloudinary from "cloudinary";
import util from "util";
import fs from "fs";
import path from "path";

dotenv.config();

const readDirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);
const resourcesAsync = util.promisify(cloudinary.api.resources);
const uploadAsync = util.promisify(cloudinary.uploader.upload);

let cachedListImages = null;

async function listImages() {
  if (cachedListImages) {
    return Promise.resolve(cachedListImages);
  }

  // TODO hér þyrfti að taka við pageuðum niðurstöðum frá Cloudinary
  // en þar sem við erum með 20 myndir fáum við hámark per request og látum duga
  const res = await resourcesAsync({ max_results: 100 });

  cachedListImages = res.resources;

  return res.resources;
}

function imageComparer(current) {
  // TODO hér ættum við að bera saman fleiri hluti, t.d. width og height
  return (uploaded) => uploaded.bytes === current.size;
}

async function getImageIfUploaded(imagePath) {
    const uploaded = await listImages();
  
    const stat = await statAsync(imagePath);
  
    const current = { size: stat.size };
  
    const found = uploaded.find(imageComparer(current));
  
    return found;
}

export async function uploadImageIfNotUploaded(imagePath) {
  const alreadyUploaded = await getImageIfUploaded(imagePath);

  if (alreadyUploaded) {
    debug(`Mynd ${imagePath} þegar uploadað`); //eslint-disable-line no-undef
    return alreadyUploaded.secure_url;
  }

  const uploaded = await uploadAsync(imagePath);
  debug(`Mynd ${imagePath} uploadað`); //eslint-disable-line no-undef

  return uploaded.secure_url;
}

export async function uploadImagesFromDisk(imageDir) {
  const imagesFromDisk = await readDirAsync(imageDir);

  const filteredImages = imagesFromDisk.filter(
    (i) => path.extname(i).toLowerCase() === ".jpg"
  );

  debug(`Bæti við ${filteredImages.length} myndum`); //eslint-disable-line no-undef

  const images = [];

  for (let i = 0; i < filteredImages.length; i++) {
    const image = filteredImages[i];
    const imagePath = path.join(imageDir, image);
    const uploaded = await uploadImageIfNotUploaded(imagePath); // eslint-disable-line

    images.push(uploaded);
  }

  debug("Búið að senda myndir á Cloudinary"); //eslint-disable-line no-undef

  return images;
}
