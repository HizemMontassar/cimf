import { Employe, ancienConges, nbJoursConge } from './signup/employe.model';
import {EmployeLogin } from './login/employeLogin.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';


@Injectable({providedIn: 'root'})
export class AuthService{

  public isAuthenticated = false;
  public authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private token: string;
  public loginResponse: string;

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
 }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getLoginResponse(){
    return this.loginResponse;
  }

  changeResponse(response: string){
    this.loginResponse = response;
  }


  createEploye(idUnique: string, matricule: string, nomPrenom: string, emploi: string, affectation: string, password: string, direction: string[], role: string, email: string, nbJoursConge: nbJoursConge, ancienConges: ancienConges[]){
    const employe: Employe = {idUnique: idUnique, matricule: matricule, nomPrenom: nomPrenom, emploi: emploi, affectation: affectation, password: password, direction : direction, role : role, email : email, nbJoursConge : nbJoursConge, ancienConges : ancienConges};
    this.http.post('http://localhost:3000/api/employe/signup', employe).subscribe(response => {
    });
  }

  loginEmploye(matricule: string, password: string): Observable<any>{
    var config = {
      params : {
        matricule: matricule,
        password: password
      }
    }
    return this.http.get('http://localhost:3000/api/employe/login', config);
  }

  loginAdministration(matricule: string, password: string): Observable<any>{
    var config = {
      params: {
        matricule: matricule,
        password: password
      }
    }
    return this.http.get('http://localhost:3000/api/administration/loginAdministration', config);
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  public setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout(){
    this.token = "";
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  public saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
