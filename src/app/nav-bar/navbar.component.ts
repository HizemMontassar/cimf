import { AuthService } from './../Authentification/auth.service';
import { Component, OnInit,OnDestroy } from "@angular/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    '../css/bootstrap.min.css',
    '../css/icons.css',
    '../css/style.css',
    './navbar.component.css'
  ]
})
export class NavbarComponent implements OnInit, OnDestroy{

  username: string = "";
  role: string = "";

  constructor(private authService: AuthService){}

  ngOnInit(){
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.username = decodedJWT.nomPrenom;
    this.role = decodedJWT.role;
  }

  ngOnDestroy(){

  }

  logout(){
    this.authService.logout();
  }

}
