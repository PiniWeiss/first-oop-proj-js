import { CartItem } from './cartItem.js';
import { Order } from './order.js';

export class ShoppingCart {
  #items = [];
  #discountCode = null;

  constructor() {
    this.taxRate = 0.17;
  }

  addItem(product, quantity) {
    if (!product.isInStock(quantity)) throw new Error('Not enough stock');
    
    const existing = this.#items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.#items.push(new CartItem(product, quantity));
    }
  }

  getSubtotal() {
    return this.#items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  applyDiscount(discountCode) {
    this.#discountCode = discountCode;
  }

  getShipping() {
    const totalWeight = this.#items.reduce((sum, item) => sum + item.getTotalWeight(), 0);
    if (totalWeight === 0) return 0;
    return totalWeight > 5 ? 50 : 20;
  }

  checkout() {
    if (this.#items.length === 0) throw new Error('Cart is empty');

    const subtotal = this.getSubtotal();
    const discount = this.#discountCode ? this.#discountCode.calculateDiscount(subtotal) : 0;
    const tax = (subtotal - discount) * this.taxRate;
    const shipping = this.getShipping();
    const total = subtotal - discount + tax + shipping;

    const order = new Order(
      `ORD-${Date.now()}`,
      [...this.#items],
      subtotal,
      discount,
      tax,
      shipping,
      total
    );

    // עדכון מלאי
    this.#items.forEach(item => item.product.decreaseStock(item.quantity));
    
    this.clear();
    return order;
  }

  clear() {
    this.#items = [];
    this.#discountCode = null;
  }

  isEmpty() {
    return this.#items.length === 0;
  }
}