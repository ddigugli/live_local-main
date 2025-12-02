import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Application.css';
import { createBusiness } from '../models/Business.js';
import { uploadToCloudinary, isCloudinaryConfigured } from '../services/cloudinaryService.js';

const Application = () => {
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    businessType: '',
    street: '',
    town: '',
    state: '',
    zip: '',
    additionalLocations: [],
    keywords: '',
    description: '',
    image: null
  });

  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    street: '',
    town: '',
    state: '',
    zip: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNewLocationChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({
      ...newLocation,
      [name]: value
    });
  };

  const addLocation = () => {
    const locationString = `${newLocation.street}, ${newLocation.town}, ${newLocation.state} ${newLocation.zip}`.trim();
    if (locationString && locationString !== ', , ,') {
      setFormData({
        ...formData,
        additionalLocations: [...formData.additionalLocations, locationString]
      });
      setNewLocation({
        street: '',
        town: '',
        state: '',
        zip: ''
      });
      setShowAddLocationModal(false);
    } else {
      alert('Please fill in all fields for the location');
    }
  };

  const removeLocation = (index) => {
    setFormData({
      ...formData,
      additionalLocations: formData.additionalLocations.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadError('');
    setIsUploading(true);

    // Parse keywords into an array, removing empty strings
    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    // Construct primary address from street, town, state, zip
    const primaryAddress = `${formData.street}, ${formData.town}, ${formData.state} ${formData.zip}`.trim();

    // Combine all addresses
    const addresses = [primaryAddress, ...formData.additionalLocations];

    // Upload image to Cloudinary if configured and image is provided
    const uploadPromise = formData.image && isCloudinaryConfigured()
      ? uploadToCloudinary(formData.image)
          .then(imageUrl => {
            console.log('Image uploaded to Cloudinary:', imageUrl);
            return imageUrl;
          })
          .catch(err => {
            console.warn('Cloudinary upload failed, continuing without image:', err);
            setUploadError('Image upload failed. Your business will be registered without an image.');
            return null;
          })
      : Promise.resolve(null);

    uploadPromise
      .then((imageUrl) => {
        console.log('Cloudinary upload result (imageUrl):', imageUrl);
        // create a Business object in Parse
        const payload = {
          Name: formData.businessName,
          Category: formData.businessType,
          Address: primaryAddress,
          Addresses: addresses,
          Keywords: [formData.businessType, ...keywordsArray],
          Description: formData.description,
          ImageURL: imageUrl, // Store Cloudinary URL
          Image: null // Don't send File object to Parse
        };
        console.log('Business payload being sent to createBusiness():', payload);

        return createBusiness(payload);
      })
      .then((saved) => {
        console.log('Saved business:', saved.toJSON());
        setIsUploading(false);
        alert('Thank you — your business application was submitted.');
        setFormData({
          email: '',
          businessName: '',
          businessType: '',
          street: '',
          town: '',
          state: '',
          zip: '',
          additionalLocations: [],
          keywords: '',
          description: '',
          image: null
        });
        setUploadError('');
      })
      .catch((err) => {
        console.error('Error saving business:', err);
        setIsUploading(false);
        // Attempt to persist the submission locally so users don't lose their data
        try {
          const pendingKey = 'pendingBusinesses';
          const existing = JSON.parse(localStorage.getItem(pendingKey) || '[]');
          const payloadToSave = {
            Name: formData.businessName,
            Category: formData.businessType,
            Address: primaryAddress,
            Addresses: addresses,
            Keywords: [formData.businessType, ...keywordsArray],
            Description: formData.description,
            ImageURL: null
          };
          existing.push(payloadToSave);
          localStorage.setItem(pendingKey, JSON.stringify(existing));
          setUploadError('Server error. Your submission was saved locally and will be retried when connection is available.');
        } catch (saveErr) {
          console.error('Failed to save application locally', saveErr);
          setUploadError('There was a problem submitting your application. Please try again later.');
        }
      });
  };

  return (
    <div className="application-page">
      <div className="home-nav">
        <Link to="/" className="home-button">Home</Link>
      </div>
      
      <div className="container">
        <h1>Add your business to our map!</h1>
        <p>Please fill in this form to add your local business to our map</p>
        <hr />

        {uploadError && (
          <div className="error-message">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email"><b>Email</b></label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="business-name"><b>Business Name</b></label>
          <input
            type="text"
            placeholder="Enter Business Name"
            name="businessName"
            id="business-name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />

          <label htmlFor="business-type"><b>Business Type</b></label>
          <select 
            name="businessType" 
            id="business-type" 
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a type</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Café</option>
            <option value="retail">Retail</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="street"><b>Street Address</b></label>
          <input
            type="text"
            placeholder="Enter Street Address"
            name="street"
            id="street"
            value={formData.street}
            onChange={handleChange}
            required
          />

          <label htmlFor="town"><b>Town/City</b></label>
          <input
            type="text"
            placeholder="Enter Town or City"
            name="town"
            id="town"
            value={formData.town}
            onChange={handleChange}
            required
          />

          <label htmlFor="state"><b>State</b></label>
          <input
            type="text"
            placeholder="Enter State or Province"
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
            required
          />

          <label htmlFor="zip"><b>ZIP/Postal Code</b></label>
          <input
            type="text"
            placeholder="Enter ZIP or Postal Code"
            name="zip"
            id="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />

          {/* Additional Locations Section */}
          <label><b>Additional Locations</b></label>
          {formData.additionalLocations.length > 0 && (
            <div className="additional-locations-list">
              {formData.additionalLocations.map((location, index) => (
                <div key={index} className="location-item">
                  <span>{location}</span>
                  <button 
                    type="button" 
                    onClick={() => removeLocation(index)}
                    className="remove-location"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <button 
            type="button" 
            onClick={() => setShowAddLocationModal(true)}
            className="add-location-btn"
          >
            + Add Additional Location
          </button>

          {/* Modal for Adding Location */}
          {showAddLocationModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Add Location</h2>
                  <button 
                    type="button"
                    onClick={() => setShowAddLocationModal(false)}
                    className="close-btn"
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <label htmlFor="new-street"><b>Street Address</b></label>
                  <input
                    type="text"
                    placeholder="Enter Street Address"
                    name="street"
                    id="new-street"
                    value={newLocation.street}
                    onChange={handleNewLocationChange}
                    required
                  />

                  <label htmlFor="new-town"><b>Town/City</b></label>
                  <input
                    type="text"
                    placeholder="Enter Town or City"
                    name="town"
                    id="new-town"
                    value={newLocation.town}
                    onChange={handleNewLocationChange}
                    required
                  />

                  <label htmlFor="new-state"><b>State</b></label>
                  <input
                    type="text"
                    placeholder="Enter State or Province"
                    name="state"
                    id="new-state"
                    value={newLocation.state}
                    onChange={handleNewLocationChange}
                    required
                  />

                  <label htmlFor="new-zip"><b>ZIP/Postal Code</b></label>
                  <input
                    type="text"
                    placeholder="Enter ZIP or Postal Code"
                    name="zip"
                    id="new-zip"
                    value={newLocation.zip}
                    onChange={handleNewLocationChange}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={addLocation}
                    className="btn-primary"
                  >
                    Add Location
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddLocationModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
 
          <label htmlFor="keywords"><b>Keywords</b></label>
          <input
            type="text"
            placeholder="Enter keywords (comma-separated)"
            name="keywords"
            id="keywords"
            value={formData.keywords}
            onChange={handleChange}
            required
          />
          <small>Example: lunch, coffee, vegan, pet-friendly</small>
 
          <label htmlFor="description"><b>Business Description</b></label>
          <textarea
            placeholder="Tell us about your business..."
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
 
          <label htmlFor="image"><b>Business Image</b></label>
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            onChange={handleChange}
            required
          />
          <small>Upload a photo of your business (JPEG, PNG)</small>

          <button type="submit" className="submit-button" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Application;
