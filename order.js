export class Order {
  constructor(orderId, items, subtotal, discount, tax, shipping, total) {
    this.orderId = orderId;
    this.items = items;
    this.subtotal = subtotal;
    this.discount = discount;
    this.tax = tax;
    this.shipping = shipping;
    this.total = total;
    this.status = 'pending';
    this.createdAt = new Date();
  }
}