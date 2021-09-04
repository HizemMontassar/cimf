import { formatDate } from '@angular/common';
import { Employe } from './../../Authentification/login/employe.model';
import { Router } from '@angular/router';
import { CongeSerice } from './../conge.service';
import { AuthService } from './../../Authentification/auth.service';
import { ancienConges, nbJoursConge } from './../../Authentification/signup/employe.model';
import { Component,OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'app-jours-conge',
  templateUrl: './jours-conge.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './jours-conge.component.css'
  ]
})
export class JourcongeComponent implements OnDestroy, OnInit{

  annuel: number;
  exceptionnel: number;
  compensation: number;
  ancienConges: any[];
  annee: number = new Date().getFullYear();
  disabledTables: number[] = [];
  rzlt: boolean = false;
  maxJours: number = 5;
  minDate: string;
  maxDate: string;

  constructor(private authService: AuthService, private congeSerice: CongeSerice, private router: Router){}

  ngOnInit(){
    this.minDate = formatDate(new Date(), 'yyyy-MM-dd','en-US');
    this.maxDate = formatDate(new Date(), 'yyyy-MM-dd','en-US');
    let token = this.authService.getToken();
    let decodedJWT = JSON.  parse(window.atob(token.split('.')[1]));

    this.congeSerice.getNbJour(decodedJWT.matricule).subscribe(result => {
      this.ancienConges = result.ancienConges;
      this.annuel = result.nbJoursConge.annuel;
      this.exceptionnel = result.nbJoursConge.exceptionnel;
      this.compensation = result.nbJoursConge.compensation;
    })
  }

  ngOnDestroy(){

  }

  declarerJoursConges(annee: number, i: number, nbJours: number){
    this.annuel += nbJours;
    this.disabledTables.push(i);
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.congeSerice.declarerConge(decodedJWT.matricule, annee);
    console.log("matricule: "+decodedJWT.matricule);
    console.log("annee: "+annee);
  }

  changeMaxDate(){

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
