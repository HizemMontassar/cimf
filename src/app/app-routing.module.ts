import { AjouterAdministrationComponent } from './administration/ajouter-administration/ajouter-administration.component';
import { ListeAdministrateursComponent } from './administration/liste-administrateurs/liste-administrateurs.component';
import { ListUtilisateursComponent } from './administration/liste-utilisateurs/liste-utilisateurs.component';
import { JourcongeComponent } from './conges/jours-conge/jours-conge.component';
import { GestionConges } from './conges/gestion-conges/gestion-conges.component';
import { DemandecongeComponent } from './conges/demande-conge/demande-conge.component';

import { AjoutercongeComponent } from './conges/ajouter-conge/ajouter-conge.component';
import { ListCongesComponent } from './conges/list-conges/list-conges.component';
import { AppComponent } from './app.component';
import { SignupComponent } from './Authentification/signup/signup.component';
import { LoginComponent } from './Authentification/login/login.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DirectionGuard } from './Authentification/direction.guard';
import { AuthGuard } from './Authentification/auth.guard';
import { AdministrationGuard } from './Authentification/administration.guard';



const routes: Routes = [

  {
    path: '',
    component: ListCongesComponent,
    canActivate: [AuthGuard, AdministrationGuard]
  },
  {
    path: 'login',
    component: LoginComponent
    },
  {
    path: 'ajouter-utilisateur',
    component: SignupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ajouter-administrateur',
    component: AjouterAdministrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ajouter-conge',
    component: AjoutercongeComponent,
    canActivate: [AuthGuard, AdministrationGuard]
  },
  {
    path: 'gestion-conges',
    component: GestionConges,
    canActivate: [AuthGuard, DirectionGuard]
  },
  {
    path: 'demande-conge',
    component: DemandecongeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jours-conge',
    component: JourcongeComponent,
    canActivate: [AuthGuard, AdministrationGuard]
  },
  {
    path: 'utilisateurs',
    component: ListUtilisateursComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administrateurs',
    component: ListeAdministrateursComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, DirectionGuard, AdministrationGuard]
})
export class AppRoutingModule { }
