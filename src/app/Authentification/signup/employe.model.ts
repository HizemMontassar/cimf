export interface Employe{
  idUnique: String;
  matricule: String;
  nomPrenom: String;
  emploi: String;
  affectation: String;
  password: String;
  direction: String[];
  role: string;
  email: String;
  nbJoursConge: nbJoursConge;
  ancienConges: ancienConges[];
}

export class ancienConges{
  annee: Number;
  annuel: Number;
  exceptionnel: Number;
  compensation: Number;
}

export class nbJoursConge{
  annee: Number;
  mois: Number;
  annuel: Number;
  exceptionnel: Number;
  compensation: Number;
}

export class direction{
  direction: String;
}
