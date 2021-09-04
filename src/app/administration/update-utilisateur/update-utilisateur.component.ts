import { AdministrationService } from './../administration.service';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Employe, ancienConges, direction } from './../../Authentification/signup/employe.model';
import { Component,Input,OnInit } from "@angular/core";
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-update-utilisateur',
  templateUrl: './update-utilisateur.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './update-utilisateur.component.css'
  ]
})
export class UpdateUtilisateurComponent implements OnInit{



  @Input()
  user : Employe;

  faTrash=faTrash;
  directionFormTest: direction[] = [];
  directionsFinal: string[] =[];

  constructor(private formBuilder: FormBuilder, private administrationService: AdministrationService){}

  formtest = this.formBuilder.group({
    idUnique: [{value:'',disabled: true}, Validators.required],
    matricule: [{value:'',disabled: true}, Validators.required],
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


  ngOnInit(){


    this.formtest.patchValue({
      idUnique: this.user.idUnique,
      matricule: this.user.matricule,
      nomPrenom: this.user.nomPrenom,
      emploi: this.user.emploi,
      affectation: this.user.affectation,
      adresse: this.user.email,
      role: this.user.role,
      password: '',
      newAnnuel: this.user.nbJoursConge.annuel,
      newExceptionnel: this.user.nbJoursConge.exceptionnel,
      newCompensation: this.user.nbJoursConge.compensation,
    })

    const ancienCongess = this.user.ancienConges.map(ancienConge => this.formBuilder.group(ancienConge));
    const ancienCongesArray = this.formBuilder.array(ancienCongess);
    this.formtest.setControl('ancienConges', ancienCongesArray);

    this.user.direction.forEach(direction => {
      this.directionFormTest.push({
        direction: direction
      });
    });

    const directionss = this.directionFormTest.map(direction => this.formBuilder.group(direction));
    const directionsArray = this.formBuilder.array(directionss);
    this.formtest.setControl('directions', directionsArray);

  }

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
  }

  addAncienConge() {
    const ancienCongeForm = this.formBuilder.group({
      annee: ['', Validators.required],
      annuel: ['', Validators.required],
      exceptionnel: ['', Validators.required],
      compensation: ['', Validators.required],
    });

      this.ancienConges.push(ancienCongeForm);

  }

  deleteDirection(directionIndex: number){
    this.directions.removeAt(directionIndex);
  }

  deleteAncienConge(ancienCongeIndex: number){
    this.ancienConges.removeAt(ancienCongeIndex);
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
        this.administrationService.updateUsers(
          this.user.idUnique,
          this.user.matricule,
          this.formtest.value.nomPrenom,
          this.formtest.value.emploi,
          this.formtest.value.affectation,
          this.formtest.value.password,
          this.directionsFinal,
          this.formtest.value.role,
          this.formtest.value.adresse,
          {
            annee: this.user.nbJoursConge.annee,
            mois: this.user.nbJoursConge.mois,
            annuel: this.formtest.value.newAnnuel,
            exceptionnel: this.formtest.value.newExceptionnel,
            compensation: this.formtest.value.newCompensation
          },
          this.formtest.value.ancienConges
        )
        window.location.reload()

    }

  }

}
