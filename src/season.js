import express from "express";
import { selectAll, selectAllWhereId, insertIntoSeasons, deleteWhereId } from "./db.js";
import { ensureLoggedIn } from './login.js';

export const router = express.Router();

// season GET
router.get("/", ensureLoggedIn, async (req, res) => {
  const data = await selectAll("seasons");
  res.json({ data });
});

// season POST
router.post("/", /* ensureAdmin, */ async (req, res) => {
  const row = req.body.data[0];
  console.log(row);
  console.info("POST: inserting row to db");
  insertIntoSeasons(row); 

  res.json({ success: "success" });
});

// season/:id GET
router.get("/:id", ensureLoggedIn, async (req, res) => {
  let myId = Number(req.params.id);

  if (!Number.isInteger(myId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  const data = await selectAllWhereId("seasons", myId);
  res.json({ data });
});

// season:id DELETE
router.delete("/:id", /* ensureAdmin, */  async(req,res) => {
  let myId = Number(req.params.id);

  if (!Number.isInteger(myId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  
  const data = await deleteWhereId("seasons", myId);
  if (data) {
    res.json({ message: "delete successful" })
  }
})

