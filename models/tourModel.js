const mongoose = require('mongoose');

// Schema/ blueprint for data.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true + error string
    required: [true, 'A tour must have a name.'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, // Reference to image in database
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], // Array of Strings.
  createdAt: {
    type: Date,
    default: Date.now(), // Converted to today's date by Mongo
    select: false, // Hides field from output
  },
  startDates: [Date], // Array of start dates
});
// Create new model out of schema defined above.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
