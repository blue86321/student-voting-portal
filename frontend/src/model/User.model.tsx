import User from "../Interfaces/User";
import myApi from "../service/MyApi";

class CurrentUser implements User {
  id: number;
  email: string;
  dob: string;
  staff: boolean;
  superuser: boolean;

  constructor() {
    console.log("[User Model] create new user");
    this.id = 0;
    this.email = "";
    this.dob = "";
    this.staff = false;
    this.superuser = false;
  }

  setUser(user: User) {
    console.log("[UserModel] setUser");
    this.id = user.id;
    this.email = user.email;
    this.dob = user.dob;
    this.staff = user.staff;
    this.superuser = user.superuser;
  }

  async refreshUserIfNeeded() {
    let token = localStorage.getItem("token");
    if (this.email !== "") {
      console.log("[UserModel] no need to refresh user (email: " + this.email);
      return;
    }
    if (token) {
      console.log("[UserModel] token available: ", token, ", refresh user");
      const result = await myApi.getMe();
      if (result.success) {
        console.log("[UserModel] user refresh success");
        this.setUser(result.data as User);
      } else {
        console.log("[UserModel] user fresh failed: ", result.msg);
      }
    } else {
      console.log("[UserModel] token unavailable");
      return;
    }
  }

  async getUser(): Promise<CurrentUser> {
    await this.refreshUserIfNeeded();
    return currentUser;
  }

  isLoggedIn(): boolean {
    return this.email !== "";
  }

  removeUser() {
    console.log("[User Model] removeUser");
    this.id = 0;
    this.email = "";
    this.dob = "";
    this.staff = false;
    this.superuser = false;
    localStorage.removeItem("token");
  }
}

console.log("test create user");
const currentUser = new CurrentUser();

export { currentUser, CurrentUser };
