import { wheels } from '@/services/mockData/wheels.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let wheelData = [...wheels];

export const wheelService = {
  async getAll() {
    await delay(300);
    return [...wheelData];
  },

  async getById(id) {
    await delay(200);
    const wheel = wheelData.find(item => item.Id === parseInt(id, 10));
    if (!wheel) {
      throw new Error('Wheel not found');
    }
    return { ...wheel };
  },

  async create(wheelInfo) {
    await delay(300);
    const maxId = Math.max(...wheelData.map(item => item.Id), 0);
    const newWheel = {
      ...wheelInfo,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    wheelData.push(newWheel);
    return { ...newWheel };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = wheelData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Wheel not found');
    }
    const { Id, ...dataWithoutId } = updatedData;
    wheelData[index] = { ...wheelData[index], ...dataWithoutId };
    return { ...wheelData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = wheelData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Wheel not found');
    }
    const deletedWheel = { ...wheelData[index] };
    wheelData.splice(index, 1);
    return deletedWheel;
  }
};