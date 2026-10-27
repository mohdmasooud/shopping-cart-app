import React, { useState } from 'react';
import { useCart } from '../../store/cartStore';
import { CartReview } from './CartReview';
import { ShippingForm } from './ShippingForm';
import { PaymentSummary } from './PaymentSummary';
import { ShippingFormData } from '../../schemas/shippingSchema';

type Step = 'review' | 'shipping' | 'payment' | 'success';

const initialShipping: ShippingFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  city: '',
  postalCode: '',
};

export const CheckoutWizard: React.FC = () => {
  const isCheckoutOpen = useCart((state) => state.isCheckoutOpen);
  const setIsCheckoutOpen = useCart((state) => state.setIsCheckoutOpen);
  const clearCart = useCart((state) => state.clear);

  const [currentStep, setCurrentStep] = useState<Step>('review');
  const [shippingData, setShippingData] = useState<ShippingFormData>(initialShipping);
  const [orderId, setOrderId] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    // Reset steps after delay
    setTimeout(() => {
      setCurrentStep('review');
    }, 300);
  };

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep('payment');
  };

  const handlePlaceOrder = () => {
    const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    clearCart();
    setCurrentStep('success');
  };

  const stepsList: { key: Step; label: string; number: number }[] = [
    { key: 'review', label: 'Cart Review', number: 1 },
    { key: 'shipping', label: 'Shipping', number: 2 },
    { key: 'payment', label: 'Summary', number: 3 },
  ];

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1055 }}
        onClick={handleClose}
      ></div>

      {/* Modal Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1060 }}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Modal Header with Progress Step Indicator */}
            <div className="modal-header bg-dark text-white border-0 py-3 px-4">
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-warning"></i>
                    <span>Secure Checkout</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={handleClose}
                  ></button>
                </div>

                {/* Stepper Navigation */}
                {currentStep !== 'success' && (
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                    {stepsList.map((s, idx) => {
                      const isActive = currentStep === s.key;
                      const isCompleted =
                        (s.key === 'review' && (currentStep === 'shipping' || currentStep === 'payment')) ||
                        (s.key === 'shipping' && currentStep === 'payment');

                      return (
                        <div
                          key={s.key}
                          className="d-flex align-items-center gap-2 flex-grow-1"
                        >
                          <span
                            className={`badge rounded-circle p-2 d-flex align-items-center justify-content-center ${
                              isActive
                                ? 'bg-warning text-dark fw-bold'
                                : isCompleted
                                ? 'bg-success text-white'
                                : 'bg-secondary text-white-50'
                            }`}
                            style={{ width: '28px', height: '28px' }}
                          >
                            {isCompleted ? <i className="bi bi-check"></i> : s.number}
                          </span>
                          <span
                            className={`small fw-semibold ${
                              isActive ? 'text-white' : isCompleted ? 'text-white-50' : 'text-muted'
                            }`}
                          >
                            {s.label}
                          </span>
                          {idx < stepsList.length - 1 && (
                            <div className="flex-grow-1 border-top border-secondary mx-2"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">
              {currentStep === 'review' && (
                <CartReview
                  onNext={() => setCurrentStep('shipping')}
                  onCancel={handleClose}
                />
              )}

              {currentStep === 'shipping' && (
                <ShippingForm
                  initialData={shippingData}
                  onSubmit={handleShippingSubmit}
                  onBack={() => setCurrentStep('review')}
                />
              )}

              {currentStep === 'payment' && (
                <PaymentSummary
                  shippingData={shippingData}
                  onPlaceOrder={handlePlaceOrder}
                  onBack={() => setCurrentStep('shipping')}
                />
              )}

              {currentStep === 'success' && (
                <div className="text-center py-4">
                  <div
                    className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-check-circle-fill display-4"></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-2">Thank you for your order!</h3>
                  <p className="text-muted mb-3">
                    Your order <strong className="text-primary">{orderId}</strong> has been placed
                    successfully. A confirmation email has been sent to{' '}
                    <strong>{shippingData.email}</strong>.
                  </p>

                  <div className="card bg-light border-0 p-3 mx-auto mb-4 text-start" style={{ maxWidth: '420px' }}>
                    <div className="small text-muted mb-1">
                      <strong>Delivery to:</strong> {shippingData.fullName}
                    </div>
                    <div className="small text-muted mb-1">
                      {shippingData.address}, {shippingData.city} {shippingData.postalCode}
                    </div>
                    <div className="small text-muted">
                      <strong>Contact:</strong> {shippingData.phoneNumber}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2 fw-semibold"
                    onClick={handleClose}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
