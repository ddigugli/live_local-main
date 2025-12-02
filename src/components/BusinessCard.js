import React from 'react';
import './BusinessCard.css';
import { Link } from 'react-router-dom';

const BusinessCard = ({ business }) => {
  const id = business.objectId || encodeURIComponent(business.Name || '');

  return (
    <Link to={`/business/${id}`} className="business-card-link">
      <div className="business-card">
  {/* Card shows only the photo with the business name overlaid at the top */}
  <div className="card-image" style={{ backgroundImage: `url(${business.Image || business.ImageURL || '/images/coffee.jpg'})` }}>
    <div className="card-title-overlay">{business.Name || 'Unnamed Business'}</div>
  </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
