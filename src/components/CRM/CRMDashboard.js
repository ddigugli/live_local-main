import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';
import { getAllContacts, getAllCompanies, getAllDeals, getAllTasks } from '../../services/crmService';

const CRMDashboard = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    companies: 0,
    deals: 0,
    tasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading CRM stats...');
        const [contacts, companies, deals, tasks] = await Promise.all([
          getAllContacts(),
          getAllCompanies(),
          getAllDeals(),
          getAllTasks(),
        ]);
        console.log('CRM stats loaded:', { contacts: contacts.length, companies: companies.length, deals: deals.length, tasks: tasks.length });
        setStats({
          contacts: contacts.length,
          companies: companies.length,
          deals: deals.length,
          tasks: tasks.length,
        });
      } catch (err) {
        console.error('Error loading CRM stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="crm-dashboard">
      <div className="crm-header">
        <h1>CRM Dashboard</h1>
        <p>Manage your business relationships and sales pipeline</p>
      </div>

      {loading && <div className="loading">Loading dashboard...</div>}

      {!loading && (
        <>
          <div className="crm-stats">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Contacts</h3>
                <p className="stat-number">{stats.contacts}</p>
                <Link to="/crm/contacts" className="stat-link">View All</Link>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3>Companies</h3>
                <p className="stat-number">{stats.companies}</p>
                <Link to="/crm/companies" className="stat-link">View All</Link>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-content">
                <h3>Deals</h3>
                <p className="stat-number">{stats.deals}</p>
                <Link to="/crm/deals" className="stat-link">View All</Link>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Tasks</h3>
                <p className="stat-number">{stats.tasks}</p>
                <Link to="/crm/tasks" className="stat-link">View All</Link>
              </div>
            </div>
          </div>

          <div className="crm-actions">
            <Link to="/crm/contacts/new" className="btn btn-primary">+ New Contact</Link>
            <Link to="/crm/companies/new" className="btn btn-primary">+ New Company</Link>
            <Link to="/crm/deals/new" className="btn btn-primary">+ New Deal</Link>
            <Link to="/crm/tasks/new" className="btn btn-primary">+ New Task</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CRMDashboard;
