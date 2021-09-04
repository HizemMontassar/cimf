const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const typeEmail = require('mongoose-type-email')

const employeSchema = mongoose.Schema({
  idUnique: {type: String, required: true, unique: true},
  matricule: {type: String, required: true, unique: true},
  nomPrenom: {type: String, required: true},
  emploi: {type: String, required: true},
  affectation: {type: String, required: true},
  password: {type: String, required: true},
  direction : [{
    type: String,
    required: true
  }],
  role: {type: String, required: true},
  email: {type: String, require: true},
  ancienConges:
    [
      {
        _id: false,
        annee: {type: Number, required: true},
        annuel: {type: Number, required: true},
        exceptionnel: {type: Number, required: true},
        compensation: {type: Number, required: true}
      }
    ],
    nbJoursConge: {
      _id: false,
      annee: {type: Number, required: true},
      mois: {type: Number, required: true},
      annuel: {type: Number, required: true},
      exceptionnel: {type: Number, required: true},
      compensation: {type: Number, required: true}
    }
});

employeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Employe',employeSchema);
