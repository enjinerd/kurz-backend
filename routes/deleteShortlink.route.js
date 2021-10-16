const { Router } = require("express");
const { SuccessResponseObject } = require("../common/http");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config({ silent: process.env.NODE_ENV === "production" });

// Supabase .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const r = Router();

r.get("/", (req, res) => {
  res.status(403).send("FORBIDDEN");
});

r.post("/", async (req, res) => {
  const supabase = await createClient(supabaseUrl, supabaseKey);
  let { data } = await supabase
    .from("kurz_db")
    .select("short_link")
    .eq("delete_key", req.body.delete_key);

  if (data.length > 0) {
    await supabase
      .from("kurz_db")
      .delete()
      .eq("delete_key", req.body.delete_key);
    res.status(202).send({
      status: 202,
      message: `Shortlink https://krz.vercel.app/${data[0].short_link} has been deleted.`,
    });
  } else {
    res.status(404).send({
      error: true,
      message: "Delete key is invalid.",
    });
  }
});

module.exports = r;
