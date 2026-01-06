export class DiscountCode {
  constructor(code, type, value, minPurchase = 0) {
    this.code = code;
    this.type = type; // 'percentage' או 'fixed'
    this.value = value;
    this.minPurchase = minPurchase;
  }

  isValid(cartTotal) {
    return cartTotal >= this.minPurchase;
  }

  calculateDiscount(cartTotal) {
    if (!this.isValid(cartTotal)) return 0;
    if (this.type === 'percentage') {
      return cartTotal * (this.value / 100);
    }
    return Math.min(this.value, cartTotal);
  }
}