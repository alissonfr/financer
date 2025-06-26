import { inject, Injectable } from "@angular/core";
import { GlobalLoadingService } from "@services/global-loading.service";
import { HttpService } from "@services/http.service";
import { finalize, Observable, tap } from "rxjs";
import { LoginResponse } from "src/app/dtos/login-response.dto";
import { RegisterResponse } from "src/app/dtos/register-response.dto";
import { User } from "src/app/models/user";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly PATH = `${environment.API_URL}v1/auth`;
    private http = inject(HttpService);
    private globalLoadingService = inject(GlobalLoadingService);

    constructor() {
        setInterval(() => {
            const token = localStorage.getItem("token");
            if (token && this.isTokenExpired(token)) {
                this.logout();
                window.location.reload();
            }
        }, 5000);
    }

    register(data: User): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.PATH}/register`, data);
    }

    login(data: { email: string, password: string }): Observable<LoginResponse> {
        this.globalLoadingService.start();
        return this.http.post<LoginResponse>(`${this.PATH}/login`, data)
            .pipe(
                tap((result) => {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("user", JSON.stringify(result.user));
                }),
                finalize(() => this.globalLoadingService.end())
            );
    }

    logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem("user") && !!localStorage.getItem("token");
    }

    private isTokenExpired(token: string): boolean {
        const expireIn = (JSON.parse(atob(token.split(".")[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expireIn;
    }
}