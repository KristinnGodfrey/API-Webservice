import { promises } from 'fs';
import { query, end } from './db.js';

const schemaFile = './sql/schema.sql';

async function main() {
  const data = await promises.readFile(schemaFile);
  await query(data.toString('utf-8'));

  await end();
}

main().catch((err) => {
    console.error(err);
});
