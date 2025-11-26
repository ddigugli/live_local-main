// Student B - configured webpack, migrated files from feature 3 into live-local (the new create-react-app directory)

import React from 'react';
// Student b - adding in routing 
// the Link part in the router allows us to navigate w/out reloading the page - tells router to render the matching route

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BusinessList from './components/BusinessList';
import Application from './components/Application';
import Profile from './components/Profile';
import Results from './components/Results';
import BusinessDetail from './components/BusinessDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RedirectIfAuthenticated from './components/Auth/RedirectIfAuthenticated';
import { isAuthenticated, logout, subscribe as subscribeAuth } from './components/Auth/authService.js';
import './App.css';
import { isParseConfigured } from './services/parseService';
import CRMDashboard from './components/CRM/CRMDashboard';
import ContactList from './components/CRM/ContactList';
import ContactForm from './components/CRM/ContactForm';
import DealList from './components/CRM/DealList';
import DealForm from './components/CRM/DealForm';
import CompanyList from './components/CRM/CompanyList';
import CompanyForm from './components/CRM/CompanyForm';
import TaskList from './components/CRM/TaskList';
import TaskForm from './components/CRM/TaskForm';

function HomePage() {
  return (
    <main>
      <BusinessList />
      
        <div className="suggested-section">
          <h2>Suggested Categories to Explore</h2>
          <div className="image-row">
            <Link to="/results?keyword=Cafes" className="image-container">
              <img src="/images/coffee.jpg" alt="Cafes" />
              <div className="image-caption">Cafes</div>
            </Link>
            <Link to="/results?keyword=Lunch" className="image-container">
              <img src="/images/sanwich.jpg" alt="Lunch Places" />
              <div className="image-caption">Lunch Places</div>
            </Link>
            <Link to="/results?keyword=Other" className="image-container">
              <img src="/images/clothes_picture.jpg" alt="Other" />
              <div className="image-caption">Other</div>
            </Link>
          </div>
        </div>
      
      <div className="map-section">
        <h2>Location Map</h2>
        <div className="map-container">
          <img src="/images/map_image.webp" alt="Location Map" />
        </div>
      </div>
    </main>
  );
}


// registering routes 
function App() {
  // Header placed inside Router so hooks like useNavigate work
  const Header = () => {
    const navigate = useNavigate();
    const [authed, setAuthed] = React.useState(isAuthenticated());

    React.useEffect(() => {
      // subscribe to auth changes so header updates reactively
      const unsub = subscribeAuth(() => {
        setAuthed(isAuthenticated());
      });
      return unsub;
    }, []);

    const doLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.error('Logout failed', e);
      }
      setAuthed(false);
      navigate('/login', { replace: true });
    };

    return (
      <header className="App-header">
        <h1>Live Local</h1>
        {process.env.NODE_ENV !== 'production' && !isParseConfigured && (
          <div className="parse-warning">Parse not configured — running in local/fallback mode</div>
        )}
        <nav>
          <ul className="nav-links">
            {authed ? (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/application">Apply</Link></li>
                <li><Link to="/crm">CRM</Link></li>
                <li><Link to="/profile">User Profile</Link></li>
                <li><button onClick={doLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Sign in</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    );
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* pages we want to be able to navigate to - in each of these pages we have to import the Link var from react-router-dom to allow for routing to work */}
          {/* Protect the root route so unauthenticated users are redirected to /login */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

          {/* Protected routes: redirect to /login when user is not authenticated */}
          <Route
            path="/application"
            element={
              <ProtectedRoute>
                <Application />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/results" element={<Results />} />
          <Route path="/business/:id" element={<BusinessDetail />} />

          {/* CRM Routes */}
          <Route
            path="/crm"
            element={
              <ProtectedRoute>
                <CRMDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/contacts"
            element={
              <ProtectedRoute>
                <ContactList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/contacts/new"
            element={
              <ProtectedRoute>
                <ContactForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/contacts/:id/edit"
            element={
              <ProtectedRoute>
                <ContactForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/deals"
            element={
              <ProtectedRoute>
                <DealList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/deals/new"
            element={
              <ProtectedRoute>
                <DealForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/deals/:id/edit"
            element={
              <ProtectedRoute>
                <DealForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/companies"
            element={
              <ProtectedRoute>
                <CompanyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/companies/new"
            element={
              <ProtectedRoute>
                <CompanyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/companies/:id/edit"
            element={
              <ProtectedRoute>
                <CompanyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/tasks"
            element={
              <ProtectedRoute>
                <TaskList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/tasks/new"
            element={
              <ProtectedRoute>
                <TaskForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm/tasks/:id/edit"
            element={
              <ProtectedRoute>
                <TaskForm />
              </ProtectedRoute>
            }
          />

          {/* Authentication routes */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
