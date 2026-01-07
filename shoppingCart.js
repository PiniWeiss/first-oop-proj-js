import CartItem from './cartItem.js';

class ShoppingCart {
  #items = [];
  #discountCode = null;
  #taxRate = 0.17;

  constructor(taxRate = 0.17) {
    if (taxRate < 0 || taxRate > 1) {
      throw new Error('Tax rate must be between 0 and 1');
    }
    this.#taxRate = taxRate;
  }

  addItem(product, quantity = 1) {
    const existingItem = this.#items.find(item => 
      item.product.id === product.id
    );

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      const cartItem = new CartItem(product, quantity);
      this.#items.push(cartItem);
    }
  }

  removeItem(productId) {
    const index = this.#items.findIndex(item => 
      item.product.id === productId
    );
    
    if (index === -1) {
      throw new Error('Product not in cart');
    }
    
    this.#items.splice(index, 1);
  }

  updateQuantity(productId, newQuantity) {
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    if (newQuantity === 0) {
      return this.removeItem(productId);
    }

    const item = this.#items.find(i => i.product.id === productId);
    if (!item) {
      throw new Error('Product not in cart');
    }

    const diff = newQuantity - item.quantity;
    if (diff > 0) {
      item.increaseQuantity(diff);
    } else if (diff < 0) {
      item.decreaseQuantity(-diff);
    }
  }

  getItems() {
    return [...this.#items];
  }

  getItemCount() {
    return this.#items.reduce((sum, item) => sum + item.quantity, 0);
  }

  applyDiscount(discountCode) {
    const subtotal = this.getSubtotal();
    const validation = discountCode.isValid(subtotal);
    
    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    this.#discountCode = discountCode;
  }

  removeDiscount() {
    this.#discountCode = null;
  }

  getSubtotal() {
    return this.#items.reduce((sum, item) => 
      sum + item.getSubtotal(), 0
    );
  }

  getDiscount() {
    if (!this.#discountCode) return 0;
    const subtotal = this.getSubtotal();
    return this.#discountCode.calculateDiscount(subtotal);
  }

  getTax() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const taxableAmount = subtotal - discount;
    return Math.round(taxableAmount * this.#taxRate * 100) / 100;
  }

  getShipping() {
    if (this.#items.length === 0) return 0;
    
    const totalWeight = this.#items.reduce((sum, item) => 
      sum + item.getTotalWeight(), 0
    );

    // Shipping rates based on weight
    if (totalWeight <= 1) return 5;
    if (totalWeight <= 5) return 10;
    if (totalWeight <= 10) return 15;
    return 15 + Math.ceil((totalWeight - 10) / 5) * 5;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const tax = this.getTax();
    const shipping = this.getShipping();
    
    return Math.round((subtotal - discount + tax + shipping) * 100) / 100;
  }

  clear() {
    this.#items = [];
    this.#discountCode = null;
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  checkout() {
    if (this.isEmpty()) {
      throw new Error('Cannot checkout empty cart');
    }

    // Create order snapshot
    const orderData = {
      items: this.getItems().map(item => ({
        product: item.product.getInfo(),
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal: this.getSubtotal(),
      discount: this.getDiscount(),
      tax: this.getTax(),
      shipping: this.getShipping(),
      total: this.getTotal(),
      discountCode: this.#discountCode?.code || null
    };

    // Update inventory
    for (const item of this.#items) {
      item.product.decreaseStock(item.quantity);
    }

    // Clear cart
    this.clear();

    // Create and return order
    return new Order(orderData);
  }
}

class Order {
  static #nextId = 1;

  constructor(orderData) {
    this.orderId = Order.#nextId++;
    this.items = orderData.items;
    this.subtotal = orderData.subtotal;
    this.discount = orderData.discount;
    this.tax = orderData.tax;
    this.shipping = orderData.shipping;
    this.total = orderData.total;
    this.discountCode = orderData.discountCode;
    this.status = 'pending';
    this.createdAt = new Date();
  }

  getOrderSummary() {
    return {
      orderId: this.orderId,
      itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: this.subtotal,
      discount: this.discount,
      tax: this.tax,
      shipping: this.shipping,
      total: this.total,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}

export { ShoppingCart, Order };
export default ShoppingCart;