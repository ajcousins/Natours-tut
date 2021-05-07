const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// Middleware that runs on a specific aparmeter.
// Val is value of the parameter in question.
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
