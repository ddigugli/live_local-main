import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';
import { getAllContacts, removeContact } from '../../services/crmService';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      console.log('Loading contacts...');
      const data = await getAllContacts();
      console.log('Contacts loaded:', data);
      setContacts(data);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Failed to load contacts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await removeContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  return (
    <div className="crm-list-page">
      <div className="crm-list-header">
        <h1>Contacts</h1>
        <Link to="/crm/contacts/new" className="btn btn-primary">+ New Contact</Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading contacts...</div>}

      {!loading && contacts.length === 0 && (
        <div className="empty-state">
          <p>No contacts yet. <Link to="/crm/contacts/new">Create one</Link></p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td><strong>{contact.firstName} {contact.lastName}</strong></td>
                <td>{contact.email || '—'}</td>
                <td>{contact.phone || '—'}</td>
                <td>{contact.company || '—'}</td>
                <td>
                  <Link to={`/crm/contacts/${contact.id}`} className="link-btn">View</Link>
                  <Link to={`/crm/contacts/${contact.id}/edit`} className="link-btn">Edit</Link>
                  <button onClick={() => handleDelete(contact.id)} className="link-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactList;
