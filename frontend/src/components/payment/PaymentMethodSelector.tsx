import { useState } from "react";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "MPESA" | "CARD" | "BANK_TRANSFER";
  icon: string;
}

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AVAILABLE_METHODS: PaymentMethod[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    type: "MPESA",
    icon: "M",
  },
  {
    id: "card",
    name: "Debit/Credit Card",
    type: "CARD",
    icon: "C",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    type: "BANK_TRANSFER",
    icon: "B",
  },
];

export default function PaymentMethodSelector({
  onSelect,
  onCancel,
  isLoading = false,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleMethodClick = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method.type === "MPESA") {
      setShowPhoneInput(true);
    } else {
      onSelect(method);
    }
  };

  const handleMpesaSubmit = () => {
    const cleanedPhone = phoneNumber.replace(/\D/g, "");

    if (!cleanedPhone) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    if (selectedMethod) {
      const normalizedPhone = cleanedPhone.startsWith("0") ? `254${cleanedPhone.slice(1)}` : cleanedPhone;
      onSelect({
        ...selectedMethod,
        id: `mpesa_${normalizedPhone}`,
      });
    }
  };

  const handleCancel = () => {
    setSelectedMethod(null);
    setPhoneNumber("");
    setShowPhoneInput(false);
    onCancel();
  };

  return (
    <div className="payment-method-modal">
      <div className="modal-overlay" onClick={handleCancel} />
      <div className="modal-content">
        <h3>Select Payment Method</h3>

        {!showPhoneInput ? (
          <>
            <p className="modal-subtitle">Choose how you'd like to pay</p>
            <div className="method-list">
              {AVAILABLE_METHODS.map((method) => (
                <button
                  key={method.id}
                  className={`method-button ${selectedMethod?.id === method.id ? "selected" : ""}`}
                  onClick={() => handleMethodClick(method)}
                  disabled={isLoading}
                  type="button"
                >
                  <span className="method-icon" aria-hidden="true">{method.icon}</span>
                  <span className="method-name">{method.name}</span>
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={handleCancel}
                disabled={isLoading}
                type="button"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="modal-subtitle">Enter your M-Pesa phone number</p>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="phone-input"
              />
              <small className="input-hint">Format: 254XXXXXXXXX or 07XXXXXXXXX</small>
            </div>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowPhoneInput(false);
                  setSelectedMethod(null);
                  setPhoneNumber("");
                }}
                disabled={isLoading}
                type="button"
              >
                Back
              </button>
              <button
                className="primary-button"
                onClick={handleMpesaSubmit}
                disabled={isLoading || !phoneNumber.trim()}
                type="button"
              >
                {isLoading ? "Processing..." : "Continue"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
