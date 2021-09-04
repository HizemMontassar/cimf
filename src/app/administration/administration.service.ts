import { Administration } from './administration.model';
import { nbJoursConge, ancienConges, Employe } from './../Authentification/signup/employe.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class AdministrationService{

  constructor(private http: HttpClient, private router: Router){}

  afficherUsers(): Observable<any>{
    return this.http.get('http://localhost:3000/api/administration/utilisateurs');
  }

  afficherAdministrations(): Observable<any>{
    return this.http.get('http://localhost:3000/api/administration/administrateurs');
  }

  updateUsers(idUnique: String, matricule: String, nomPrenom: string, emploi: string, affectation: string, password: string, direction: string[], role: string, email: string, nbJoursConge: nbJoursConge, ancienConges: ancienConges[]){
    const employe: Employe = {idUnique: idUnique, matricule: matricule, nomPrenom: nomPrenom, emploi: emploi, affectation: affectation, password: password, direction : direction, role : role, email : email, nbJoursConge : nbJoursConge, ancienConges : ancienConges};
    this.http.put('http://localhost:3000/api/administration/updateEmploye', employe).subscribe(response => {
    });
  }

  updateAdministrateur(idUnique: String, matricule: String, nomPrenom: String, adresse: string, role: string, password: string, email: string, numTel: number){
    const admin: Administration = {idUnique, matricule, nomPrenom, adresse, role, password, email, numTel}
    this.http.put('http://localhost:3000/api/administration/updateAdministrateur',admin).subscribe(response => {
    });
  }

  deleteEmploye(_id: String){
    this.http.delete('http://localhost:3000/api/administration/deleteEmploye/'+_id).subscribe(response => {
    });
  }

  deleteAdministrateur(_id: string){
    this.http.delete('http://localhost:3000/api/administration/deleteAdministrateur/'+_id).subscribe(response => {
    });
  }

  ajouterAdministrateur(idUnique: string, matricule: string, nomPrenom: string,numTel: number, adresse: string, email: string, password: string, role: string ){
    const admin: Administration ={
      idUnique: idUnique,
      matricule: matricule,
      nomPrenom: nomPrenom,
      numTel: numTel,
      adresse: adresse,
      email: email,
      password: password,
      role: role
    }
    this.http.post('http://localhost:3000/api/administration/signupAdministration', admin).subscribe(response => {
    });
  }

}
