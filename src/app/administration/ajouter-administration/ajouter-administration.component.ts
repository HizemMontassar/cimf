import { AdministrationService } from './../administration.service';
import { AdministrationGuard } from './../../Authentification/administration.guard';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CongeSerice } from './../../conges/conge.service';
import { AuthService } from './../../Authentification/auth.service';
import { Component,OnInit } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ajouter-administration',
  templateUrl: './ajouter-administration.component.html',
  styleUrls: [
    './ajouter-administration.component.css',
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css'
  ]
})
export class AjouterAdministrationComponent implements OnInit{

  faTrash=faTrash;

  constructor(private administrationService: AdministrationService, private router: Router,private formBuilder: FormBuilder){}

  formtest = this.formBuilder.group({
    idUnique: ['', {validators : [Validators.required, Validators.pattern("[0-9]{4}[a-zA-Z]{1}")]}],
    matricule: ['',{validators : [Validators.required, Validators.pattern("[a-zA-Z0-9]{10}")]}],
    nomPrenom: ['', Validators.required],
    adresse: ['', Validators.required],
    role: ['administration', Validators.required],
    password: ['', Validators.required],
    email: ['', {validators: [Validators.required, Validators.email]}],
    numTel: ['', Validators.required]
  });

  ngOnInit(){

  }

  onSubmit(){
    if(!this.formtest){
      return;
    }
    else{
      this.administrationService.ajouterAdministrateur(
        this.formtest.value.idUnique,
        this.formtest.value.matricule,
        this.formtest.value.nomPrenom,
        this.formtest.value.numTel,
        this.formtest.value.adresse,
        this.formtest.value.email,
        this.formtest.value.password,
        this.formtest.value.role
      );
      this.router.navigate(['/administrateurs']).then(() => {
        window.location.reload();
      });
    }
  }

}
