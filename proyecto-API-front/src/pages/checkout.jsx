import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./auth.css";

const PaymentMethods = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  CRYPTO: 'crypto'
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total } = location.state || { cart: [], total: 0 };
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    paymentMethod: PaymentMethods.CREDIT_CARD,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cryptoWallet: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de procesamiento del pago
    alert('¡Compra procesada con éxito!');
    navigate('/');
  };

  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      padding: '2rem'
    }}>
      {/* Botón Volver*/}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          left: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(23, 26, 33, 0.95)',
          border: '2px solid #355166',
          color: '#66c0f4',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '10px 20px',
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          zIndex: 100,
          fontSize: '0.9rem',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#23303f';
          e.target.style.borderColor = '#66c0f4';
          e.target.style.transform = 'translateY(-50%) translateX(5px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(23, 26, 33, 0.95)';
          e.target.style.borderColor = '#355166';
          e.target.style.transform = 'translateY(-50%)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        }}
      >
        ←
      </button>

      <div className="container" style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <div className="form-card" style={{ 
          margin: '0 auto',
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          minHeight: 'min-content',
          position: 'relative',
          overflowY: 'visible',
          padding: '3rem 2rem'
        }}>
          <div className="checkout-summary">
            <h3 style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '12px',
              fontSize: '1.3rem' 
            }}>
              Resumen de la compra
            </h3>
            <div style={{
              background: 'rgba(102, 192, 244, 0.15)',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid #66c0f4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ 
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: '500'
              }}>
                Total a pagar:
              </span>
              <span style={{
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: '700',
                textShadow: '0 0 10px rgba(102, 192, 244, 0.5)'
              }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Método de pago</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value={PaymentMethods.CREDIT_CARD}>Tarjeta de Crédito</option>
                <option value={PaymentMethods.PAYPAL}>PayPal</option>
                <option value={PaymentMethods.CRYPTO}>Criptomoneda</option>
              </select>
            </div>

            {formData.paymentMethod === PaymentMethods.CREDIT_CARD && (
              <>
                <div className="form-group">
                  <label>Número de tarjeta</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de expiración</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {formData.paymentMethod === PaymentMethods.CRYPTO && (
              <div className="form-group">
                <label>Dirección de wallet</label>
                <input
                  type="text"
                  name="cryptoWallet"
                  value={formData.cryptoWallet}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '24px' }}>
              <button 
                type="submit" 
                style={{
                  flex: 1,
                  height: '52px',
                  background: 'linear-gradient(135deg, #04addc 0%, #0a5891 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2rem'
                }}
              >
                Confirmar Compra
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/')}
                style={{
                  flex: 1,
                  height: '52px',
                  background: '#1a2530',
                  border: '2px solid #355166',
                  borderRadius: '12px',
                  color: '#66c0f4',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#23303f';
                  e.target.style.borderColor = '#66c0f4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1a2530';
                  e.target.style.borderColor = '#355166';
                }}
              >
                Cancelar Compra
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}