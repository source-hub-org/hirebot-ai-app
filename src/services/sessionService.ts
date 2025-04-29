import axios from 'axios';

export const fetchSessionDetails = async (sessionId: string) => {
  try {
    const response = await axios.get(`/api/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy thông tin phiên phỏng vấn');
  }
};
