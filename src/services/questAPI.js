// src/services/questAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/quests';

export const fetchAllQuests = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const fetchDailyQuests = async () => {
  const res = await axios.get(`${API_URL}/daily`);
  return res.data;
};

export const joinQuest = async (user_id, quest_id) => {
  return await axios.post(`${API_URL}/join`, { user_id, quest_id });
};

export const getUserQuests = async (user_id) => {
  return await axios.get(`${API_URL}/user/${user_id}`);
};

export const updateProgress = async (user_id, quest_id, progress) => {
  return await axios.post(`${API_URL}/progress`, {
    user_id,
    quest_id,
    progress,
  });
};
