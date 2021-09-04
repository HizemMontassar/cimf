import { ancienConges } from './../../Authentification/signup/employe.model';
import { Conge } from './../conge.model';
import { CongeSerice } from './../conge.service';
import { AuthService } from './../../Authentification/auth.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-list-conges',
  templateUrl: './list-conges.component.html',
  styleUrls: [
    '../../css/bootstrap.min.css',
    '../../css/icons.css',
    '../../css/style.css',
    './list-conges.component.css'
  ]
})
export class ListCongesComponent implements OnDestroy, OnInit  {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private postsSub: Subscription;
  conges: Conge[] = [];
  username: string = "";
  role: string = "";
  popup: boolean=false;
  conget: Conge;
  displayedColumns: string[] = ['typeConge','congeDate','dureeConge','administrationStatus','action'];
  dataSource = new MatTableDataSource<Conge>();

  constructor(private authService: AuthService, private congeService: CongeSerice){}

  ngOnInit(){

    let token = this.authService.getToken();
    let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
    this.username = decodedJWT.nomPrenom;
    this.congeService.afficherConges(decodedJWT.idUnique).subscribe(result => {
      this.conges = result;
      this.dataSource = new MatTableDataSource<Conge>(this.conges);
      this.dataSource.sort = this.sort;
    });

  }


  ngOnDestroy(){

  }

  onClick(conge: Conge){
    this.popup = true;
    this.conget = conge;
  }



}
