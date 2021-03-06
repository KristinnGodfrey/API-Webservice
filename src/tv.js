import express from "express";
import {
  selectAll,
  selectAllWhereId,
  insertIntoSeries,
  deleteWhereId,
  patchWhereId,
} from "../src/db.js";
import { ensureLoggedIn } from './login.js';

export const router = express.Router();

// tv GET
router.get("/", ensureLoggedIn, async (req, res) => {
  const data = await selectAll("series");
  res.json({ data });
});

// tv POST
router.post("/", /* ensureAdmin, */ async (req, res) => {
  //todo error handling, authentication
  const row = req.body.data[0];
  console.info("POST: inserting row to db");
  insertIntoSeries(row);

  res.json({ success: "success" });
});

// tv/:id GET
router.get("/:id", /* ensureAdmin, */ ensureLoggedIn, async (req, res) => {
  let seriesId = Number(req.params.id);

  if (!Number.isInteger(seriesId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  const data = await selectAllWhereId("series", seriesId);
  res.json({ data });
});

// tv:id PATCH
router.patch("/:id", /* ensureAdmin, */  async (req, res) => {
  //todo authenticate
  let seriesId = Number(req.params.id);
  const row = req.body.data[0];

  if (!Number.isInteger(seriesId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  await patchWhereId("series", seriesId, row);
  res.json({ message: "patch successful" });
});

// tv:id DELETE
router.delete("/:id", /* ensureAdmin, */ async (req, res) => {
  //todo authenticate
  let seriesId = Number(req.params.id);

  if (!Number.isInteger(seriesId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  const data = await deleteWhereId("series", seriesId);
  if (data) {
  res.json({ message: "delete successful" });
  }
});
