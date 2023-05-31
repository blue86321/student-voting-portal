import { LoginResponse, Token, University } from "./Interfaces/User";
import myApi, { TOKEN } from "../service/MyApi";
import Logger from "../component/utils/Logger";

class CurrentUser implements LoginResponse {
  id: number;
  email: string;
  dob: string;
  staff: boolean;
  superuser: boolean;
  token: Token;
  university: University;

  constructor() {
    Logger.debug("[UserModel] create new user");
    this.id = 0;
    this.email = "";
    this.dob = "";
    this.staff = false;
    this.superuser = false;
    this.token = {
      access: '',
      refresh: '',
    }
    this.university = {
      id: 1,
      name: '',
    }
  }

  setUser(user: LoginResponse) {
    Logger.debug("[UserModel] setUser");
    this.id = user.id;
    this.email = user.email;
    this.dob = user.dob;
    this.staff = user.staff;
    this.superuser = user.superuser;
    this.token = user.token;
    this.university = user.university;
  }

  async refreshUserIfNeeded() {
    let token = localStorage.getItem(TOKEN);
    if (this.email !== "") {
      Logger.debug("[UserModel] no need to refresh user (email: " + this.email);
      return;
    }
    if (token) {
      Logger.debug("[UserModel] token available: ", token, ", refresh user");
      const result = await myApi.getMe();
      if (result.success) {
        Logger.debug("[UserModel] user refresh success");
        this.setUser(result.data as LoginResponse);
      } else {
        Logger.debug("[UserModel] user fresh failed: ", result.msg);
      }
    } else {
      Logger.debug("[UserModel] token unavailable");
      return;
    }
  }

  async getUser(): Promise<CurrentUser> {
    await this.refreshUserIfNeeded();
    return currentUser;
  }

  get isAdmin(): boolean {
    return this.staff || this.superuser;
  }

  isLoggedIn(): boolean {
    return this.email !== "";
  }

  removeUser() {
    Logger.debug("[UserModel] removeUser");
    this.id = 0;
    this.email = "";
    this.dob = "";
    this.staff = false;
    this.superuser = false;
    this.token = {
      access: '',
      refresh: '',
    }
    this.university = {
      id: 1,
      name: '',
    }
    localStorage.removeItem(TOKEN);
  }
}

const currentUser = new CurrentUser();

export { currentUser, CurrentUser };
