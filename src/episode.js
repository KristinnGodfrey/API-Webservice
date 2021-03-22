import express from "express";
import {
  selectAll,
  selectAllWhereId,
  insertIntoEpisodes,
  deleteWhereId,
  patchWhereId,
} from "./db.js";
import { ensureAdmin, ensureLoggedIn } from "./login.js";

export const router = express.Router();

// episode POST
router.post(
  "/",
  /* ensureAdmin, */ async (req, res) => {
    const row = req.body.data[0];

    console.info("POST: inserting row to db");
    insertIntoEpisodes(row);

    res.json({ success: "success" });
  }
);

// episode/:id GET
router.get("/:id", ensureLoggedIn, async (req, res) => {
  let myId = Number(req.params.id);

  if (!Number.isInteger(myId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  const data = await selectAllWhereId("episodes", myId);
  res.json({ data });
});

// episode/:id DELETE
router.delete(
  "/:id",
  /* ensureAdmin, */ async (req, res) => {
    //todo authenticate
    let myId = Number(req.params.id);

    if (!Number.isInteger(myId)) {
      const message = "id must be int";
      return res.status(400).json({
        errors: [{ field: "typeError", message }],
      });
    }

    const data = await deleteWhereId("episodes", myId);
    res.json({ message: "delete successful" });
  }
);
