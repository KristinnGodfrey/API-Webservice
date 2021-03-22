import express from "express";
import { selectAll, selectAllWhereId, insertInto, deleteWhereId, patchWhereId } from "./db.js";

export const router = express.Router();

// season GET
router.get("/", async (req, res) => {
  const data = await selectAll("seasons");
  res.json({ data });
});

// season POST
router.post("/", async (req, res) => {
  //todo error handling, authentication
  const row = req.body.data[0];
  console.info("POST: inserting row to db");
  insertInto('seasons', row); 
  console.info("finished inserting");

  res.json({ success: "success" });
});

// season/:id GET
router.get("/:id", async (req, res) => {
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
router.delete("/:id", async(req,res) => {
  //todo authenticate
  let myId = Number(req.params.id);

  if (!Number.isInteger(myId)) {
    const message = "id must be int";
    return res.status(400).json({
      errors: [{ field: "typeError", message }],
    });
  }

  const data = await deleteWhereId("seasons", myId);
  res.json({ message: "delete successful" })
})

