import { User } from "../models/user";

export class LoginResponse {
    token: string;
    user: User;
}