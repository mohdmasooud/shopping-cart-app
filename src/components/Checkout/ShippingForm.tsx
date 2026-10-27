import React, { useState } from 'react';
import {
  shippingSchema,
  ShippingFormData,
  ShippingFormErrors,
} from '../../schemas/shippingSchema';

interface ShippingFormProps {
  initialData: ShippingFormData;
  onSubmit: (data: ShippingFormData) => void;
  onBack: () => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  initialData,
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState<ShippingFormData>(initialData);
  const [errors, setErrors] = useState<ShippingFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingFormData, boolean>>>({});

  const validateField = (field: keyof ShippingFormData, value: string) => {
    const singleFieldSchema = shippingSchema.shape[field];
    const result = singleFieldSchema.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.errors[0]?.message || 'Invalid value',
      }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleChange = (field: keyof ShippingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof ShippingFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      fullName: true,
      email: true,
      phoneNumber: true,
      address: true,
      city: true,
      postalCode: true,
    });

    const validationResult = shippingSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: ShippingFormErrors = {};
      validationResult.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof ShippingFormData;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(validationResult.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small">
        Step 2: Shipping & Delivery Details
      </h6>

      <div className="row g-3 mb-4">
        {/* Full Name */}
        <div className="col-12 col-md-6">
          <label htmlFor="fullName" className="form-label small fw-semibold">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            className={`form-control ${
              touched.fullName ? (errors.fullName ? 'is-invalid' : 'is-valid') : ''
            }`}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>

        {/* Email */}
        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label small fw-semibold">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id="email"
            className={`form-control ${
              touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''
            }`}
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Phone Number */}
        <div className="col-12 col-md-6">
          <label htmlFor="phoneNumber" className="form-label small fw-semibold">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            className={`form-control ${
              touched.phoneNumber ? (errors.phoneNumber ? 'is-invalid' : 'is-valid') : ''
            }`}
            placeholder="+1 (555) 000-0000"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            onBlur={() => handleBlur('phoneNumber')}
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber}</div>
          )}
        </div>

        {/* Address */}
        <div className="col-12 col-md-6">
          <label htmlFor="address" className="form-label small fw-semibold">
            Street Address <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="address"
            className={`form-control ${
              touched.address ? (errors.address ? 'is-invalid' : 'is-valid') : ''
            }`}
            placeholder="123 Main St, Apt 4B"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        {/* City */}
        <div className="col-12 col-md-6">
          <label htmlFor="city" className="form-label small fw-semibold">
            City <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="city"
            className={`form-control ${
              touched.city ? (errors.city ? 'is-invalid' : 'is-valid') : ''
            }`}
            placeholder="New York"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
          />
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        {/* Postal Code */}
        <div className="col-12 col-md-6">
          <label htmlFor="postalCode" className="form-label small fw-semibold">
            Postal Code <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            className={`form-control ${
              touched.postalCode ? (errors.postalCode ? 'is-invalid' : 'is-valid') : ''
            }`}
            placeholder="10001"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            onBlur={() => handleBlur('postalCode')}
          />
          {errors.postalCode && (
            <div className="invalid-feedback">{errors.postalCode}</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between pt-2 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Cart</span>
        </button>
        <button
          type="submit"
          className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
        >
          <span>Review Order</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </form>
  );
};
