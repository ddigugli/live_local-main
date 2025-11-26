import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CRM.css';
import { addContact, editContact, getContactById } from '../../services/crmService';

const ContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isEdit) {
      loadContact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadContact = async () => {
    try {
      setLoading(true);
      const contact = await getContactById(id);
      if (contact) {
        setForm({
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company: contact.company || '',
          title: contact.title || '',
          notes: contact.notes || '',
        });
      }
    } catch (err) {
      console.error('Error loading contact:', err);
      setError('Failed to load contact');
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
        await editContact(id, form);
      } else {
        await addContact(form);
      }
      navigate('/crm/contacts');
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Failed to save contact');
    }
  };

  return (
    <div className="crm-form-page">
      <h1>{isEdit ? 'Edit Contact' : 'New Contact'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <form onSubmit={handleSubmit} className="crm-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="4"></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Contact</button>
            <button type="button" onClick={() => navigate('/crm/contacts')} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
