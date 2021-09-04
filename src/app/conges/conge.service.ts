import { Conge, Direction } from './conge.model';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class CongeSerice{

  constructor(private http: HttpClient, private router: Router){}

  createConge(
    idUnique: string,
    matricule: string,
    nomPrenom: string,
    emploi: string,
    affectation: string,
    travail: string,
    typeConge: string,
    dureeConge: number,
    dateDebut: Date,
    dateFin: Date,
    numTel: number,
    adresse: string,
    direction: Direction[],
    email: string
    ){
      const conge: Conge = {
        _id: "",
        idUnique: idUnique,
        matricule: matricule,
        nomPrenom: nomPrenom,
        emploi: emploi,
        affectation: affectation,
        travail: travail,
        typeConge: typeConge,
        dureeConge: dureeConge,
        dateDebut: dateDebut,
        dateFin: dateFin,
        numTel: numTel,
        adresse: adresse,
        directionStatus: 0,
        administrationStatus: 0,
        direction: direction,
        email: email,
        congeDate: new Date()
      };
      console.log(conge);
      this.http.post('http://localhost:3000/api/conge/ajouter-conge', conge).subscribe(response => {
        this.router.navigate(['/']);
      });

  }

  afficherConges(matricule: string): Observable<any>{
    return this.http.get('http://localhost:3000/api/conge/'+matricule);
  }

  afficherCongesDirection(directionId: string): Observable<any>{
    return this.http.get('http://localhost:3000/api/conge/direction/'+directionId);
  }

  afficherCongesAdministration(): Observable<any>{
    return this.http.get('http://localhost:3000/api/administration/demandesConge/');
  }

  agreeDirection(congeId: string, uniqueId: string, employeEmail: string, nomPrenom: string){
    const data= {
      congeId : congeId,
      uniqueId: uniqueId,
      employeEmail: employeEmail,
      nomPrenom: nomPrenom
    }
    this.http.put('http://localhost:3000/api/direction/agree', data).subscribe(response => {
    });
  }

  agreeAdministration(congeId: string, employeEmail: string, nomPrenom: string, employeMatricule: string, employeTypeConge: string, employeDureeConge: number){
    const data = {
      congeId: congeId,
      employeEmail: employeEmail,
      nomPrenom:nomPrenom,
      employeMatricule: employeMatricule,
      employeTypeConge: employeTypeConge,
      employeDureeConge: employeDureeConge
    }
    this.http.put('http://localhost:3000/api/administration/agree', data).subscribe(response => {
    });
  }

  disagreeDirection(congeId: string,uniqueId: string, employeEmail: string, nomPrenom: string){
    const data= {
      congeId : congeId,
      uniqueId: uniqueId,
      employeEmail: employeEmail,
      nomPrenom: nomPrenom
    }
    this.http.put('http://localhost:3000/api/direction/disagree', data).subscribe(response => {
    });
  }

  disagreeAdiministration(congeId: string, employeEmail: string, nomPrenom: string){
    const data= {
      congeId : congeId,
      employeEmail: employeEmail,
      nomPrenom: nomPrenom
    }
    this.http.put('http://localhost:3000/api/administration/disagree', data).subscribe(response => {
    });
  }

  declarerConge(matricule: string, annee: number){
    const data = {
      matricule: matricule,
      annee: annee
    }
    this.http.put('http://localhost:3000/api/conge/direction/declarerConge', data).subscribe(response => {

    });
  }

  getNbJour(matricule: string): Observable<any>{
    return this.http.get('http://localhost:3000/api/conge/nbJours/'+matricule);
  }

}
