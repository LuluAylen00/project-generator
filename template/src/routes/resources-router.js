const express = require("express");
const path = require("path");
const router = express.Router();

const resourcesController = require("../controllers/resources-controller");

// Create
router.post('/resources', resourcesController.resourceCreate);

// Read
router.get('/resources', resourcesController.resourcesList);
router.get('/resources/:id', resourcesController.resourceDetail);

// Update
router.put('/resources/:id', resourcesController.resourceUpdate);

// Delete
router.delete('/resources/:id', resourcesController.resourceDelete);

module.exports = router;