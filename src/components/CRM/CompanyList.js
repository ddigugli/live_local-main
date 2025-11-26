import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';
import { getAllCompanies, removeCompany } from '../../services/crmService';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      console.log('Loading companies...');
      const data = await getAllCompanies();
      console.log('Companies loaded:', data);
      setCompanies(data);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await removeCompany(id);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company');
    }
  };

  return (
    <div className="crm-list-page">
      <div className="crm-list-header">
        <h1>Companies</h1>
        <Link to="/crm/companies/new" className="btn btn-primary">+ New Company</Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading companies...</div>}

      {!loading && companies.length === 0 && (
        <div className="empty-state">
          <p>No companies found. <Link to="/crm/companies/new">Create one</Link></p>
        </div>
      )}

      {!loading && companies.length > 0 && (
        <table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Website</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td><strong>{company.name}</strong></td>
                <td>{company.website || '—'}</td>
                <td>{company.phone || '—'}</td>
                <td>{company.address || '—'}</td>
                <td>
                  <Link to={`/crm/companies/${company.id}`} className="link-btn">View</Link>
                  <Link to={`/crm/companies/${company.id}/edit`} className="link-btn">Edit</Link>
                  <button onClick={() => handleDelete(company.id)} className="link-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompanyList;
