"use client"
import React, { useEffect } from 'react';

const RazorpayButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_NREheRzINTcbeN');
    script.async = true;

    document.getElementById('razorpay-form').appendChild(script);

    return () => {
      // Cleanup the script when the component unmounts
      document.getElementById('razorpay-form').removeChild(script);
    };
  }, []);

  return (
    <form id="razorpay-form">
      {/* The script will insert the payment button here */}
    </form>
  );
};

export default RazorpayButton;

