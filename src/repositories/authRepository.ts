import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type {
  LoginCredentials,
  User,
  UserRecord,
} from "../types/auth";


const SESSION_KEY = "app_session";


const users = initialUsers as UserRecord[];


export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const foundUser = users.find(
      (user) =>
        user.email === normalizedEmail &&
        user.password === credentials.password
    );


    if (!foundUser) {
      return null;
    }


    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };


    storageService.set<User>(SESSION_KEY, sessionUser);


    return sessionUser;
  },


  logout(): void {
    storageService.remove(SESSION_KEY);
  },


  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },


  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
