import { Router } from '@angular/router';
import { AuthService } from './../../Authentification/auth.service';
import { AdministrationService } from './../administration.service';
import { Administration } from './../administration.model';
import { Component,OnInit,ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-liste-administrateurs',
  templateUrl: './liste-administrateurs.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './liste-administrateurs.component.css'
  ]
})
export class ListeAdministrateursComponent implements OnInit{

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  admins: Administration[] = [];
  dataSource = new MatTableDataSource<Administration>();
  displayedColumns: string[] = ['idUnique','matricule','nomPrenom','action'];
  admint: Administration;
  popup: boolean=false;
  idUnique: string;

  faTrash = faTrash;
  faUserEdit = faUserEdit;

  constructor(private administrationService: AdministrationService,private authService: AuthService, private router: Router){}

  ngOnInit(){

    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.idUnique = decodedJWT.matricule;
    console.log(this.idUnique);

    this.administrationService.afficherAdministrations().subscribe(result => {
      this.admins = result;
      this.dataSource = new MatTableDataSource<Administration>(this.admins);
      this.dataSource.sort = this.sort;
    });
  }

  onClick(user: Administration){
    this.popup = true;
    this.admint = user;
  }

  deleteAdministrateur(_id: string){
    this.administrationService.deleteAdministrateur(_id);
    window.location.reload();
  }

  goTo(){
    const navigationDetails: string[] = ['/ajouter-administrateur'];
    this.router.navigate(navigationDetails);
  }
}
