// Página de Checkout: muestra el resumen y el formulario de pago
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Estilos compartidos (tipografías, base) y estilos específicos del checkout
import "./auth.css";
import "./checkout.css";

// Enumeración simple para los métodos de pago soportados
const PaymentMethods = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  CRYPTO: 'crypto'
};

export default function Checkout() {
  // Hooks de navegación y recepción de datos desde la ruta anterior
  const location = useLocation();
  const navigate = useNavigate();
  // Recibimos el carrito y total desde el estado de la navegación (fallback si no viene nada)
  const { cart, total } = location.state || { cart: [], total: 0 };
  
  // Estado local del formulario de pago
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

  // Maneja cambios en cualquier input/select del formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit simulado del checkout; aquí iría la integración real con un procesador de pago
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de procesamiento del pago
    alert('¡Compra procesada con éxito!');
    navigate('/');
  };

  return (
    <div className="checkout-root">
      {/* Botón Volver: regresa al Home */}
      <button className="checkout-back-btn" onClick={() => navigate('/')}>←</button>

      <div className="checkout-container">
        <div className="checkout-card">
          {/* Resumen centrado del total a pagar */}
          <div className="checkout-summary">
            <h3 className="checkout-summary-title">Resumen de la compra</h3>
            <div className="checkout-summary-box">
              <span className="checkout-summary-label">Total a pagar:</span>
              <span className="checkout-summary-total">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Formulario de datos del comprador y método de pago */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-form-group">
              <label>Nombre completo</label>
              <input
                className="checkout-input"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* E-mail de contacto*/}
            <div className="checkout-form-group">
              <label>Email</label>
              <input
                className="checkout-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Dirección de facturación / envío */}
            <div className="checkout-form-group">
              <label>Dirección</label>
              <input
                className="checkout-input"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Selección del método de pago */}
            <div className="checkout-form-group">
              <label>Método de pago</label>
              <select
                className="checkout-select"
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
                {/* Campos de tarjeta: número, expiración y CVV */}
                <div className="checkout-form-group">
                  <label>Número de tarjeta</label>
                  <input
                    className="checkout-input"
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>Fecha de expiración</label>
                    <input
                      className="checkout-input"
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>CVV</label>
                    <input
                      className="checkout-input"
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
              // Campo visible sólo si se elige Criptomoneda
              <div className="checkout-form-group">
                <label>Dirección de wallet</label>
                <input
                  className="checkout-input"
                  type="text"
                  name="cryptoWallet"
                  value={formData.cryptoWallet}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {/* Acciones del formulario */}
            <div className="checkout-actions">
              <button type="submit" className="checkout-confirm-btn">Confirmar Compra</button>
              <button type="button" className="checkout-cancel-btn" onClick={() => navigate('/')}>Cancelar Compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}