class DiscountCode {
  constructor(code, type, value, minPurchase = 0, maxDiscount = null, expiryDate = null) {
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid discount code');
    }
    if (!['percentage', 'fixed'].includes(type)) {
      throw new Error('Type must be "percentage" or "fixed"');
    }
    if (value <= 0) {
      throw new Error('Value must be positive');
    }
    if (type === 'percentage' && value > 100) {
      throw new Error('Percentage cannot exceed 100');
    }

    this.code = code.toUpperCase().trim();
    this.type = type;
    this.value = value;
    this.minPurchase = minPurchase;
    this.maxDiscount = maxDiscount;
    this.expiryDate = expiryDate;
    this.isActive = true;
  }

  isValid(cartTotal) {
    if (!this.isActive) {
      return { valid: false, reason: 'Discount code is inactive' };
    }

    if (this.expiryDate && new Date() > this.expiryDate) {
      return { valid: false, reason: 'Discount code has expired' };
    }

    if (cartTotal < this.minPurchase) {
      return { 
        valid: false, 
        reason: `Minimum purchase of $${this.minPurchase} required` 
      };
    }

    return { valid: true };
  }

  calculateDiscount(cartTotal) {
    const validation = this.isValid(cartTotal);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    let discount = 0;

    if (this.type === 'percentage') {
      discount = cartTotal * (this.value / 100);
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
    } else if (this.type === 'fixed') {
      discount = Math.min(this.value, cartTotal);
    }

    return Math.round(discount * 100) / 100;
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }
}

export default DiscountCode;