import React from 'react';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  return (
    <div className="subscription-container">
      <h1 className="subscription-title">Upgrade Your Learning Experience</h1>
      <div className="subscription-card">
        <div className="package-name">Premium Package</div>
        <div className="price">
          <span className="currency">LKR</span>
          <span className="amount">2,500</span>
          <span className="period">/month</span>
        </div>
        <ul className="features">
          <li>Unlimited access to all quizzes</li>
          <li>Personalized learning path</li>
          <li>Advanced progress tracking</li>
          <li>Ad-free experience</li>
          <li>Priority customer support</li>
        </ul>
        <button className="subscribe-button">Subscribe Now</button>
      </div>
      <div className="guarantee">
        30-day money-back guarantee. No questions asked.
      </div>
    </div>
  );
};

export default SubscriptionPage;