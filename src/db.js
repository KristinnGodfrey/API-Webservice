import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = "development",
} = process.env; //eslint-disable-line no-undef

if (!connectionString) {
  console.error("Vantar DATABASE_URL");
  process.exit(1); //eslint-disable-line no-undef
}

const ssl = nodeEnv !== "development" ? { rejectUnauthorized: false } : false;
const pool = new pg.Pool({ connectionString, ssl });

export async function query(_query, values = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(_query, values);
    return result;
  } catch (e) {
    console.log("villa í query");
    console.info("Error", e);
  } finally {
    client.release();
  }  
}

export async function truncateTable(table) {
  const q = `TRUNCATE TABLE ${table} RESTART IDENTITY;`;
  let result = "";
  try {
    result = await query(q);
  } catch (e) {
    console.info("Error: ", e.message);
  }
  return result.rows;
}

export let selectAll = async (table) => {
  console.log(table);
  const q = `SELECT * FROM ${table};`;
  let result = "";
  try {
    result = await query(q);
  } catch (error) {
    console.info("Error: ", e.message); //eslint-disable-line no-undef
  }
  return result.rows;
};

export let selectAllUsers = async (table) => {
  console.log(table);
  const q = `SELECT id, email, admin, created, updated FROM ${table};`;
  let result = "";
  try {
    result = await query(q);
  } catch (error) {
    console.info("Error: ", e.message); //eslint-disable-line no-undef
  }
  return result.rows;
};

export async function selectAllWhereId(table, id) {
  const q = `SELECT * FROM ${table} WHERE id = $1;`;
  let result = "";
  try {
    result = await query(q, [id]);
  } catch (error) {
    console.info("Error: ", error);
  }
  return result.rows;
}

export async function selectAllByUsername(username) {
  const q = `SELECT id, email, admin, created, updated FROM users WHERE username = $1;`;
  let result = "";
  try {
    result = await query(q, [username]);
  } catch (error) {
    console.info("Error: ", e.message); //eslint-disable-line no-undef
  }
  return result.rows;
}

export async function insertIntoSeries(row) {
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

export async function insertIntoSeasons(row) {
  const q = `
    INSERT INTO
      seasons
      (name,number,airDate,overview,poster,serie,serieId)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)`;

  const values = [
    row.name,
    row.number,
    row.airDate,
    row.overview,
    row.poster,
    row.serie,
    row.serieId,
  ];
  return query(q, values);
}

export async function insertIntoEpisodes(row) {
  const q = `
    INSERT INTO
      episodes
      (name, number, airDate, overview, season, serie, serieId)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)`;

  const values = [
    row.name,
    row.number,
    row.airDate,
    row.overview,
    row.season,
    row.serie,
    row.serieId,
  ];
  return query(q, values);
}

export let patchWhereId = async (table, id, row) => {
  // console.log(row);
  let q;
  let result = "";
  for (const [key, value] of Object.entries(row)) {
    q = `UPDATE ${table} SET ${key} = '${value}' WHERE id = $1;`;
    try {
      result = await query(q, [id]);
    } catch (error) {
      console.info("Error: ", error);
    }
  }
  return result.rows;
};

export let deleteWhereId = async (table, id) => {
  const q = `DELETE FROM ${table} where id = $1;`;
  let result = "";
  try {
    result = await query(q, [id]);
  } catch (error) {
    console.info("Error: ", error);
  }
  return result.rows;
};

export async function registerDB(data) {
  const q = `INSERT INTO users (username, password, email, created)
            VALUES
            ($1, $2, $3, $4)`;

  let result = '';
  result = await query(q, data);
  return result;
}

export async function changeDB(data) {
  let q = ``;
  let values = [];
  if (data.email && data.hashedPassword) {
    q = `UPDATE users SET email = $2, password = $3 
        WHERE username = $1`;
    values = [data.username, data.email, data.hashedPassword];
    console.log("email & password DB", typeof data.email);
  } else if (data.email) {
    q = `UPDATE users SET email = $2
        WHERE username = $1`;
    console.log("email DB");
    values = [data.username, data.email];
  } else {
    q = `UPDATE users SET password = $2
        WHERE username = $1`;
    console.log("password DB");
    values = [data.username, data.hashedPassword];
  }

  await query(q, values);
}

// Helper to remove pg from the event loop
export async function end() {
  await pool.end();
}
