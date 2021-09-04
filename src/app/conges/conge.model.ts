export interface Conge{
  _id: string;
  idUnique: string;
  matricule: string;
  nomPrenom: string;
  emploi: string;
  affectation: string;
  travail: string;
  typeConge: string;
  dureeConge: number;
  dateDebut: Date;
  dateFin: Date;
  numTel: number;
  adresse: string;
  directionStatus: number;
  administrationStatus: number;
  direction: Direction[];
  email: string;
  congeDate: Date;
}

export class Direction{
  directId: String;
  directStatus: Number
}
