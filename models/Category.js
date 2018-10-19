const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {type: String, unique: true},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('categories', CategorySchema);