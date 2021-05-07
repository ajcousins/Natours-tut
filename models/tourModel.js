const mongoose = require('mongoose');

// Schema/ blueprint for data.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true + error string
    required: [true, 'A tour must have a name.'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },
});
// Create new model out of schema defined above.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
