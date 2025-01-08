const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    p_name: {
        type: String,
        required: "p_name is required",
        minlength: [3, 'p_name must be at least 3 characters']
    },
    p_size: {
        type: Array, // Array of strings for sizes
        validate: {
            validator: function (v) {
                return v.length > 0; // Must have at least one size
            },
            message: "Please select atleast one size."
        }
    },
    p_color: {
        type: Array, // Array of strings for colors
        validate: {
            validator: function (v) {
                return v.length > 0; // Must have at least one color
            },
            message: "Please select atleast one color"
        }
    },
    category: {
        type: String,
        required: "Category is required",
        minlength: [3, 'Category must be at least 3 characters long']
    },
    price: {
        type: Number,
        required: "Price is Required"
    },
    image: {
        type: Array,
    },
    p_description: {
        type: String,
        required: "p_description is required",
        minlength: [10, 'p_description must be at least 10 characters']
    }
}, { timestamps: true });

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;