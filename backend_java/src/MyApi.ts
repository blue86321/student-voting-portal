
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginParams, LoginResponse, createUser, Vote, Candidate, Election, Position } from '../Interfaces/User';

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
      return res.data
    } catch (e) {
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
  //It takes in a LoginParams object as a parameter and returns a promise that resolves to a Response object containing a LoginResponse.
  async login(data: LoginParams): Promise<Response<LoginResponse>> {
    //Inside the login method, an AxiosRequestConfig object is created with the URL, method, and data for the authentication request. 
    const params: AxiosRequestConfig = { url: '/authentication/', method: 'POST', data: data } // question, DOC says no parameter, what is data here?
    //The request method is then called with the created parameters, and the response is returned.
    const response = await this.request(params)
    // your post-process logic. e.g. calculate who's the election winner and add a tag to it.
    return response
  }

  async deleteLogin(): Promise<Response> {
    const params: AxiosRequestConfig = { url: '/authentication/', method: 'DELETE' };
    const response = await this.request(params);
    return response;
  }


    // '/positions/'
    async getPositions(): Promise<Response> {
      const params: AxiosRequestConfig = { url: '/positions', method: 'GET' };
      const response = await this.request(params);
      return response;
    }
    async createPosition(positionData: Position): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: '/positions/',
        method: 'POST',
        data: positionData
      };
      const response = await this.request(params);
      return response;
    }
  
    // '/positions/${positionId}'
    async updatePosition(query:{positionData: Position, positionId: string}): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: `/positions/${query.positionId}`,
        method: 'PATCH',
        data: query.positionData
      };
      const response = await this.request(params);
      return response;
    }
    async deletePosition(positionId: string): Promise<Response> {
      const params: AxiosRequestConfig = { url: `/positions/${positionId}`, method: 'DELETE'};
      const response = await this.request(params);
      return response;
    }
    async getPosition(positionId: string): Promise<Response> {
      const params: AxiosRequestConfig = { url: `/positions/${positionId}`, method: 'GET'};
      const response = await this.request(params);
      return response;
    }
    async updateputPosition(query:{positionData: Position, positionId: string}): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: `/positions/${query.positionId}`,
        method: 'PUT',
        data: query.positionData
      };
      const response = await this.request(params);
      return response;
    }




      // '/elections/'
  async getElections(): Promise<Response> {
    const params: AxiosRequestConfig = { url: '/elections', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async createElection(electionData: Election): Promise<Response> {
    const params: AxiosRequestConfig = {
      url: '/elections/',
      method: 'POST',
      data: electionData
    };
    const response = await this.request(params);
    return response;
  }

  // '/elections/${electionId}'
  async updateElection(query: {electionData: Election, electionId: string}): Promise<Response> {
    const params: AxiosRequestConfig = {
      url: `/elections/${query.electionId}`,
      method: 'PATCH',
      data: query.electionData
    };
    const response = await this.request(params);
    return response;
  }
  async deleteElection(electionId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/elections/${electionId}`, method: 'DELETE'};
    const response = await this.request(params);
    return response;
  }
  async getElection(electionId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/elections/${electionId}`, method: 'GET'};
    const response = await this.request(params);
    return response;
  }
  async updateputElection(query: {electionData: Election, electionId: string}): Promise<Response> {
    const params: AxiosRequestConfig = {
      url: `/elections/${query.electionId}`,
      method: 'PUT',
      data: query.electionData
    };
    const response = await this.request(params);
    return response;
  }




    // '/candidates/'
    async getCandidates(): Promise<Response> {
      const params: AxiosRequestConfig = { url: '/candidates', method: 'GET' };
      const response = await this.request(params);
      return response;
    }
    async createCandidate(candidateData: Candidate): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: '/candidates/',
        method: 'POST',
        data: candidateData
      };
      const response = await this.request(params);
      return response;
    }
    // '/candidates/${candidateId}'
    async updateCandidate(query:{candidateData: Candidate, candidateId: string}): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: `/candidates/${query.candidateId}`,
        method: 'PATCH',
        data: query.candidateData
      };
      const response = await this.request(params);
      return response;
    }
    async deleteCandidate(candidateId: string): Promise<Response> {
      const params: AxiosRequestConfig = { url: `/candidates/${candidateId}`, method: 'DELETE'};
      const response = await this.request(params);
      return response;
    }
    async getCandidate(candidateId: string): Promise<Response> {
      const params: AxiosRequestConfig = { url: `/candidates/${candidateId}`, method: 'GET'};
      const response = await this.request(params);
      return response;
    }
    async updateputCandidate(query:{candidateData: Candidate, candidateId: string}): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: `/candidates/${query.candidateId}/`,
        method: 'PUT',
        data: query.candidateData
      };
      const response = await this.request(params);
      return response;
    }




      // '/votes/'
    async getVotes(): Promise<Response> {
      const params: AxiosRequestConfig = { url: '/votes', method: 'GET' };
      const response = await this.request(params);
      return response;
    }
    async createVote(voteData: Vote): Promise<Response> {
      const params: AxiosRequestConfig = {
        url: '/votes/',
        method: 'POST',
        data: voteData
      };
      const response = await this.request(params);
      return response;
    }


  

  // '/users/'
  async getUsers(): Promise<Response> {
    const params: AxiosRequestConfig = { url: '/users', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async createUser(userData: createUser): Promise<Response> {
    const params: AxiosRequestConfig = {
      url: '/users/',
      method: 'POST',
      data: userData
    };
    const response = await this.request(params);
    return response;
  }
  // '/users/${userId}'
  async getUser(userId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/users/${userId}`, method: 'GET'};
    const response = await this.request(params);
    return response;
  }
  async deleteUser(userId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/user/${userId}`, method: 'DELETE'};
    const response = await this.request(params);
    return response;
  }
  async updateUser(query:{userData: createUser, userId: string}): Promise<Response> {
    const params: AxiosRequestConfig = {
      url: `/users/${query.userId}`,
      method: 'PATCH',
      data: query.userData
    };
    const response = await this.request(params);
    return response;
  }
  
  // '/me/'
  async getMe(): Promise<Response> {
    const params: AxiosRequestConfig = { url: '/me', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async deleteMe(): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/me`, method: 'DELETE' };
    const response = await this.request(params);
    return response;
  }
  async updateMe(userData: createUser): Promise<Response> {
    const params: AxiosRequestConfig = {
      url: '/me/',
      method: 'PATCH',
      data: userData
    };
    const response = await this.request(params);
    return response;
  }




  // '/university/'
  async getUniversities(): Promise<Response> {
    const params: AxiosRequestConfig = { url: '/university', method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  //input name is not part of the URL path. Instead, it is included in the request body as part of the data payload.
  async createUniversity(name: String): Promise<Response> {
    const data = { name };
    const params: AxiosRequestConfig = { url: '/university', method: 'POST', data };
    const response = await this.request(params);
    return response;
  }
  // '/university/${universityId}/'
  async getUniversity(universityId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/university/${universityId}`, method: 'GET' };
    const response = await this.request(params);
    return response;
  }
  async deleteUniversity(universityId: string): Promise<Response> {
    const params: AxiosRequestConfig = { url: `/university/${universityId}`, method: 'DELETE' };
    const response = await this.request(params);
    return response;
  }


  
}

const myApi = new MyApi()
export default myApi
