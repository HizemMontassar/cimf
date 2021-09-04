const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const congeSchema = mongoose.Schema({
  idUnique: {type: String, required: true},
  matricule: {type: String, required: true},
  nomPrenom: {type: String, required: true},
  emploi: {type: String, required: true},
  affectation: {type: String, required: true},
  travail: {type: String, required: true},
  typeConge: {type: String, required: true},
  dureeConge: {type: Number, required: true},
  dateDebut: {type: Date, required: true},
  dateFin: {type: Date, required: true},
  numTel: {type: Number, required: true},
  adresse: {type: String, required: true},
  directionStatus: {type: Number, default: 0},
  administrationStatus: {type: Number, default: 0},
  direction :
    [
      {
        directId: { type: String, required: true},
        directStatus: {type: Number, required: true}
      },

    ],
    email: {type: String, required: true},
    congeDate: {type: Date, required: true},

});

congeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Conge',congeSchema);
