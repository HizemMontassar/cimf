import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";


@Injectable()
export class DirectionGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>{
    const token = this.authService.getToken();
    const isAuth = this.authService.getIsAuth();
    if(token === ""){
      this.router.navigate(['/']);
    }
    else{
      const decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
      const role = decodedJWT.role;
      if(role === "employe"){
        this.router.navigate(['/']);
      }
    }
    return isAuth;
  }
}
