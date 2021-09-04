import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Conge } from './../conge.model';
import { CongeSerice } from './../conge.service';
import { AuthService } from './../../Authentification/auth.service';
import { Component, NgIterable, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'app-gestion-conges',
  templateUrl: './gestion-conges.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './gestion-conges.component.css'
  ]
})
export class GestionConges implements OnDestroy, OnInit{

  conges: Conge[] = [];
  clicked: any;
  matricule: string = "";
  popup: boolean=false;
  conget: Conge;
  count: number = 0;
  disabledTables: number[] = [];
  rzlt: boolean = false;
  role: string = "";
  displayedColumns: string[] = ['nomPrenom','matricule','typeConge','afficherConge','action'];


  constructor(private authService: AuthService, private congeService: CongeSerice, private router: Router){}

  ngOnInit(){

    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.matricule = decodedJWT.idUnique;
    console.log(this.matricule);
    this.role = decodedJWT.role;
    console.log(this.role);
    if(this.role === "administration"){
      this.congeService.afficherCongesAdministration().subscribe(result => {
        this.conges = result;
        for(let key of Object.keys(result)){
          this.count++
        }
      });
    }
    else{
      this.congeService.afficherCongesDirection(this.matricule).subscribe(result => {
        this.conges = result;
        for(let key of Object.keys(result)){
          this.count++
        }
      });
    }

  }

  ngOnDestroy(){

  }

  agreeDirectionButton(congeId: string, employeEmail: string, i: number){
    this.disabledTables.push(i);
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    let uniqueId= decodedJWT.idUnique;
    let nomPrenom= decodedJWT.nomPrenom;
    this.congeService.agreeDirection(congeId, uniqueId, employeEmail, nomPrenom);

  }

  agreeAdministrationButton(congeId: string, employeEmail: string, i: number, employeMatricule: string, employeTypeConge: string, employeDureeConge: number){
    this.disabledTables.push(i);
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    let nomPrenom= decodedJWT.nomPrenom;
    this.congeService.agreeAdministration(congeId, employeEmail, nomPrenom, employeMatricule, employeTypeConge, employeDureeConge);
  }


  disagreeDirectionButton(congeId: string, employeEmail: string, i: number){
    this.disabledTables.push(i);
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    let uniqueId= decodedJWT.idUnique;
    let nomPrenom= decodedJWT.nomPrenom;
    this.congeService.disagreeDirection(congeId, uniqueId, employeEmail, nomPrenom);
  }

  disagreeAdministrationButton(congeId: string, employeEmail: string, i: number){
    this.disabledTables.push(i);
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    let nomPrenom= decodedJWT.nomPrenom;
    this.congeService.disagreeAdiministration(congeId, employeEmail, nomPrenom);
  }

  onClick(conge: Conge){
    this.popup = true;
    this.conget = conge;
  }

  checkTable(i: number){
    for(let x=0; x<this.disabledTables.length; x++){
      if(this.disabledTables[x] === i){
        this.rzlt = true;
        return true;
      }
    }
    this.rzlt = false;
    return false;
  }

}
