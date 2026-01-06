import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Product } from './product.js';
import { ShoppingCart } from './shoppingCart.js';
import { DiscountCode } from './discountCode.js';
import { Order } from './order.js';

describe('E-commerce System Tests', () => {

  describe('Product Logic', () => {
    test('should manage stock correctly', () => {
      const p = new Product(1, 'Test', 100, 'Cat', 10, 1, 'Desc');
      assert.strictEqual(p.isInStock(5), true);
      p.decreaseStock(3);
      assert.strictEqual(p.stockQuantity, 7);
    });

    test('should throw error when stock is insufficient', () => {
      const p = new Product(1, 'Test', 100, 'Cat', 2, 1, 'Desc');
      assert.throws(() => p.decreaseStock(5), /Insufficient stock/);
    });
  });

  describe('ShoppingCart Logic', () => {
    test('should calculate subtotal correctly', () => {
      const cart = new ShoppingCart();
      const p1 = new Product(1, 'A', 100, 'Test', 10, 1, '');
      const p2 = new Product(2, 'B', 50, 'Test', 10, 1, '');
      
      cart.addItem(p1, 1);
      cart.addItem(p2, 2); // 100 + (50 * 2) = 200
      
      assert.strictEqual(cart.getSubtotal(), 200);
    });

    test('should apply discount codes correctly', () => {
      const cart = new ShoppingCart();
      const p = new Product(1, 'Item', 200, 'Test', 10, 1, '');
      cart.addItem(p, 1);
      
      const discount = new DiscountCode('SAVE50', 'fixed', 50, 100);
      cart.applyDiscount(discount);
      
      const subtotal = cart.getSubtotal();
      assert.strictEqual(discount.calculateDiscount(subtotal), 50);
    });
  });

  describe('Checkout Process', () => {
    test('should create an order and clear cart', () => {
      const cart = new ShoppingCart();
      const p = new Product(1, 'Phone', 1000, 'Tech', 5, 1, '');
      
      cart.addItem(p, 1);
      const order = cart.checkout();
      
      assert.ok(order instanceof Order);
      assert.strictEqual(cart.isEmpty(), true);
      assert.strictEqual(p.stockQuantity, 4); // מלאי ירד
    });

    test('should not allow checkout for empty cart', () => {
      const cart = new ShoppingCart();
      assert.throws(() => cart.checkout(), /Cart is empty/);
    });
  });

});