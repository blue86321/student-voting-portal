
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Candidate, Election, ElectionDetail, Position, PositionDetail, Vote, VoteDetail } from '../Interfaces/Election';
import User, { CreateUserParams, LoginParams, LoginResponse, University } from '../Interfaces/User';

export interface Response<T = any> {
  data: T | undefined;
  msg: string;
  code: number;
  success: boolean;
}

const HOST_URL = "http://localhost:8080";


class MyApi {
  axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = axios.create({ baseURL: HOST_URL, timeout: 10000 })
  }

  /** General request, all API method send request through this method */
  async request(params: AxiosRequestConfig): Promise<Response> {
    try {
      const res = await this.axiosInstance.request({
        ...params,
        method: params.method
      })
      console.log('[MyApi] response: ' + JSON.stringify(res))
      return res.data
    } catch (e) {
      console.log('[MyApi] error: ' + e)
      const defaultFailResp = { data: undefined, msg: "", code: 0, success: false }
      if (e instanceof AxiosError) {
        const resData: Response | undefined = e.response?.data;
        return resData
          ? { data: undefined, msg: resData.msg, code: resData.code, success: false }
          : defaultFailResp
      }
      return defaultFailResp
    }
  }


  //The login method is a specific API method for performing user authentication. 
  async login(data: LoginParams): Promise<Response<LoginResponse>> {
    //Inside the login method, an AxiosRequestConfig object is created with the URL, method, and data for the authentication request. 
    const params: AxiosRequestConfig = { url: '/authentication/', method: 'POST', data: data } // question, DOC says no parameter, what is data here?
    //The request method is then called with the created parameters, and the response is returned.
    const response = await this.request(params)
    // Assuming the token is returned in the response data as 'token'
    if (response.success) {
      const token = response.data.token;
      // Store the token in localStorage
      localStorage.setItem('token', token.access);
      console.log("[MyApi] set token: " + JSON.stringify(token));
    }
    // your post-process logic. e.g. calculate who's the election winner and add a tag to it.
    return response
  }

  async deleteLogin(): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/authentication/',
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }

  // '/positions/'
  async getPositions(): Promise<Response<PositionDetail[]>> {
    const params: AxiosRequestConfig = { url: '/positions/', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async createPosition(positionData: Position): Promise<Response<PositionDetail>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/positions/',
      method: 'POST',
      data: positionData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    console.log('[myAPI] createPosition', params);
    const response = await this.request(params);
    return response;
  }
  async updatePosition(query: { positionData: Position, positionId: string }): Promise<Response<PositionDetail>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/positions/${query.positionId}/`,
      method: 'PATCH',
      data: query.positionData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async deletePosition(positionId: string): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/positions/${positionId}/`, method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async getPosition(positionId: string): Promise<Response<PositionDetail>> {
    const params: AxiosRequestConfig = { url: `/positions/${positionId}/`, method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async updateputPosition(query: { positionData: Position, positionId: string }): Promise<Response<PositionDetail>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/positions/${query.positionId}/`,
      method: 'PUT',
      data: query.positionData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }

  // '/elections/'
  async createElection(electionData: Election): Promise<Response<ElectionDetail>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/elections/',
      method: 'POST',
      data: electionData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    console.log("[myapi] createElection")
    const response = await this.request(params);
    return response;
  }
  async updateElection(query: { electionData: Election, electionId: string }): Promise<Response<ElectionDetail>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/elections/${query.electionId}/`,
      method: 'PATCH',
      data: query.electionData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      },
      maxRedirects: 0
    };
    const response = await this.request(params);
    return response;
  }
  async deleteElection(electionId: string): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/elections/${electionId}/`, method: 'DELETE', headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async getElection(electionId: string): Promise<Response<ElectionDetail>> {
    const params: AxiosRequestConfig = { url: `/elections/${electionId}/`, method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  //for this endpoint, the returned response only contains each position's winner's information. please check response json for details
  async getElections(): Promise<Response<ElectionDetail[]>> {
    const params: AxiosRequestConfig = { url: `/elections/`, method: 'GET' };
    const response = await this.request(params);

    // Check if the response is successful and contains data
    if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
      const election = response.data.data[0];

      // Iterate through each position in the election
      for (const position of election.positions as PositionDetail[]) {

        // Calculate the vote percentage for the winner
        const totalVotes = position.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

        // Find the candidate with the highest voteCount for each position
        let highestVoteCount = 0;
        let winnerId = -1;
        for (const candidate of position.candidates) {
          if (candidate.voteCount > highestVoteCount) {
            highestVoteCount = candidate.voteCount;
            winnerId = candidate.id;
          }
        }

        // Whether there is only one winner for the position
        const oneWinner = position.candidates.filter((candidate) => candidate.voteCount === highestVoteCount)!.length > 0

        position.candidates = position.candidates.map((candidate) => ({
          ...candidate,
          winner: oneWinner ? candidate.id === winnerId : false,
          votePercentage: +((candidate.voteCount / totalVotes) * 100).toFixed(2),
        }))
      }
    }

    // Return the modified response
    return response;
  }
  async updateputElection(query: { electionData: Election, electionId: string }): Promise<Response<ElectionDetail>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    const params: AxiosRequestConfig = {
      url: `/elections/${query.electionId}/`,
      method: 'PUT',
      data: query.electionData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };

    const response = await this.request(params);
    return response;
  }

  // '/candidates/'
  async getCandidates(): Promise<Response<Candidate[]>> {
    const params: AxiosRequestConfig = { url: '/candidates/', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async createCandidate(candidateData: Candidate): Promise<Response<Candidate>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/candidates/',
      method: 'POST',
      data: candidateData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async updateCandidate(query: { candidateData: Candidate, candidateId: string }): Promise<Response<Candidate>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/candidates/${query.candidateId}/`,
      method: 'PATCH',
      data: query.candidateData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async deleteCandidate(candidateId: string): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/candidates/${candidateId}/`, method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async getCandidate(candidateId: string): Promise<Response<Candidate>> {
    const params: AxiosRequestConfig = { url: `/candidates/${candidateId}/`, method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async updateputCandidate(query: { candidateData: Candidate, candidateId: string }): Promise<Response<Candidate>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/candidates/${query.candidateId}/`,
      method: 'PUT',
      data: query.candidateData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }

  // '/votes/'
  async getVotes(): Promise<Response<VoteDetail[]>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/votes/', method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async createVote(voteData: Vote): Promise<Response<Vote>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/votes/',
      method: 'POST',
      data: voteData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }

  // '/users/'
  async getUsers(): Promise<Response<User[]>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/users/', method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async createUser(userData: CreateUserParams): Promise<Response<LoginResponse>> {
    const params: AxiosRequestConfig = {
      url: '/users/',
      method: 'POST',
      data: userData
    };
    const response = await this.request(params);
    // set token
    if (response.success) {
      const token = response.data.token;
      localStorage.setItem('token', token.access);
    }
    return response;
  }
  async getUser(userId: string): Promise<Response<User>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/users/${userId}/`, method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async deleteUser(userId: string): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/users/${userId}/`, method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async updateUser(query: { userData: CreateUserParams, userId: string }): Promise<Response<User>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/users/${query.userId}/`,
      method: 'PATCH',
      data: query.userData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }

  // '/me/'
  async getMe(): Promise<Response<User>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    console.log("[MyApi] getMe with token: " + token);
    const params: AxiosRequestConfig = {
      url: '/me/', method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async deleteMe(): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/me/`, method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  async updateMe(userData: CreateUserParams): Promise<Response<User>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: '/me/',
      method: 'PATCH',
      data: userData,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }

  // '/university/'
  async getUniversities(): Promise<Response<University[]>> {
    const params: AxiosRequestConfig = { url: '/university/', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async createUniversity(name: String): Promise<Response<University>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const data = { name };
    const params: AxiosRequestConfig = {
      url: '/university/', method: 'POST', data,
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
  // '/university/${universityId}/'
  async getUniversity(universityId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/university/${universityId}/`, method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async deleteUniversity(universityId: string): Promise<Response> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const params: AxiosRequestConfig = {
      url: `/university/${universityId}/`, method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      }
    };
    const response = await this.request(params);
    return response;
  }
}

const myApi = new MyApi()
export default myApi
