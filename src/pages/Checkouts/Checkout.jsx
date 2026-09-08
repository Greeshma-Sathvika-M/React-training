import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, MasterCard, Amex, Discover' },
  { id: 'cod', name: 'Cash on Delivery (COD)', icon: '💵', desc: 'Pay with cash upon delivery at your doorstep' },
  { id: 'paypal', name: 'PayPal Express', icon: '🅿️', desc: 'Safe, fast & secure digital payment' },
  { id: 'upi', name: 'UPI / Net Banking', icon: '⚡', desc: 'Instant UPI ID, GooglePay, PhonePe or Bank Transfer' },
];

function Checkout() {
  const { items, totalPrice, coupon, clearCart } = useCart();
  const { placeOrder } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Form states
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card fields
  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Alternative payment inputs
  const [paypalEmail, setPaypalEmail] = useState('');
  const [upiId, setUpiId] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  const shippingBase = totalPrice > 120 ? 0 : 9.99;
  let discount = 0;
  let shippingFee = shippingBase;
  if (coupon) {
    if (coupon.type === 'percent') discount = totalPrice * (coupon.value / 100);
    else if (coupon.type === 'flat') discount = Math.min(coupon.value, totalPrice);
    else if (coupon.type === 'shipping') shippingFee = 0;
  }
  const subtotalAfterDiscount = totalPrice - discount;
  const tax = subtotalAfterDiscount * 0.08;
  const orderTotal = subtotalAfterDiscount + shippingFee + tax;

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>No items to checkout</h2>
          <button onClick={() => navigate('/')} className="co-btn-primary">Go Shopping</button>
        </div>
      </div>
    );
  }

  // Shipping inputs handler with number/phone clean up
  const handleShipChange = e => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // allow only digits, space, +, -, ()
      const cleaned = value.replace(/[^\d+()\-\s]/g, '');
      setShipping(p => ({ ...p, [name]: cleaned }));
    } else if (name === 'zip') {
      const cleaned = value.replace(/[^\d\-a-zA-Z]/g, '').slice(0, 10);
      setShipping(p => ({ ...p, [name]: cleaned }));
    } else {
      setShipping(p => ({ ...p, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Card formatting and validations
  const handleCardNumberChange = e => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setPayment(p => ({ ...p, cardNumber: formatted }));
    if (errors.cardNumber) setErrors(p => ({ ...p, cardNumber: '' }));
  };

  const handleExpiryChange = e => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      let month = parseInt(raw.slice(0, 2), 10);
      if (month > 12) month = 12;
      if (month < 1 && raw.length === 2) month = '01';
      else if (month < 10 && raw.slice(0, 2).length === 2 && !raw.startsWith('0')) month = '0' + month;
      raw = String(month).padStart(2, '0') + (raw.slice(2) ? '/' + raw.slice(2) : '');
    }
    setPayment(p => ({ ...p, expiry: raw }));
    if (errors.expiry) setErrors(p => ({ ...p, expiry: '' }));
  };

  const handleCvvChange = e => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPayment(p => ({ ...p, cvv: raw }));
    if (errors.cvv) setErrors(p => ({ ...p, cvv: '' }));
  };

  // Step 0 validation (Shipping)
  const validateShipping = () => {
    const newErrors = {};
    if (!shipping.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!shipping.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) {
      newErrors.email = 'Valid email address is required.';
    }
    if (shipping.phone && shipping.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }
    if (!shipping.address.trim()) newErrors.address = 'Street address is required.';
    if (!shipping.city.trim()) newErrors.city = 'City is required.';
    if (!shipping.zip.trim()) newErrors.zip = 'ZIP/Postal code is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1 validation (Payment)
  const validatePayment = () => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      if (!payment.cardName.trim()) newErrors.cardName = 'Name on card is required.';
      const rawCard = payment.cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15) newErrors.cardNumber = 'Card number must be 15 or 16 digits.';
      if (payment.expiry.length < 5) newErrors.expiry = 'Expiry date must be in MM/YY format.';
      if (payment.cvv.length < 3) newErrors.cvv = 'CVV must be 3 or 4 digits.';
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail.trim() || !/\S+@\S+\.\S+/.test(paypalEmail)) {
        newErrors.paypalEmail = 'Please enter a valid PayPal email address.';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g. yourname@oksbi / name@upi).';
      }
    }
    // COD needs no specific field validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateShipping()) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToReview = () => {
    if (validatePayment()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    let paymentDetails = {};
    if (paymentMethod === 'card') {
      paymentDetails = {
        cardName: payment.cardName,
        cardLast4: payment.cardNumber.replace(/\s/g, '').slice(-4),
        type: 'Credit/Debit Card',
      };
    } else if (paymentMethod === 'cod') {
      paymentDetails = {
        type: 'Cash on Delivery',
        note: 'Payment to be collected on delivery',
      };
    } else if (paymentMethod === 'paypal') {
      paymentDetails = {
        paypalEmail,
        type: 'PayPal Express',
      };
    } else if (paymentMethod === 'upi') {
      paymentDetails = {
        upiId,
        type: 'UPI Payment',
      };
    }

    const placedOrder = await placeOrder({
      items,
      total: orderTotal,
      shipping,
      paymentMethod,
      paymentDetails,
    });
    clearCart();
    navigate('/order-success', { state: { order: placedOrder } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1 className="checkout-title">Secure Checkout</h1>

        {/* Stepper */}
        <div className="co-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`co-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <span className="co-step-num">{i < step ? '✓' : i + 1}</span>
                <span className="co-step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`co-step-line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-body">
          {/* Left: form col */}
          <div className="checkout-form-col">

            {/* Step 0 — Shipping */}
            {step === 0 && (
              <div className="co-section">
                <h2>1. Shipping Address</h2>
                <div className="co-form-grid">
                  <div className="co-field">
                    <label>First Name *</label>
                    <input
                      name="firstName"
                      value={shipping.firstName}
                      onChange={handleShipChange}
                      placeholder="e.g. Sarah"
                    />
                    {errors.firstName && <span className="co-err-msg">{errors.firstName}</span>}
                  </div>

                  <div className="co-field">
                    <label>Last Name *</label>
                    <input
                      name="lastName"
                      value={shipping.lastName}
                      onChange={handleShipChange}
                      placeholder="e.g. Jenkins"
                    />
                    {errors.lastName && <span className="co-err-msg">{errors.lastName}</span>}
                  </div>

                  <div className="co-field co-full">
                    <label>Email Address * (for tracking & invoice)</label>
                    <input
                      name="email"
                      type="email"
                      value={shipping.email}
                      onChange={handleShipChange}
                      placeholder="sarah.jenkins@example.com"
                    />
                    {errors.email && <span className="co-err-msg">{errors.email}</span>}
                  </div>

                  <div className="co-field co-full">
                    <label>Phone Number * (for delivery SMS/updates)</label>
                    <input
                      name="phone"
                      value={shipping.phone}
                      onChange={handleShipChange}
                      placeholder="+1 (555) 234-5678"
                    />
                    {errors.phone && <span className="co-err-msg">{errors.phone}</span>}
                  </div>

                  <div className="co-field co-full">
                    <label>Street Address *</label>
                    <input
                      name="address"
                      value={shipping.address}
                      onChange={handleShipChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                    {errors.address && <span className="co-err-msg">{errors.address}</span>}
                  </div>

                  <div className="co-field">
                    <label>City *</label>
                    <input
                      name="city"
                      value={shipping.city}
                      onChange={handleShipChange}
                      placeholder="e.g. San Francisco"
                    />
                    {errors.city && <span className="co-err-msg">{errors.city}</span>}
                  </div>

                  <div className="co-field">
                    <label>State / Province</label>
                    <input
                      name="state"
                      value={shipping.state}
                      onChange={handleShipChange}
                      placeholder="e.g. California"
                    />
                  </div>

                  <div className="co-field">
                    <label>ZIP / Postal Code *</label>
                    <input
                      name="zip"
                      value={shipping.zip}
                      onChange={handleShipChange}
                      placeholder="e.g. 94103"
                    />
                    {errors.zip && <span className="co-err-msg">{errors.zip}</span>}
                  </div>

                  <div className="co-field">
                    <label>Country *</label>
                    <select name="country" value={shipping.country} onChange={handleShipChange}>
                      <option value="US">United States (USD)</option>
                      <option value="UK">United Kingdom (GBP)</option>
                      <option value="CA">Canada (CAD)</option>
                      <option value="AU">Australia (AUD)</option>
                      <option value="IN">India (INR)</option>
                      <option value="DE">Germany (EUR)</option>
                      <option value="FR">France (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="co-nav">
                  <button onClick={() => navigate('/cart')} className="co-btn-outline">← Back to Cart</button>
                  <button onClick={handleProceedToPayment} className="co-btn-primary">
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <div className="co-section">
                <h2>2. Select Payment Method</h2>

                {/* Payment Option Selector */}
                <div className="co-payment-methods-list">
                  {PAYMENT_METHODS.map(m => (
                    <div
                      key={m.id}
                      className={`co-pm-card ${paymentMethod === m.id ? 'selected' : ''}`}
                      onClick={() => {
                        setPaymentMethod(m.id);
                        setErrors({});
                      }}
                    >
                      <div className="co-pm-radio">
                        <div className={`co-radio-dot ${paymentMethod === m.id ? 'active' : ''}`} />
                      </div>
                      <span className="co-pm-icon">{m.icon}</span>
                      <div className="co-pm-info">
                        <span className="co-pm-name">{m.name}</span>
                        <span className="co-pm-desc">{m.desc}</span>
                      </div>
                      {m.id === 'cod' && (
                        <span className="co-cod-badge">Popular</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Card Form */}
                {paymentMethod === 'card' && (
                  <div className="co-method-fields-wrap">
                    <div className="co-payment-icons">
                      {['VISA', 'MasterCard', 'Amex', 'Discover'].map(p => (
                        <span key={p} className="co-pay-badge">{p}</span>
                      ))}
                    </div>

                    <div className="co-form-grid">
                      <div className="co-field co-full">
                        <label>Cardholder Name *</label>
                        <input
                          name="cardName"
                          value={payment.cardName}
                          onChange={e => {
                            setPayment(p => ({ ...p, cardName: e.target.value }));
                            if (errors.cardName) setErrors(p => ({ ...p, cardName: '' }));
                          }}
                          placeholder="Full Name as printed on card"
                        />
                        {errors.cardName && <span className="co-err-msg">{errors.cardName}</span>}
                      </div>

                      <div className="co-field co-full">
                        <label>Card Number * (16 digits)</label>
                        <input
                          name="cardNumber"
                          value={payment.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && <span className="co-err-msg">{errors.cardNumber}</span>}
                      </div>

                      <div className="co-field">
                        <label>Expiry Date * (MM/YY)</label>
                        <input
                          name="expiry"
                          value={payment.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiry && <span className="co-err-msg">{errors.expiry}</span>}
                      </div>

                      <div className="co-field">
                        <label>CVV / CVC * (3 or 4 digits)</label>
                        <input
                          name="cvv"
                          type="password"
                          value={payment.cvv}
                          onChange={handleCvvChange}
                          placeholder="•••"
                          maxLength="4"
                        />
                        {errors.cvv && <span className="co-err-msg">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div className="co-cod-instruction-box">
                    <div className="co-cod-icon">💵</div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', color: '#166534', fontWeight: 700 }}>
                        Cash on Delivery (COD) Selected
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.86rem', color: '#15803d', lineHeight: 1.5 }}>
                        You will pay <strong>${orderTotal.toFixed(2)}</strong> in cash to the delivery agent upon receiving your parcel. No online payment required right now!
                      </p>
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="co-method-fields-wrap">
                    <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '14px' }}>
                      Enter your registered PayPal email account to authorize instant checkout.
                    </p>
                    <div className="co-field co-full">
                      <label>PayPal Email ID *</label>
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={e => {
                          setPaypalEmail(e.target.value);
                          if (errors.paypalEmail) setErrors(p => ({ ...p, paypalEmail: '' }));
                        }}
                        placeholder="yourname@paypal.com"
                      />
                      {errors.paypalEmail && <span className="co-err-msg">{errors.paypalEmail}</span>}
                    </div>
                  </div>
                )}

                {/* UPI / Net Banking */}
                {paymentMethod === 'upi' && (
                  <div className="co-method-fields-wrap">
                    <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '14px' }}>
                      Enter your Virtual Payment Address (VPA) / UPI ID (GooglePay, PhonePe, Paytm, BHIM, etc.).
                    </p>
                    <div className="co-field co-full">
                      <label>UPI ID / VPA *</label>
                      <input
                        value={upiId}
                        onChange={e => {
                          setUpiId(e.target.value);
                          if (errors.upiId) setErrors(p => ({ ...p, upiId: '' }));
                        }}
                        placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                      />
                      {errors.upiId && <span className="co-err-msg">{errors.upiId}</span>}
                    </div>
                  </div>
                )}

                <div className="co-nav" style={{ marginTop: '24px' }}>
                  <button onClick={() => setStep(0)} className="co-btn-outline">← Back to Shipping</button>
                  <button onClick={handleProceedToReview} className="co-btn-primary">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <div className="co-section">
                <h2>3. Review Your Order Details</h2>

                <div className="co-review-section">
                  <h4>Delivery Address</h4>
                  <p><strong>{shipping.firstName} {shipping.lastName}</strong></p>
                  <p>{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
                  <p>Email: {shipping.email} | Phone: {shipping.phone || 'N/A'}</p>
                </div>

                <div className="co-review-section">
                  <h4>Payment Method</h4>
                  {paymentMethod === 'card' && (
                    <p>💳 Credit / Debit Card ending in <strong>{payment.cardNumber.replace(/\s/g, '').slice(-4)}</strong> (Holder: {payment.cardName})</p>
                  )}
                  {paymentMethod === 'cod' && (
                    <p>💵 <strong>Cash on Delivery (COD)</strong> — Pay on arrival</p>
                  )}
                  {paymentMethod === 'paypal' && (
                    <p>🅿️ <strong>PayPal Express</strong> ({paypalEmail})</p>
                  )}
                  {paymentMethod === 'upi' && (
                    <p>⚡ <strong>UPI Payment</strong> ({upiId})</p>
                  )}
                </div>

                <div className="co-review-items">
                  <h4>Order Items ({items.length})</h4>
                  {items.map(item => (
                    <div key={item.id} className="co-review-item">
                      <img src={item.thumbnail} alt={item.title} />
                      <span className="co-ri-name">{item.title}</span>
                      <span className="co-ri-qty">Qty: {item.qty}</span>
                      <span className="co-ri-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="co-nav">
                  <button onClick={() => setStep(1)} className="co-btn-outline">← Back to Payment</button>
                  <button onClick={handlePlaceOrder} className="co-btn-place">
                    {paymentMethod === 'cod' ? `Confirm Order (COD) — $${orderTotal.toFixed(2)}` : `Pay & Place Order — $${orderTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: summary panel */}
          <div className="co-summary">
            <h3>Order Summary</h3>
            <div className="co-summary-items">
              {items.map(item => (
                <div key={item.id} className="co-sum-item">
                  <img src={item.thumbnail} alt={item.title} />
                  <span className="co-si-name">{item.title}</span>
                  <span className="co-si-qty">×{item.qty}</span>
                  <span className="co-si-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="co-sum-rows">
              <div className="co-sum-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="co-sum-row" style={{ color: '#16a34a', fontWeight: 600 }}>
                  <span>Discount ({coupon?.code})</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="co-sum-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="co-free">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="co-sum-row"><span>Estimated Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="co-sum-divider" />
              <div className="co-sum-row co-sum-total">
                <span>Total Amount</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
              🔒 256-Bit SSL Encrypted &amp; Verified Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
