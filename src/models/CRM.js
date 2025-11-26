// CRM Model Helpers — Parse queries and CRUD for CRM classes
// Classes: Contact, Company, Deal, Task, Activity, Note

import Parse from '../services/parseService.js';

// ============== CONTACT CLASS ==============
export const createContact = async (data = {}) => {
  const obj = new Parse.Object('Contact');
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  // Set owner to current user if available
  try {
    const user = Parse.User.current();
    if (user) obj.set('owner', user);
  } catch (e) {
    // ignore
  }
  return obj.save();
};

export const fetchAllContacts = async (limit = 1000) => {
  const Contact = Parse.Object.extend('Contact');
  const q = new Parse.Query(Contact);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const findContactById = async (id) => {
  if (!id) throw new Error('Missing id');
  const Contact = Parse.Object.extend('Contact');
  const q = new Parse.Query(Contact);
  return q.get(id);
};

export const updateContact = async (id, data = {}) => {
  if (!id) throw new Error('Missing id');
  const Contact = Parse.Object.extend('Contact');
  const q = new Parse.Query(Contact);
  const obj = await q.get(id);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

export const deleteContact = async (id) => {
  if (!id) throw new Error('Missing id');
  const Contact = Parse.Object.extend('Contact');
  const q = new Parse.Query(Contact);
  const obj = await q.get(id);
  return obj.destroy();
};

export const findContactsByCompany = async (companyId, limit = 1000) => {
  if (!companyId) return [];
  const Contact = Parse.Object.extend('Contact');
  const q = new Parse.Query(Contact);
  q.equalTo('company', companyId);
  q.limit(limit);
  return q.find();
};

// ============== COMPANY CLASS ==============
export const createCompany = async (data = {}) => {
  const obj = new Parse.Object('Company');
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  try {
    const user = Parse.User.current();
    if (user) obj.set('owner', user);
  } catch (e) {
    // ignore
  }
  return obj.save();
};

export const fetchAllCompanies = async (limit = 1000) => {
  const Company = Parse.Object.extend('Company');
  const q = new Parse.Query(Company);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const findCompanyById = async (id) => {
  if (!id) throw new Error('Missing id');
  const Company = Parse.Object.extend('Company');
  const q = new Parse.Query(Company);
  return q.get(id);
};

export const updateCompany = async (id, data = {}) => {
  if (!id) throw new Error('Missing id');
  const Company = Parse.Object.extend('Company');
  const q = new Parse.Query(Company);
  const obj = await q.get(id);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

export const deleteCompany = async (id) => {
  if (!id) throw new Error('Missing id');
  const Company = Parse.Object.extend('Company');
  const q = new Parse.Query(Company);
  const obj = await q.get(id);
  return obj.destroy();
};

// ============== DEAL CLASS ==============
export const createDeal = async (data = {}) => {
  const obj = new Parse.Object('Deal');
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  // Set default status to 'Open' if not provided
  if (!obj.get('status')) obj.set('status', 'Open');
  try {
    const user = Parse.User.current();
    if (user) obj.set('owner', user);
  } catch (e) {
    // ignore
  }
  return obj.save();
};

export const fetchAllDeals = async (limit = 1000) => {
  const Deal = Parse.Object.extend('Deal');
  const q = new Parse.Query(Deal);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const findDealById = async (id) => {
  if (!id) throw new Error('Missing id');
  const Deal = Parse.Object.extend('Deal');
  const q = new Parse.Query(Deal);
  return q.get(id);
};

export const updateDeal = async (id, data = {}) => {
  if (!id) throw new Error('Missing id');
  const Deal = Parse.Object.extend('Deal');
  const q = new Parse.Query(Deal);
  const obj = await q.get(id);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

export const deleteDeal = async (id) => {
  if (!id) throw new Error('Missing id');
  const Deal = Parse.Object.extend('Deal');
  const q = new Parse.Query(Deal);
  const obj = await q.get(id);
  return obj.destroy();
};

export const findDealsByStatus = async (status, limit = 1000) => {
  if (!status) return fetchAllDeals(limit);
  const Deal = Parse.Object.extend('Deal');
  const q = new Parse.Query(Deal);
  q.equalTo('status', status);
  q.limit(limit);
  return q.find();
};

// ============== TASK CLASS ==============
export const createTask = async (data = {}) => {
  const obj = new Parse.Object('Task');
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  if (!obj.get('status')) obj.set('status', 'Open');
  try {
    const user = Parse.User.current();
    if (user) obj.set('assignedTo', user);
  } catch (e) {
    // ignore
  }
  return obj.save();
};

export const fetchAllTasks = async (limit = 1000) => {
  const Task = Parse.Object.extend('Task');
  const q = new Parse.Query(Task);
  q.limit(limit);
  q.descending('dueDate');
  return q.find();
};

export const findTaskById = async (id) => {
  if (!id) throw new Error('Missing id');
  const Task = Parse.Object.extend('Task');
  const q = new Parse.Query(Task);
  return q.get(id);
};

export const updateTask = async (id, data = {}) => {
  if (!id) throw new Error('Missing id');
  const Task = Parse.Object.extend('Task');
  const q = new Parse.Query(Task);
  const obj = await q.get(id);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

export const deleteTask = async (id) => {
  if (!id) throw new Error('Missing id');
  const Task = Parse.Object.extend('Task');
  const q = new Parse.Query(Task);
  const obj = await q.get(id);
  return obj.destroy();
};

// ============== ACTIVITY CLASS ==============
export const createActivity = async (data = {}) => {
  const obj = new Parse.Object('Activity');
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  if (!obj.get('activityType')) obj.set('activityType', 'Note');
  try {
    const user = Parse.User.current();
    if (user) obj.set('createdBy', user);
  } catch (e) {
    // ignore
  }
  return obj.save();
};

export const fetchAllActivities = async (limit = 1000) => {
  const Activity = Parse.Object.extend('Activity');
  const q = new Parse.Query(Activity);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const findActivitiesByContact = async (contactId, limit = 1000) => {
  if (!contactId) return [];
  const Activity = Parse.Object.extend('Activity');
  const q = new Parse.Query(Activity);
  q.equalTo('contact', contactId);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const findActivitiesByDeal = async (dealId, limit = 1000) => {
  if (!dealId) return [];
  const Activity = Parse.Object.extend('Activity');
  const q = new Parse.Query(Activity);
  q.equalTo('deal', dealId);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

// ============== NOTE CLASS ==============
export const createNote = async (data = {}) => {
  const obj = new Parse.Object('Note');
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  try {
    const user = Parse.User.current();
    if (user) obj.set('createdBy', user);
  } catch (e) {
    // ignore
  }
  return obj.save();
};

export const fetchAllNotes = async (limit = 1000) => {
  const Note = Parse.Object.extend('Note');
  const q = new Parse.Query(Note);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const findNotesByContact = async (contactId, limit = 1000) => {
  if (!contactId) return [];
  const Note = Parse.Object.extend('Note');
  const q = new Parse.Query(Note);
  q.equalTo('contact', contactId);
  q.limit(limit);
  q.descending('createdAt');
  return q.find();
};

export const updateNote = async (id, data = {}) => {
  if (!id) throw new Error('Missing id');
  const Note = Parse.Object.extend('Note');
  const q = new Parse.Query(Note);
  const obj = await q.get(id);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

export const deleteNote = async (id) => {
  if (!id) throw new Error('Missing id');
  const Note = Parse.Object.extend('Note');
  const q = new Parse.Query(Note);
  const obj = await q.get(id);
  return obj.destroy();
};
