import { GestionConges } from './conges/gestion-conges/gestion-conges.component';
import { DemandecongeComponent } from './conges/demande-conge/demande-conge.component';
import { AuthInterceptor } from './Authentification/auth-interceptor';
import { AjoutercongeComponent } from './conges/ajouter-conge/ajouter-conge.component';
import { ListCongesComponent } from './conges/list-conges/list-conges.component';
import { NavbarComponent } from './nav-bar/navbar.component';
import { SignupComponent } from './Authentification/signup/signup.component';
import { LoginComponent } from './Authentification/login/login.component';
import { JourcongeComponent } from './conges/jours-conge/jours-conge.component';
import { ListUtilisateursComponent } from './administration/liste-utilisateurs/liste-utilisateurs.component';
import { UpdateUtilisateurComponent } from './administration/update-utilisateur/update-utilisateur.component';
import { ListeAdministrateursComponent } from './administration/liste-administrateurs/liste-administrateurs.component';
import { AjouterAdministrationComponent } from './administration/ajouter-administration/ajouter-administration.component';
import { UpdateAdministrationComponent } from './administration/update-administration/update-administration.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    ListCongesComponent,
    AjoutercongeComponent,
    DemandecongeComponent,
    GestionConges,
    JourcongeComponent,
    ListUtilisateursComponent,
    UpdateUtilisateurComponent,
    ListeAdministrateursComponent,
    AjouterAdministrationComponent,
    UpdateAdministrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgbModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    FontAwesomeModule,
    MatIconModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
