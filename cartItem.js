class CartItem {
  constructor(product, quantity) {
    if (!product) {
      throw new Error('Product is required');
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }
    if (!product.isInStock(quantity)) {
      throw new Error(`Only ${product.stockQuantity} units available`);
    }

    this.product = product;
    this.quantity = quantity;
  }

  getSubtotal() {
    return Math.round(this.product.price * this.quantity * 100) / 100;
  }

  increaseQuantity(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    const newQuantity = this.quantity + amount;
    if (!this.product.isInStock(newQuantity)) {
      throw new Error('Insufficient stock');
    }
    
    this.quantity = newQuantity;
  }

  decreaseQuantity(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (amount > this.quantity) {
      throw new Error('Cannot decrease by more than current quantity');
    }
    
    this.quantity -= amount;
  }

  getTotalWeight() {
    return this.product.weight * this.quantity;
  }
}

export default CartItem;