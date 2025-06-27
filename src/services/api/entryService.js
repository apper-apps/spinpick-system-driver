import entryData from '@/services/mockData/entries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let entries = [...entryData];

export const entryService = {
  async getAll() {
    await delay(300);
    return [...entries];
  },

  async getById(id) {
    await delay(200);
    const entry = entries.find(item => item.Id === parseInt(id, 10));
    if (!entry) {
      throw new Error('Entry not found');
    }
    return { ...entry };
  },

  async create(entryData) {
    await delay(300);
    const maxId = Math.max(...entries.map(item => item.Id), 0);
    const newEntry = {
      ...entryData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    entries.push(newEntry);
    return { ...newEntry };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = entries.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Entry not found');
    }
    const { Id, ...dataWithoutId } = updatedData;
    entries[index] = { ...entries[index], ...dataWithoutId };
    return { ...entries[index] };
  },

  async delete(id) {
    await delay(200);
    const index = entries.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Entry not found');
    }
    const deletedEntry = { ...entries[index] };
    entries.splice(index, 1);
    return deletedEntry;
  },

  async deleteAll() {
    await delay(200);
    entries = [];
    return true;
  },

  async reorder(reorderedEntries) {
    await delay(200);
    entries = [...reorderedEntries];
    return [...entries];
  }
};