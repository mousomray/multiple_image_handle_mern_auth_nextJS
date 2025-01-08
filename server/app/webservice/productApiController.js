const ProductRepo = require('../module/product/repository/productrepo')
const path = require('path');
const fs = require('fs');

class productApiController {

    // Add Product 
    async addProduct(req, res) {
        try {
            if (req.files.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["You have to upload ateast 1 image"]
                });
            }
            const imagePaths = req.files.map(file => file.path);

            // Validation for size 
            if (req.body.p_size.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter size it is required"]
                });
            }
            // Validation for color 
            if (req.body.p_color.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter color it is required"]
                });
            }

            // Handle Array for p_color and p_size
            const p_sizes = Array.isArray(req.body.p_size) ? req.body.p_size : req.body.p_size.split(',').map(size => size.trim());
            const p_colors = Array.isArray(req.body.p_color) ? req.body.p_color : req.body.p_color.split(',').map(color => color.trim());

            const productData = { ...req.body, p_size: p_sizes, p_color: p_colors, image: imagePaths };
            const product = await ProductRepo.createProduct(productData);
            res.status(201).json({
                success: true,
                message: "Product is created",
                product
            });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };
            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // Product list with pagination
    async showproduct(req, res) {
        try {
            const products = await ProductRepo.allProducts();
            res.status(200).json({
                message: "Product retrieved successfully",
                products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving products" });
        }
    }

    // Single product
    async singleProduct(req, res) {
        try {
            const id = req.params.id
            const product = await ProductRepo.oneProduct(id)
            res.status(200).json({ message: "Single data fetched", product })
        } catch (error) {
            console.log("Error fetching single product...", error)
        }
    }

    // Update Data
    async updateProduct(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            // Validation for size
            if (req.body.p_size.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter Size it is required"]
                });
            }

            // Validation for color 
            if (req.body.p_color.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter color it is required"]
                });
            }
            if (req.files.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["You have to upload ateast 1 image"]
                });
            }
            // If new images are uploaded, update the image array
            if (req.files && req.files.length > 0) {
                const imagePaths = req.files.map(file => file.path); // Get the paths of the uploaded images
                console.log("Img...", imagePaths);
                updateData.image = imagePaths; // Save the array of image paths
            }

            // Handle Array for p_color and p_size
            const p_sizes = Array.isArray(req.body.p_size) ? req.body.p_size : req.body.p_size.split(',').map(size => size.trim());
            const p_colors = Array.isArray(req.body.p_color) ? req.body.p_color : req.body.p_color.split(',').map(color => color.trim());

            updateData.p_size = p_sizes;
            updateData.p_color = p_colors;

            // Update product in the database
            const updatedProduct = await ProductRepo.updateproduct(id, updateData);

            // Check if the product was updated successfully
            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Return the updated product in the response
            res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "Error updating product data" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // Delete blog
    async deleteProduct(req, res) {
        try {
            const id = req.params.id
            await ProductRepo.deleteproduct(id)
            res.status(200).json({ message: "Product deleted successfully" })
        } catch (error) {
            console.log("Eror deleted product", error);
        }
    }

    // Category List API
    async showCategories(req, res) {
        try {
            const categories = await ProductRepo.fetchCategory();
            const categoryData = categories.map((category) => ({
                slug: category.toLowerCase().replace(/\s+/g, '-'),
                name: category,
                url: `/api/products/category/${category.toLowerCase().replace(/\s+/g, '-')}`
            }));
            res.json(categoryData);
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Error fetching categories" });
        }
    }

    // Single Category
    async categorydetails(req, res) {
        const category = req.params.category;
        try {
            const regex = new RegExp(`^${category.replace(/-/g, ' ')}`, 'i');
            const products = await ProductRepo.categoryDetails(regex);
            res.json({
                success: true,
                message: `Found ${products.length} products for category "${category}"`,
                totalProducts: products.length,
                products,
            });
        } catch (error) {
            console.error("Error fetching products by category:", error);
            res.status(500).json({ success: false, message: "Error retrieving products" });
        }
    }

    // Search with post data Sir
    async searchPost(req, res) {
        try {
            const search = req.body.search;
            const products = await ProductRepo.postSearchProduct(search);
            res.status(200).json({ message: "Search data get successfully", products });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving products' });
        }
    }

    // Filter products by p_size
    async filterBySize(req, res) {
        try {
            const size = req.query.size;  // Get the size from query parameters
            const products = await ProductRepo.filterBySize(size);
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for the given size" });
            }
            res.status(200).json({
                message: "Products found",
                data: products,
                total: products.length
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error filtering products by size" });
        }
    }

    // Filter products by p_color
    async filterByColor(req, res) {
        try {
            const color = req.query.color;  // Get the size from query parameters
            const products = await ProductRepo.filterByColor(color);
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for the given color" });
            }
            res.status(200).json({
                message: "Products found",
                data: products,
                total: products.length
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error filtering products by color" });
        }
    }


}

module.exports = new productApiController();