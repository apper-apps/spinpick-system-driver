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
},

  async generateThumbnail(wheel) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 5;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!wheel.entries || wheel.entries.length === 0) {
        // Draw empty wheel
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#F3F4F6';
        ctx.fill();
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        resolve(canvas.toDataURL());
        return;
      }
      
      // Draw wheel segments
      const anglePerSegment = (2 * Math.PI) / wheel.entries.length;
      
      wheel.entries.forEach((entry, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = entry.color || '#7C3AED';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#374151';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      resolve(canvas.toDataURL());
    });
  }
};