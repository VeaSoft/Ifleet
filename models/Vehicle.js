const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    name: String,
    colour: String,
    year: String,
    licenseNumber: { type: String, unique: true },
    categories: Array,
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('vehicles', VehicleSchema);