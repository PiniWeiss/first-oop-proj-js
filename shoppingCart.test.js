import { test } from 'node:test';
import assert from 'node:assert';
import Product from './product.js';
import CartItem from './cartItem.js';
import DiscountCode from './discountCode.js';
import { ShoppingCart, Order } from './shoppingCart.js';

// Product Tests
test('should create product with valid data', () => {
  const product = new Product('P1', 'Laptop', 999.99, 'Electronics', 10, 2.5, 'Gaming laptop');
  assert.strictEqual(product.id, 'P1');
  assert.strictEqual(product.name, 'Laptop');
  assert.strictEqual(product.price, 999.99);
  assert.strictEqual(product.stockQuantity, 10);
});

test('should throw error for invalid product data', () => {
  assert.throws(() => new Product('', 'Test', 100, 'Cat', 5), Error);
  assert.throws(() => new Product('P1', 'Test', -100, 'Cat', 5), Error);
  assert.throws(() => new Product('P1', 'Test', 100, 'Cat', -5), Error);
});

test('should check stock availability', () => {
  const product = new Product('P1', 'Mouse', 29.99, 'Electronics', 5);
  assert.strictEqual(product.isInStock(3), true);
  assert.strictEqual(product.isInStock(5), true);
  assert.strictEqual(product.isInStock(6), false);
});

test('should decrease and increase stock', () => {
  const product = new Product('P1', 'Keyboard', 79.99, 'Electronics', 10);
  product.decreaseStock(3);
  assert.strictEqual(product.stockQuantity, 7);
  
  product.increaseStock(5);
  assert.strictEqual(product.stockQuantity, 12);
});

// CartItem Tests
test('should create cart item', () => {
  const product = new Product('P1', 'Mouse', 29.99, 'Electronics', 10);
  const cartItem = new CartItem(product, 2);
  assert.strictEqual(cartItem.quantity, 2);
  assert.strictEqual(cartItem.getSubtotal(), 59.98);
});

test('should calculate total weight', () => {
  const product = new Product('P1', 'Book', 19.99, 'Books', 50, 0.5);
  const cartItem = new CartItem(product, 3);
  assert.strictEqual(cartItem.getTotalWeight(), 1.5);
});

test('should increase and decrease quantity', () => {
  const product = new Product('P1', 'Pen', 2.99, 'Stationery', 100);
  const cartItem = new CartItem(product, 5);
  
  cartItem.increaseQuantity(3);
  assert.strictEqual(cartItem.quantity, 8);
  
  cartItem.decreaseQuantity(2);
  assert.strictEqual(cartItem.quantity, 6);
});

// DiscountCode Tests
test('should create percentage discount code', () => {
  const discount = new DiscountCode('SAVE20', 'percentage', 20, 100);
  assert.strictEqual(discount.code, 'SAVE20');
  assert.strictEqual(discount.type, 'percentage');
  assert.strictEqual(discount.value, 20);
});

test('should create fixed discount code', () => {
  const discount = new DiscountCode('FIXED10', 'fixed', 10);
  assert.strictEqual(discount.type, 'fixed');
  assert.strictEqual(discount.value, 10);
});

test('should validate discount code', () => {
  const discount = new DiscountCode('MIN50', 'percentage', 10, 50);
  
  let result = discount.isValid(30);
  assert.strictEqual(result.valid, false);
  
  result = discount.isValid(60);
  assert.strictEqual(result.valid, true);
});

test('should calculate percentage discount', () => {
  const discount = new DiscountCode('SAVE20', 'percentage', 20);
  const amount = discount.calculateDiscount(100);
  assert.strictEqual(amount, 20);
});

test('should calculate fixed discount', () => {
  const discount = new DiscountCode('FIXED15', 'fixed', 15);
  const amount = discount.calculateDiscount(100);
  assert.strictEqual(amount, 15);
});

test('should respect max discount cap', () => {
  const discount = new DiscountCode('SAVE20', 'percentage', 20, 0, 50);
  const amount = discount.calculateDiscount(500);
  assert.strictEqual(amount, 50);
});

// ShoppingCart Tests
test('should create empty cart', () => {
  const cart = new ShoppingCart();
  assert.strictEqual(cart.isEmpty(), true);
  assert.strictEqual(cart.getSubtotal(), 0);
});

test('should add item to cart', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Mouse', 29.99, 'Electronics', 10);
  
  cart.addItem(product, 2);
  assert.strictEqual(cart.getItemCount(), 2);
  assert.strictEqual(cart.getSubtotal(), 59.98);
});

test('should add same product multiple times', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Mouse', 29.99, 'Electronics', 10);
  
  cart.addItem(product, 2);
  cart.addItem(product, 3);
  
  assert.strictEqual(cart.getItemCount(), 5);
  assert.strictEqual(cart.getItems().length, 1);
});

test('should remove item from cart', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Mouse', 29.99, 'Electronics', 10);
  
  cart.addItem(product, 2);
  cart.removeItem('P1');
  
  assert.strictEqual(cart.isEmpty(), true);
});

test('should update item quantity', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Mouse', 29.99, 'Electronics', 10);
  
  cart.addItem(product, 2);
  cart.updateQuantity('P1', 5);
  
  assert.strictEqual(cart.getItemCount(), 5);
});

test('should calculate tax', () => {
  const cart = new ShoppingCart(0.1); // 10% tax
  const product = new Product('P1', 'Mouse', 100, 'Electronics', 10);
  
  cart.addItem(product, 1);
  assert.strictEqual(cart.getTax(), 10);
});

test('should calculate shipping', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Book', 20, 'Books', 10, 0.5);
  
  cart.addItem(product, 1);
  assert.strictEqual(cart.getShipping(), 5);
});

test('should apply discount code', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Laptop', 1000, 'Electronics', 10);
  const discount = new DiscountCode('SAVE10', 'percentage', 10);
  
  cart.addItem(product, 1);
  cart.applyDiscount(discount);
  
  assert.strictEqual(cart.getDiscount(), 100);
});

test('should calculate total correctly', () => {
  const cart = new ShoppingCart(0.1); // 10% tax
  const product = new Product('P1', 'Item', 100, 'Test', 10, 1);
  
  cart.addItem(product, 1);
  
  // Subtotal: 100
  // Tax: 10
  // Shipping: 5
  // Total: 115
  assert.strictEqual(cart.getTotal(), 115);
});

test('should calculate total with discount', () => {
  const cart = new ShoppingCart(0.1); // 10% tax
  const product = new Product('P1', 'Item', 100, 'Test', 10, 1);
  const discount = new DiscountCode('SAVE20', 'percentage', 20);
  
  cart.addItem(product, 1);
  cart.applyDiscount(discount);
  
  // Subtotal: 100
  // Discount: 20
  // Tax on 80: 8
  // Shipping: 5
  // Total: 93
  assert.strictEqual(cart.getTotal(), 93);
});

test('should checkout and create order', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Item', 50, 'Test', 10);
  
  cart.addItem(product, 2);
  const order = cart.checkout();
  
  assert.ok(order instanceof Order);
  assert.strictEqual(order.status, 'pending');
  assert.strictEqual(cart.isEmpty(), true);
  assert.strictEqual(product.stockQuantity, 8);
});

test('should not checkout empty cart', () => {
  const cart = new ShoppingCart();
  assert.throws(() => cart.checkout(), Error);
});

test('should clear cart', () => {
  const cart = new ShoppingCart();
  const product = new Product('P1', 'Item', 50, 'Test', 10);
  
  cart.addItem(product, 2);
  cart.clear();
  
  assert.strictEqual(cart.isEmpty(), true);
});

console.log('\n✅ All shopping cart tests passed!');