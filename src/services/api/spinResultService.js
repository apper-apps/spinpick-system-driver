import React from "react";
import { spinResults } from "@/services/mockData/spinResults.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let spinResultData = [...spinResults];

export const spinResultService = {
  async getAll() {
    await delay(200);
    return [...spinResultData];
  },

  async getByWheelId(wheelId) {
    await delay(200);
    return spinResultData.filter(result => result.wheelId === wheelId);
  },

  async create(resultData) {
    await delay(200);
    const maxId = Math.max(...spinResultData.map(item => item.Id), 0);
    const newResult = {
      ...resultData,
      Id: maxId + 1,
      timestamp: new Date().toISOString()
    };
    spinResultData.push(newResult);
    return { ...newResult };
  },

async clearHistory() {
    await delay(200);
    spinResultData = [];
    return true;
  },

  async deleteAll() {
    await delay(200);
    spinResultData.length = 0;
    return true;
  }
};