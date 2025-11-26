// CRM Service — high-level business logic and error handling
import * as CRMModels from '../models/CRM.js';

// Wrapper to normalize Parse objects to plain JS
const toPlain = (obj) => {
  if (!obj) return null;
  const json = obj.toJSON ? obj.toJSON() : obj;
  return {
    ...json,
    id: json.objectId,
  };
};

console.log('CRM Service initialized');

// ============== CONTACT SERVICE ==============
export const getAllContacts = async () => {
  try {
    const results = await CRMModels.fetchAllContacts();
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch contacts:', err);
    return [];
  }
};

export const getContactById = async (id) => {
  try {
    const result = await CRMModels.findContactById(id);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to fetch contact:', err);
    return null;
  }
};

export const addContact = async (data) => {
  try {
    const result = await CRMModels.createContact(data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to create contact:', err);
    throw err;
  }
};

export const editContact = async (id, data) => {
  try {
    const result = await CRMModels.updateContact(id, data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to update contact:', err);
    throw err;
  }
};

export const removeContact = async (id) => {
  try {
    return await CRMModels.deleteContact(id);
  } catch (err) {
    console.error('Failed to delete contact:', err);
    throw err;
  }
};

export const getContactsByCompany = async (companyId) => {
  try {
    const results = await CRMModels.findContactsByCompany(companyId);
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch contacts by company:', err);
    return [];
  }
};

// ============== COMPANY SERVICE ==============
export const getAllCompanies = async () => {
  try {
    const results = await CRMModels.fetchAllCompanies();
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch companies:', err);
    return [];
  }
};

export const getCompanyById = async (id) => {
  try {
    const result = await CRMModels.findCompanyById(id);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to fetch company:', err);
    return null;
  }
};

export const addCompany = async (data) => {
  try {
    const result = await CRMModels.createCompany(data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to create company:', err);
    throw err;
  }
};

export const editCompany = async (id, data) => {
  try {
    const result = await CRMModels.updateCompany(id, data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to update company:', err);
    throw err;
  }
};

export const removeCompany = async (id) => {
  try {
    return await CRMModels.deleteCompany(id);
  } catch (err) {
    console.error('Failed to delete company:', err);
    throw err;
  }
};

// ============== DEAL SERVICE ==============
export const getAllDeals = async () => {
  try {
    const results = await CRMModels.fetchAllDeals();
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch deals:', err);
    return [];
  }
};

export const getDealById = async (id) => {
  try {
    const result = await CRMModels.findDealById(id);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to fetch deal:', err);
    return null;
  }
};

export const addDeal = async (data) => {
  try {
    const result = await CRMModels.createDeal(data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to create deal:', err);
    throw err;
  }
};

export const editDeal = async (id, data) => {
  try {
    const result = await CRMModels.updateDeal(id, data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to update deal:', err);
    throw err;
  }
};

export const removeDeal = async (id) => {
  try {
    return await CRMModels.deleteDeal(id);
  } catch (err) {
    console.error('Failed to delete deal:', err);
    throw err;
  }
};

export const getDealsByStatus = async (status) => {
  try {
    const results = await CRMModels.findDealsByStatus(status);
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch deals by status:', err);
    return [];
  }
};

// ============== TASK SERVICE ==============
export const getAllTasks = async () => {
  try {
    const results = await CRMModels.fetchAllTasks();
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    return [];
  }
};

export const getTaskById = async (id) => {
  try {
    const result = await CRMModels.findTaskById(id);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to fetch task:', err);
    return null;
  }
};

export const addTask = async (data) => {
  try {
    const result = await CRMModels.createTask(data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to create task:', err);
    throw err;
  }
};

export const editTask = async (id, data) => {
  try {
    const result = await CRMModels.updateTask(id, data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to update task:', err);
    throw err;
  }
};

export const removeTask = async (id) => {
  try {
    return await CRMModels.deleteTask(id);
  } catch (err) {
    console.error('Failed to delete task:', err);
    throw err;
  }
};

// ============== ACTIVITY SERVICE ==============
export const getAllActivities = async () => {
  try {
    const results = await CRMModels.fetchAllActivities();
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch activities:', err);
    return [];
  }
};

export const getActivitiesByContact = async (contactId) => {
  try {
    const results = await CRMModels.findActivitiesByContact(contactId);
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch activities:', err);
    return [];
  }
};

export const getActivitiesByDeal = async (dealId) => {
  try {
    const results = await CRMModels.findActivitiesByDeal(dealId);
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch activities:', err);
    return [];
  }
};

export const addActivity = async (data) => {
  try {
    const result = await CRMModels.createActivity(data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to create activity:', err);
    throw err;
  }
};

// ============== NOTE SERVICE ==============
export const getAllNotes = async () => {
  try {
    const results = await CRMModels.fetchAllNotes();
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch notes:', err);
    return [];
  }
};

export const getNotesByContact = async (contactId) => {
  try {
    const results = await CRMModels.findNotesByContact(contactId);
    return results.map(toPlain);
  } catch (err) {
    console.error('Failed to fetch notes:', err);
    return [];
  }
};

export const addNote = async (data) => {
  try {
    const result = await CRMModels.createNote(data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to create note:', err);
    throw err;
  }
};

export const editNote = async (id, data) => {
  try {
    const result = await CRMModels.updateNote(id, data);
    return toPlain(result);
  } catch (err) {
    console.error('Failed to update note:', err);
    throw err;
  }
};

export const removeNote = async (id) => {
  try {
    return await CRMModels.deleteNote(id);
  } catch (err) {
    console.error('Failed to delete note:', err);
    throw err;
  }
};
