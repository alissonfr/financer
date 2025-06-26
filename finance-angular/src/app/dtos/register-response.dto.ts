import { User } from "../models/user";

export class RegisterResponse {
    token: string;
    user: User;
}