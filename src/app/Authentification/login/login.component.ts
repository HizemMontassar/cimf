import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from "@angular/core";
import { FormsModule,NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
  ]
})
export class LoginComponent implements OnInit{

  authenticated: boolean = true;
  private token: string;
  successEmp: boolean;
  successAdmin: boolean;

  constructor(public authService: AuthService, private router: Router){}

  ngOnInit(){
    if(!this.authService.getIsAuth()){
      this.router.navigate(['/']);
    }
  }

  onLoginEmploye(form: NgForm){
    if(form.invalid){
      return;
    }
    this.authService.loginEmploye(form.value.matricule, form.value.password).subscribe({
      next : response => {
        this.successEmp = true;
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.authService.setAuthTimer(expiresInDuration);
          this.authService.isAuthenticated = true;
          this.authService.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.authService.saveAuthData(token, expirationDate)
          this.router.navigate(['/']);
        }
      },
      error: error => {
        this.successEmp = false;
        console.log(error.error.message);
      }
    });
    this.authenticated = this.authService.getIsAuth();

  }



  onLoginAdministration(form: NgForm){

    console.log(form.value.matricule);
    console.log(form.value.password);

    if(form.invalid){
      return;
    }
    this.authService.loginAdministration(form.value.matricule, form.value.password).subscribe({
      next : response => {
        this.successAdmin = true;
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.authService.setAuthTimer(expiresInDuration);
          this.authService.isAuthenticated = true;
          this.authService.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.authService.saveAuthData(token, expirationDate)
          this.router.navigate(['/']);
        }
      },
      error: error => {
        this.successAdmin = false;
      }
    })
  }

}
