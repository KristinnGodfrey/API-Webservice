import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;
const pool = new pg.Pool({ connectionString, ssl });

export async function query(_query, values = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(_query, values);
    return result;
  } finally {
    await client.release();
  }  
}

export async function truncateTable(table){
  const q = `TRUNCATE TABLE ${table} RESTART IDENTITY;`;
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error: ', e);
  }
  return result.rows;
}

export let selectAll = async (table) => {
  const q = `SELECT * FROM ${table};`;
  let result = '';
  try {
    result = await query(q);
  } catch (error) {
    console.info('Error: ', e);
  }
  return result.rows;
}

export let selectAllWhereId = async (table, id) => {
  const q = `SELECT * FROM ${table} WHERE ID = ${id};`
  let result = '';
  try {
    result = await query(q);
  } catch (error) {
    console.info('Error: ', error);
  }
  return result.rows;
}

// Helper to remove pg from the event loop
export async function end() {
  await pool.end();
}