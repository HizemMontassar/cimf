import { nbJoursConge } from './../../Authentification/signup/employe.model';
import { Direction } from './../conge.model';
import { Employe } from './../../Authentification/login/employe.model';
import { Router } from '@angular/router';
import { CongeSerice } from './../conge.service';
import { AuthService } from './../../Authentification/auth.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, NgForm, Validator, Validators } from "@angular/forms";

@Component({
  selector: 'app-ajouter-conge',
  templateUrl: './ajouter-conge.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './ajouter-conge.component.css'
  ]
})
export class AjoutercongeComponent implements OnDestroy, OnInit{

  formAnnuel: FormGroup;
  formExceptionnel: FormGroup;
  formCompensation: FormGroup;
  formAutre: FormGroup;

  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private postsSub: Subscription;

  nbJoursAnnuel: number;
  nbJoursExceptionnel: number;
  nbJoursCompensation: number;
  directionTotal: Array<Direction> = [];

  constructor(private authService: AuthService, private congeService: CongeSerice, private router: Router){}



  ngOnInit(){


    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    for(let i=0; i<decodedJWT.direction.length; i++){

      this.directionTotal.push({
        directId: decodedJWT.direction[i],
        directStatus: 0
      });

    }
    this.congeService.getNbJour(decodedJWT.matricule).subscribe(result => {
      this.nbJoursAnnuel = result.nbJoursConge.annuel;
      this.nbJoursExceptionnel = result.nbJoursConge.exceptionnel;
      this.nbJoursCompensation = result.nbJoursConge.compensation;
    })

    this.formAnnuel = new FormGroup({
      'idUnique': new FormControl({value:decodedJWT.idUnique, disabled: true}, {validators: [Validators.required]}),
      'matricule': new FormControl({value: decodedJWT.matricule, disabled: true}, {validators: [Validators.required]}),
      'nomPrenom': new FormControl({value: decodedJWT.nomPrenom, disabled: true}, {validators: [Validators.required]}),
      'emploi': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'affectation': new FormControl({value: decodedJWT.affectation, disabled: true}, {validators: [Validators.required]}),
      'travail': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'dureeConge': new FormControl(null, {validators: [Validators.required, Validators.max(this.nbJoursAnnuel), Validators.min(1)]}),
      'dateDebut': new FormControl(null, {validators: [Validators.required]}),
      'dateFin': new FormControl(null, {validators: [Validators.required]}),
      'numTel': new FormControl(null, {validators: [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern("[0-9]{8}")]}),
      'adresse':new FormControl(null, {validators: [Validators.required]})
    });
    this.formExceptionnel = new FormGroup({
      'idUnique': new FormControl({value:decodedJWT.idUnique, disabled: true}, {validators: [Validators.required]}),
      'matricule': new FormControl({value: decodedJWT.matricule, disabled: true}, {validators: [Validators.required]}),
      'nomPrenom': new FormControl({value: decodedJWT.nomPrenom, disabled: true}, {validators: [Validators.required]}),
      'emploi': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'affectation': new FormControl({value: decodedJWT.affectation, disabled: true}, {validators: [Validators.required]}),
      'travail': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'dureeConge': new FormControl(null, {validators: [Validators.required, Validators.max(this.nbJoursExceptionnel), Validators.min(1)]}),
      'dateDebut': new FormControl(null, {validators: [Validators.required]}),
      'dateFin': new FormControl(null, {validators: [Validators.required]}),
      'numTel': new FormControl(null, {validators: [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern("[0-9]{8}")]}),
      'adresse':new FormControl(null, {validators: [Validators.required]})
    });

    this.formCompensation = new FormGroup({
      'idUnique': new FormControl({value:decodedJWT.idUnique, disabled: true}, {validators: [Validators.required]}),
      'matricule': new FormControl({value: decodedJWT.matricule, disabled: true}, {validators: [Validators.required]}),
      'nomPrenom': new FormControl({value: decodedJWT.nomPrenom, disabled: true}, {validators: [Validators.required]}),
      'emploi': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'affectation': new FormControl({value: decodedJWT.affectation, disabled: true}, {validators: [Validators.required]}),
      'travail': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'dureeConge': new FormControl(null, {validators: [Validators.required, Validators.max(this.nbJoursCompensation), Validators.min(1)]}),
      'dateDebut': new FormControl(null, {validators: [Validators.required]}),
      'dateFin': new FormControl(null, {validators: [Validators.required]}),
      'numTel': new FormControl(null, {validators: [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern("[0-9]{8}")]}),
      'adresse':new FormControl(null, {validators: [Validators.required]})
    });

    this.formAutre = new FormGroup({
      'idUnique': new FormControl({value:decodedJWT.idUnique, disabled: true}, {validators: [Validators.required]}),
      'matricule': new FormControl({value: decodedJWT.matricule, disabled: true}, {validators: [Validators.required]}),
      'nomPrenom': new FormControl({value: decodedJWT.nomPrenom, disabled: true}, {validators: [Validators.required]}),
      'emploi': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'affectation': new FormControl({value: decodedJWT.affectation, disabled: true}, {validators: [Validators.required]}),
      'travail': new FormControl({value: decodedJWT.emploi, disabled: true}, {validators: [Validators.required]}),
      'dureeConge': new FormControl(null, {validators: [Validators.required, Validators.max(this.nbJoursAnnuel), Validators.min(1)]}),
      'dateDebut': new FormControl(null, {validators: [Validators.required]}),
      'dateFin': new FormControl(null, {validators: [Validators.required]}),
      'numTel': new FormControl(null, {validators: [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern("[0-9]{8}")]}),
      'adresse':new FormControl(null, {validators: [Validators.required]})
    });
  }

  ngOnDestroy(){

  }

  onButtonClickAnnuel(){

    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.congeService.createConge(
      decodedJWT.idUnique,
      decodedJWT.matricule,
      decodedJWT.nomPrenom,
      decodedJWT.emploi,
      decodedJWT.affectation,
      decodedJWT.emploi,
      'سنوية',
      this.formAnnuel.value.dureeConge,
      this.formAnnuel.value.dateDebut,
      this.formAnnuel.value.dateFin,
      this.formAnnuel.value.numTel,
      this.formAnnuel.value.adresse,
      this.directionTotal,
      decodedJWT.email);

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });

  }

  onButtonClickExceptionnel(){
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.congeService.createConge(
      decodedJWT.idUnique,
      decodedJWT.matricule,
      decodedJWT.nomPrenom,
      decodedJWT.emploi,
      decodedJWT.affectation,
      decodedJWT.emploi,
      'إستثنائية',
      this.formExceptionnel.value.dureeConge,
      this.formExceptionnel.value.dateDebut,
      this.formExceptionnel.value.dateFin,
      this.formExceptionnel.value.numTel,
      this.formExceptionnel.value.adresse,
      this.directionTotal,
      decodedJWT.email);

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
  }

  onButtonClickCompensation(){
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.congeService.createConge(
      decodedJWT.idUnique,
      decodedJWT.matricule,
      decodedJWT.nomPrenom,
      decodedJWT.emploi,
      decodedJWT.affectation,
      decodedJWT.emploi,
      'تعويضية',
      this.formCompensation.value.dureeConge,
      this.formCompensation.value.dateDebut,
      this.formCompensation.value.dateFin,
      this.formCompensation.value.numTel,
      this.formCompensation.value.adresse,
      this.directionTotal,
      decodedJWT.email);

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
  }

  onButtonClickAutre(){
    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.congeService.createConge(
      decodedJWT.idUnique,
      decodedJWT.matricule,
      decodedJWT.nomPrenom,
      decodedJWT.emploi,
      decodedJWT.affectation,
      decodedJWT.emploi,
      'أخرى',
      this.formAutre.value.dureeConge,
      this.formAutre.value.dateDebut,
      this.formAutre.value.dateFin,
      this.formAutre.value.numTel,
      this.formAutre.value.adresse,
      this.directionTotal,
      decodedJWT.email);

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
  }

}
