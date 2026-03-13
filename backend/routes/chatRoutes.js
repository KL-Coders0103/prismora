const express = require("express");

const router = express.Router();

const { chatQuery } = require("../controllers/chatController");

router.post("/", chatQuery);

module.exports = router;