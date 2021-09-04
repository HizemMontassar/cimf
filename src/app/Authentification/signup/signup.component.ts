import { Router } from '@angular/router';
import { CongeSerice } from './../../conges/conge.service';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validator, Validators } from "@angular/forms";
import { ancienConges, nbJoursConge } from './employe.model';
import { AuthService } from './../auth.service';
import { Component, OnInit } from "@angular/core";
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    './signup.component.css',
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css'
  ]
})
export class SignupComponent implements OnInit{


  faTrash=faTrash;
  directionsFinal: string[] =[];

  constructor(private authService: AuthService, private congeService: CongeSerice, private router: Router,private formBuilder: FormBuilder){}

  formtest = this.formBuilder.group({
    idUnique: ['', {validators : [Validators.required, Validators.pattern("[0-9]{4}[a-zA-Z]{1}")]}],
    matricule: ['',{validators : [Validators.required, Validators.pattern("[a-zA-Z0-9]{10}")]}],
    nomPrenom: ['', Validators.required],
    emploi: ['', Validators.required],
    affectation: ['', Validators.required],
    adresse: ['', Validators.required],
    role: ['', Validators.required],
    password: ['', Validators.required],
    newAnnuel: ['', Validators.required],
    newExceptionnel: ['', Validators.required],
    newCompensation: ['', Validators.required],
    ancienConges: this.formBuilder.array([]),
    directions: this.formBuilder.array([])
  });

  get ancienConges() {
    return this.formtest.controls["ancienConges"] as FormArray;
  }

  get directions(){
    return this.formtest.controls["directions"] as FormArray;
  }

  addDirection(){
    const directionForm = this.formBuilder.group({
      direction: ['', Validators.required]
    });
    this.directions.push(directionForm);
    console.log(this.directions.value);
  }

  addAncienConge() {
    const ancienCongeForm = this.formBuilder.group({
      annee: ['', Validators.required],
      annuel: ['', Validators.required],
      exceptionnel: ['', Validators.required],
      compensation: ['', Validators.required],
    });

      this.ancienConges.push(ancienCongeForm);
      console.log(this.ancienConges.value);

  }

  deleteDirection(directionIndex: number){
    this.directions.removeAt(directionIndex);
    console.log(this.directions.value);
  }

  deleteAncienConge(ancienCongeIndex: number){
    this.ancienConges.removeAt(ancienCongeIndex);
    console.log(this.ancienConges.value);
  }

  ngOnInit(){

    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));

  }

  onSubmit(){

    if(!this.formtest){
      return;
    }
    else{

      for(let i=0; i<this.formtest.value.ancienConges.length; i++){
        if(this.formtest.value.ancienConges[i].annee === "" && this.formtest.value.ancienConges[i].exceptionnel === "" && this.formtest.value.ancienConges[i].compensation === ""){
          this.ancienConges.removeAt(i);
        }
      }

      for(let i=0; i<this.formtest.value.directions.length; i++){
        if(this.formtest.value.directions[i].direction === ""){
          this.directions.removeAt(i);
        }
        else{
              this.directionsFinal.push(this.formtest.value.directions[i].direction);
          }
        }
        this.authService.createEploye(
          this.formtest.value.idUnique,
          this.formtest.value.matricule,
          this.formtest.value.nomPrenom,
          this.formtest.value.emploi,
          this.formtest.value.affectation,
          this.formtest.value.password,
          this.directionsFinal,
          this.formtest.value.role,
          this.formtest.value.adresse,
          {
            annee: new Date().getFullYear(),
            mois: new Date().getMonth(),
            annuel: this.formtest.value.newAnnuel,
            exceptionnel: this.formtest.value.newExceptionnel,
            compensation: this.formtest.value.newCompensation
          },
          this.formtest.value.ancienConges

        )

    }

  }


}
