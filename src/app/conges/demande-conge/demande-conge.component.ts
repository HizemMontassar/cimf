import { AuthService } from './../../Authentification/auth.service';
import { Conge, Direction } from './../conge.model';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';




@Component({
  selector: 'app-demande-conge',
  templateUrl: './demande-conge.component.html',
  styleUrls: [
    './demande-conge.component.css'
  ]
})
export class DemandecongeComponent implements OnInit{

  @Input()
  conge: Conge;

  @ViewChild('testpdf') testpdf:ElementRef;


  constructor(private authService: AuthService){}

  ngOnInit(){
  }

  public SavePDF(): void {

    let DATA = document.getElementById('testpdf') as HTMLCanvasElement;

    html2canvas(DATA, {logging: true, width:DATA.scrollWidth, height:DATA.scrollHeight}).then(canvas => {

    let fileWidth = 208;
    let fileHeight = canvas.height * fileWidth / canvas.width;

    const FILEURI = canvas.toDataURL('image/png')
    let PDF = new jsPDF();
    let position = 0;
    PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

    PDF.save('angular-demo.pdf');
});

  }

}
