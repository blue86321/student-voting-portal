import axios from "axios";
import Election from "../model/Election.model";
import Position from "../model/Position.model";
import Candidate from "../model/Candidate.model";
// import { authedUser } from "../model/User.model";

const HOST_URL = "http://localhost:8080";

// const config = {
//   headers: { token: `${authedUser.token}`}
// }

export const authentication = async (data) => {
  try {
    const response = await axios.post(`${HOST_URL}/authentication/`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error submitting data(create election):", error);
    throw error;
  }
};

export const fetchElections = async (): Promise<Election[]> => {
  try {
    const response = await axios.get(`${HOST_URL}/elections/`);
    console.log('[API] response: ' + JSON.stringify(response));
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data(fetch elections):", error);
    throw error;
  }
};

export const createElection = async (data) => {
  // data['token'] = authedUser.token;
  try {
    const response = await axios.post(`${HOST_URL}/elections/`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting data(create election):", error);
    throw error;
  }
};

export const fetchPositions = async (): Promise<[Position]> => {
  try {
    const response = await axios.get(`${HOST_URL}/positions/`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data(fetch positions):", error);
    throw error;
  }
};

export const createPosition = async (data) => {
  try {
    const response = await axios.post(`${HOST_URL}/positions/`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting data(create position):", error);
    throw error;
  }
};

export const fetchCandidates = async (): Promise<[Candidate]> => {
    try {
      const response = await axios.get(`${HOST_URL}/candidates/`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data(fetch candidates):", error);
      throw error;
    }
  };
  
  export const createCandidate = async (data) => {
    try {
      const response = await axios.post(`${HOST_URL}/candidates/`, data);
      return response.data;
    } catch (error) {
      console.error("Error submitting data(create candidate):", error);
      throw error;
    }
  };
