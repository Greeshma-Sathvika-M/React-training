import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });
  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const shippingFee = totalPrice > 120 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingFee + tax;

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

  const handleShipChange = e => setShipping(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePayChange = e => setPayment(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = () => {
    const shippingInfo = {
      name: `${shipping.firstName} ${shipping.lastName}`,
      address: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`,
      email: shipping.email,
    };
    placeOrder({ items, total: orderTotal, shipping: shippingInfo });
    clearCart();
    navigate('/order-success');
  };

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>

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
          {/* Left: form */}
          <div className="checkout-form-col">

            {/* Step 0 — Shipping */}
            {step === 0 && (
              <div className="co-section">
                <h2>Shipping Information</h2>
                <div className="co-form-grid">
                  <div className="co-field">
                    <label>First Name *</label>
                    <input name="firstName" value={shipping.firstName} onChange={handleShipChange} placeholder="John" required />
                  </div>
                  <div className="co-field">
                    <label>Last Name *</label>
                    <input name="lastName" value={shipping.lastName} onChange={handleShipChange} placeholder="Doe" required />
                  </div>
                  <div className="co-field co-full">
                    <label>Email *</label>
                    <input name="email" type="email" value={shipping.email} onChange={handleShipChange} placeholder="john@example.com" required />
                  </div>
                  <div className="co-field co-full">
                    <label>Phone</label>
                    <input name="phone" value={shipping.phone} onChange={handleShipChange} placeholder="+1 555 000 0000" />
                  </div>
                  <div className="co-field co-full">
                    <label>Address *</label>
                    <input name="address" value={shipping.address} onChange={handleShipChange} placeholder="123 Main Street" required />
                  </div>
                  <div className="co-field">
                    <label>City *</label>
                    <input name="city" value={shipping.city} onChange={handleShipChange} placeholder="New York" required />
                  </div>
                  <div className="co-field">
                    <label>State</label>
                    <input name="state" value={shipping.state} onChange={handleShipChange} placeholder="NY" />
                  </div>
                  <div className="co-field">
                    <label>ZIP Code *</label>
                    <input name="zip" value={shipping.zip} onChange={handleShipChange} placeholder="10001" required />
                  </div>
                  <div className="co-field">
                    <label>Country</label>
                    <select name="country" value={shipping.country} onChange={handleShipChange}>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                </div>
                <div className="co-nav">
                  <button onClick={() => navigate('/cart')} className="co-btn-outline">← Back to Cart</button>
                  <button
                    onClick={() => setStep(1)}
                    className="co-btn-primary"
                    disabled={!shipping.firstName || !shipping.lastName || !shipping.email || !shipping.address || !shipping.city || !shipping.zip}
                  >Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <div className="co-section">
                <h2>Payment Details</h2>
                <div className="co-payment-icons">
                  {['VISA', 'MC', 'PayPal', 'Stripe'].map(p => (
                    <span key={p} className="co-pay-badge">{p}</span>
                  ))}
                </div>
                <div className="co-form-grid">
                  <div className="co-field co-full">
                    <label>Name on Card *</label>
                    <input name="cardName" value={payment.cardName} onChange={handlePayChange} placeholder="John Doe" required />
                  </div>
                  <div className="co-field co-full">
                    <label>Card Number *</label>
                    <input
                      name="cardNumber"
                      value={payment.cardNumber}
                      onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className="co-field">
                    <label>Expiry Date *</label>
                    <input
                      name="expiry"
                      value={payment.expiry}
                      onChange={e => setPayment(p => ({ ...p, expiry: e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/') }))}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="co-field">
                    <label>CVV *</label>
                    <input
                      name="cvv"
                      value={payment.cvv}
                      onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="•••"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div className="co-nav">
                  <button onClick={() => setStep(0)} className="co-btn-outline">← Back</button>
                  <button
                    onClick={() => setStep(2)}
                    className="co-btn-primary"
                    disabled={!payment.cardName || payment.cardNumber.length < 19 || payment.expiry.length < 5 || payment.cvv.length < 3}
                  >Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <div className="co-section">
                <h2>Review Your Order</h2>
                <div className="co-review-section">
                  <h4>Shipping to</h4>
                  <p>{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                  <p>{shipping.email}</p>
                </div>
                <div className="co-review-section">
                  <h4>Payment</h4>
                  <p>Card ending in {payment.cardNumber.slice(-4)}</p>
                </div>
                <div className="co-review-items">
                  <h4>Items ({items.length})</h4>
                  {items.map(item => (
                    <div key={item.id} className="co-review-item">
                      <img src={item.thumbnail} alt={item.title} />
                      <span className="co-ri-name">{item.title}</span>
                      <span className="co-ri-qty">× {item.qty}</span>
                      <span className="co-ri-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="co-nav">
                  <button onClick={() => setStep(1)} className="co-btn-outline">← Back</button>
                  <button onClick={handlePlaceOrder} className="co-btn-place">Place Order — ${orderTotal.toFixed(2)}</button>
                </div>
              </div>
            )}
          </div>

          {/* Right: summary */}
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
              <div className="co-sum-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="co-free">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="co-sum-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="co-sum-divider" />
              <div className="co-sum-row co-sum-total"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
