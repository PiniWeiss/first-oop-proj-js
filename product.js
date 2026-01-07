class Product {
  constructor(id, name, price, category, stockQuantity, weight = 0.5, description = '') {
    if (!id || !name) {
      throw new Error('Product ID and name are required');
    }
    if (price <= 0) {
      throw new Error('Price must be positive');
    }
    if (stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    if (weight <= 0) {
      throw new Error('Weight must be positive');
    }

    this.id = id;
    this.name = name;
    this.price = Math.round(price * 100) / 100;
    this.category = category;
    this.stockQuantity = stockQuantity;
    this.weight = weight;
    this.description = description;
  }

  isInStock(quantity = 1) {
    return this.stockQuantity >= quantity;
  }

  decreaseStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (!this.isInStock(quantity)) {
      throw new Error(`Insufficient stock. Available: ${this.stockQuantity}`);
    }
    this.stockQuantity -= quantity;
  }

  increaseStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.stockQuantity += quantity;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      stockQuantity: this.stockQuantity,
      weight: this.weight,
      description: this.description
    };
  }
}

export default Product;