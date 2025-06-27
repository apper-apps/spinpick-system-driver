import { entries } from '@/services/mockData/entries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let entryData = [...entries];

export const entryService = {
  async getAll() {
    await delay(300);
    return [...entryData];
  },

  async getById(id) {
    await delay(200);
    const entry = entryData.find(item => item.Id === parseInt(id, 10));
    if (!entry) {
      throw new Error('Entry not found');
    }
    return { ...entry };
  },

  async create(entryData) {
    await delay(300);
    const maxId = Math.max(...entryData.map(item => item.Id), 0);
    const newEntry = {
      ...entryData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    entryData.push(newEntry);
    return { ...newEntry };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = entryData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Entry not found');
    }
    const { Id, ...dataWithoutId } = updatedData;
    entryData[index] = { ...entryData[index], ...dataWithoutId };
    return { ...entryData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = entryData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Entry not found');
    }
    const deletedEntry = { ...entryData[index] };
    entryData.splice(index, 1);
    return deletedEntry;
  },

  async deleteAll() {
    await delay(200);
    entryData = [];
    return true;
  },

  async reorder(reorderedEntries) {
    await delay(200);
    entryData = [...reorderedEntries];
    return [...entryData];
  }
};