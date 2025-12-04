import React, { useState, useEffect } from 'react';
import BusinessCard from './BusinessCard';
import { getAllBusinesses, getBusinessesByKeyword } from '../services/businessService';
import './BusinessList.css';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const businessesPerPage = 9;

  // load all businesses on component mount
  useEffect(() => {
    const loadBusinesses = async () => {
      setIsLoading(true);
      setCurrentPage(1); // Reset to first page
      try {
        const allBusinesses = await getAllBusinesses();
        setBusinesses(allBusinesses);
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is empty, load all businesses
      setCurrentPage(1); // Reset to first page
      const allBusinesses = await getAllBusinesses();
      setBusinesses(allBusinesses);
      return;
    }

    setIsLoading(true);
    setCurrentPage(1); // Reset to first page
    try {
      const results = await getBusinessesByKeyword(searchQuery.trim());
      setBusinesses(results);
    } catch (error) {
      console.error('Error searching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate pagination
  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = businesses.slice(indexOfFirstBusiness, indexOfLastBusiness);
  const totalPages = Math.ceil(businesses.length / businessesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  return (
    <div className="business-list-container">
      <div className="search-container">
        <label htmlFor="search-input" className="visually-hidden">
          Search Businesses!
        </label>
        <input
          type="text"
          id="search-input"
          name="search"
          className="search-input"
          placeholder="Search for local businesses"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button id="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <div className="business-list">
        {businesses.length === 0 && !isLoading ? (
          <p>No businesses found.</p>
        ) : (
          currentBusinesses.map((business, index) => (
            <BusinessCard key={index} business={business} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {businesses.length > 0 && !isLoading && (
        <div className="pagination-controls">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessList;
