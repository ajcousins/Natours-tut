const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // req.params give access to the assigned id value/ variable.
  console.log(req.params);
  const id = req.params.id * 1; // '* 1' Converts string to number.
  // Find takes a callback function, which loops through array, returning true of false.
  // Find method creates a new array for each value in array that is 'true'.
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

// Async function to communicate with database.
// Alternatively use .then()
exports.createTour = async (req, res) => {
  try {
    // 1) Creates a tour based on the model, and then call save method on newTour.
    // const newTour = new Tour({})
    // newTour.save()

    // 2) Calling create() method directly on Tour model.
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// "exports." instead of const or "module.exports = router;" to export individual/ multiple functions.
