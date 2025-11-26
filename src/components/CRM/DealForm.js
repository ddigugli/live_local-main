import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CRM.css';
import { addDeal, editDeal, getDealById } from '../../services/crmService';

const DealForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [form, setForm] = useState({
    title: '',
    company: '',
    amount: '',
    status: 'Open',
    expectedCloseDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isEdit) {
      loadDeal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDeal = async () => {
    try {
      setLoading(true);
      const deal = await getDealById(id);
      if (deal) {
        setForm({
          title: deal.title || '',
          company: deal.company || '',
          amount: deal.amount || '',
          status: deal.status || 'Open',
          expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
          description: deal.description || '',
        });
      }
    } catch (err) {
      console.error('Error loading deal:', err);
      setError('Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEdit) {
        await editDeal(id, form);
      } else {
        await addDeal(form);
      }
      navigate('/crm/deals');
    } catch (err) {
      console.error('Error saving deal:', err);
      setError('Failed to save deal');
    }
  };

  return (
    <div className="crm-form-page">
      <h1>{isEdit ? 'Edit Deal' : 'New Deal'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <form onSubmit={handleSubmit} className="crm-form">
          <div className="form-group">
            <label>Deal Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Open">Open</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="form-group">
              <label>Expected Close Date</label>
              <input type="date" name="expectedCloseDate" value={form.expectedCloseDate} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4"></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Deal</button>
            <button type="button" onClick={() => navigate('/crm/deals')} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DealForm;
