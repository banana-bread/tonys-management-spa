import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from '@tonys/shared';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService,
    private jwt: JwtService,
  ) { }

  async login(username: string, password: string): Promise<void> 
  {
    const response = await this.api.login({username, password});
    this.jwt.setToken(response.data);
  }

  async logout(): Promise<void>
  {
    await this.api.logout();
    this.jwt.removeToken();
  }


  // TODO: implement
  async register(name: string, email: string, password: string, phone?: string): Promise<any> 
  {
    // const response = await this.api.register({name, email, password, phone});
    // return response; 
  }

  isLoggedIn(): boolean
  {
    return this.jwt.hasToken() && this.jwt.hasValidToken();
  }
}