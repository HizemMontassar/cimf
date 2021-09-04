import { Validators } from '@angular/forms';
import { AdministrationService } from './../administration.service';
import { FormBuilder } from '@angular/forms';
import { Administration } from './../administration.model';
import { Component,OnInit,Input } from "@angular/core";
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-update-administration',
  templateUrl: './update-administration.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './update-administration.component.css'
  ]
})
export class UpdateAdministrationComponent implements OnInit{

  @Input()
  admin : Administration;

  faTrash=faTrash;

  constructor(private formBuilder: FormBuilder, private administrationService: AdministrationService){}

  formtest = this.formBuilder.group({
    idUnique: [{value:'',disabled: true}, {validators : [Validators.required, Validators.pattern("[0-9]{1}[a-zA-Z]{4}")]}],
    matricule: [{value:'',disabled: true},{validators : [Validators.required, Validators.pattern("[a-zA-Z0-9]{10}")]}],
    nomPrenom: ['', Validators.required],
    adresse: ['', Validators.required],
    role: ['administration', Validators.required],
    password: ['', Validators.required],
    email: ['', {validators: [Validators.required, Validators.email]}],
    numTel: ['', Validators.required]
  });

  ngOnInit(){

    this.formtest.patchValue({
      idUnique: this.admin.idUnique,
      matricule: this.admin.matricule,
      nomPrenom: this.admin.nomPrenom,
      adresse: this.admin.adresse,
      role: this.admin.role,
      password: '',
      email: this.admin.email,
      numTel: this.admin.numTel
    });

  }

  onSubmit(){
    if(!this.formtest){
      return;
    }
    else{
      this.administrationService.updateAdministrateur(
        this.admin.idUnique,
        this.admin.matricule,
        this.formtest.value.nomPrenom,
        this.formtest.value.adresse,
        "administration",
        this.formtest.value.password,
        this.formtest.value.email,
        this.formtest.value.numTel
      );
      window.location.reload()
    }
  }

}
