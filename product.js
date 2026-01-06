export class Product {
  constructor(id, name, price, category, stockQuantity, weight, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stockQuantity = stockQuantity;
    this.weight = weight;
    this.description = description;
  }

  isInStock(quantity) {
    return this.stockQuantity >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.isInStock(quantity)) throw new Error('Insufficient stock');
    this.stockQuantity -= quantity;
  }

  increaseStock(quantity) {
    this.stockQuantity += quantity;
  }

  getInfo() {
    return `${this.name} (${this.category}): ${this.price}₪`;
  }
}