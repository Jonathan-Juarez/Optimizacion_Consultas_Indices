const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post("/createCars", carController.createCars);
router.post("/createIndexes", carController.createIndexes);
router.get("/query1", carController.query1);
router.get("/query2", carController.query2);
router.get("/queryWithoutIndex3", carController.queryWithoutIndex3);
router.get("/queryWithIndex3", carController.queryWithIndex3);


module.exports = router;