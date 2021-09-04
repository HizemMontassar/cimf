const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const administrationSchema = mongoose.Schema({
  idUnique: {type: String, required: true},
  matricule: {type: String, required: true},
  nomPrenom: {type: String, required: true},
  numTel: {type: Number, required: true},
  adresse: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, required: true}
});

administrationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Administration',administrationSchema);
