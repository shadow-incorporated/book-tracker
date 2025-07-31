import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: Error | any ) {
    throw error.response.data;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error: Error | any) {
    throw error.response.data;
  }
};

export const loginWithGoogle = async (token: string) => {
    
}