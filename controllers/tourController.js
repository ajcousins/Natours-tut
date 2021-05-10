const { query } = require('express');
const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1a) Filtering
    // Shallow copy of query object:
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Remove exluded fields from query objects.
    excludedFields.forEach((el) => delete queryObj[el]);
    // Compare queryObj with amended/ queryObj copy.
    // console.log(req.query, queryObj);

    // Access query string: req.query. Returns query object, which can be passed into find() method.
    // console.log(req.query);

    // 1b) Advanced filtering
    // Convert object to string.
    // Mongo uses "$" in operator. Need to find gte/lte operators in query string and replace with $gte/$lte etc.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // Find method on the Tour model.
    // find() method returns everything if nothing passed in.

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2) Sorting
    // Sorting criteria sepatated by comma in URL. Need to replace with space.
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude field "-"
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    // "|| 1": default value
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // 1-10, page; 11-20, page 2...
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // BUILD QUERY

    // EXECUTE QUERY
    // Create new object of the APIFeatures class.
    // In there we pass a query object and query string.
    // In each method, the query is manipulated.
    // Then await result of query, which is stored in 'const features'.
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // ":id" is passed as a param through route.
    // findById() is the same as MongoDB Tour.findOne({ _id: req.params.id})
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
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

exports.updateTour = async (req, res) => {
  try {
    // findByIdAndUpdate(<id>, <data to change>, <options> )
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // return modified doc instead of original
      new: true,
      // validate operation against model's schema. checks data types (string number etc), required etc...
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

// "exports." instead of const or "module.exports = router;" to export individual/ multiple functions.
