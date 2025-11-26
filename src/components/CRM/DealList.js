import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';
import { getAllDeals, removeDeal, getDealsByStatus } from '../../services/crmService';

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      console.log('Loading deals, statusFilter:', statusFilter);
      const data = statusFilter ? await getDealsByStatus(statusFilter) : await getAllDeals();
      console.log('Deals loaded:', data);
      setDeals(data);
    } catch (err) {
      console.error('Error loading deals:', err);
      setError('Failed to load deals: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await removeDeal(id);
      setDeals(deals.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting deal:', err);
      setError('Failed to delete deal');
    }
  };

  return (
    <div className="crm-list-page">
      <div className="crm-list-header">
        <h1>Deals</h1>
        <Link to="/crm/deals/new" className="btn btn-primary">+ New Deal</Link>
      </div>

      <div className="filter-controls">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading deals...</div>}

      {!loading && deals.length === 0 && (
        <div className="empty-state">
          <p>No deals found. <Link to="/crm/deals/new">Create one</Link></p>
        </div>
      )}

      {!loading && deals.length > 0 && (
        <table className="crm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Expected Close</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td><strong>{deal.title}</strong></td>
                <td>{deal.company || '—'}</td>
                <td>${deal.amount || '0'}</td>
                <td><span className={`status-badge status-${deal.status?.toLowerCase()}`}>{deal.status}</span></td>
                <td>{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '—'}</td>
                <td>
                  <Link to={`/crm/deals/${deal.id}`} className="link-btn">View</Link>
                  <Link to={`/crm/deals/${deal.id}/edit`} className="link-btn">Edit</Link>
                  <button onClick={() => handleDelete(deal.id)} className="link-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DealList;
