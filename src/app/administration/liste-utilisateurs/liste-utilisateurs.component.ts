import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdministrationService } from './../administration.service';
import { Employe } from './../../Authentification/signup/employe.model';
import { Component, OnInit, ViewChild } from "@angular/core";
import { faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-liste-utilisateurs',
  templateUrl: './liste-utilisateurs.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './liste-utilisateurs.component.css'
  ]
})
export class ListUtilisateursComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  faTrash = faTrash;
  faUserEdit = faUserEdit;
  users: Employe[] = [];
  displayedColumns: string[] = ['idUnique','matricule','nomPrenom','role','action'];
  dataSource = new MatTableDataSource<Employe>();

  popup: boolean=false;
  usert: Employe;

  currentIndex:number = 0;

  constructor(private administrationService: AdministrationService, private router: Router){}


  ngOnInit(){

    this.administrationService.afficherUsers().subscribe(result => {
      this.users = result;
      this.dataSource = new MatTableDataSource<Employe>(this.users);
      this.dataSource.sort = this.sort;
    });

  }

  onClick(user: Employe){
    this.popup = true;
    this.usert = user;
  }

  deleteEmploye(_id: string){
    this.administrationService.deleteEmploye(_id);
    window.location.reload();
  }
  goTo(){
    const navigationDetails: string[] = ['/ajouter-utilisateur'];
    this.router.navigate(navigationDetails);
  }

}
