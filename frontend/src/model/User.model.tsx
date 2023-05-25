class LoginUser {
    email: string;
    password: string;
    

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

class Token {
    access: string;
    refresh: string;

    constructor() {
        this.access = '';
        this.refresh = '';
    }

    setToken(access: string, refresh: string) {
        this.access = access;
        this.refresh = refresh;
    }
}

class AuthedUser {
    email: string;
    token: Token;
    ID: string;
    is_staff: boolean;
    
    constructor() {
        this.email = "";
        this.token = new Token();
        this.ID = "";
        this.is_staff = false;
    }

    setUser(email: string, accessToken: string, refreshToken: string, isStaff: boolean, id: string) {
        this.email = email;
        this.ID = id;
        this.token.setToken(accessToken, refreshToken);
        this.is_staff = isStaff;
    }
}

const authedUser = new AuthedUser();

export { LoginUser, authedUser }