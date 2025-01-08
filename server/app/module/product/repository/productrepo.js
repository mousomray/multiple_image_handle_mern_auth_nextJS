const ProductModel = require('../model/product');

class ProductRepo {

    // Add product function
    async createProduct(productData) {
        return ProductModel.create(productData)
    }

    // All products function for admin pannel
    async allProducts() {
        return await ProductModel.find();
    }

    // Get search with post data 
    async postSearchProduct(search) {
        const query = {
            $or: [
                { p_name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { p_size: { $regex: search, $options: 'i' } },
                { p_color: { $regex: search, $options: 'i' } }
            ],
        };
        return await ProductModel.find(query);
    }

    // Fetch single product
    async oneProduct(id) {
        return await ProductModel.findById(id);
    }

    // Update product 
    async updateproduct(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true })
    }

    // Delete product 
    async deleteproduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }

    // Fetch category list
    async fetchCategory() {
        return await ProductModel.distinct("category");
    }

    // Find by category 
    async categoryDetails(categoryRegex) {
        return await ProductModel.find({ category: categoryRegex });
    }

    // Filter products by p_size
    async filterBySize(size) {
        return await ProductModel.find({ p_size: { $in: [size] } });
    }

    // Filter products by p_color
    async filterByColor(color) {
        return await ProductModel.find({ p_color: { $in: [color] } });
    }

    // Filter products by p_size
    async filterBySize(size) {
        return await ProductModel.find({ p_size: { $in: [size] } });
    }

}

module.exports = new ProductRepo(); 
