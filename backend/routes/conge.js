const express = require('express');
const Conge = require('../models/conge');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employe = require('../models/employe');
const nodeMailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

const router = express.Router();

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: '587',
  auth: {
    user: 'luisvillala8@gmail.com',
    pass: 'Monta404'
  },
});
/*const transporter = nodeMailer.createTransport({
  host: 'mail.finances.gov.tn',
  port: '587',
  auth: {
    user: '@finances.gov.tn',
    pass: ''
  },
});*/

transporter.verify().then(console.log).catch(console.error);


router.post('/ajouter-conge', (req, res, next)=> {
  const conge = new Conge({
    idUnique: req.body.idUnique,
    matricule: req.body.matricule,
    nomPrenom: req.body.nomPrenom,
    emploi: req.body.emploi,
    affectation: req.body.affectation,
    travail: req.body.travail,
    typeConge: req.body.typeConge,
    dureeConge: req.body.dureeConge,
    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin,
    numTel: req.body.numTel,
    adresse: req.body.adresse,
    direction: req.body.direction,
    email: req.body.email,
    congeDate: new Date()
  });

  for(let i=0; i<req.body.direction.length; i++){
    Employe.findOne({"idUnique":req.body.direction[i].directId}).then(employe => {
      if(!employe){
        return next(new Error('could not load document'));
      }
      else{

        readHTMLFile('src/app/lettres/envoyerDemande.html', function(err, html){
          var template = handlebars.compile(html);
          var replacements = {
            username: req.body.nomPrenom
          };

          var htmlToSend = template(replacements);
          var mailOptions = {
            from: '"CIMF"<luisvillala8@gmail.com>',
            to: employe.email,
            subject: 'مطلب عطلة',
            html: htmlToSend,
            attachments: [{
              filename: 'logo.png',
              path: './src/assets/images/logo.png',
              cid: 'uniqe@logo'
            },
            {
              filename: 'success.png',
              path: './src/assets/images/success.png',
              cid: 'uniqe@success'
            }
          ]
          };

          transporter.sendMail(mailOptions, function(error, response){
            if(error){
              console.log(error);
            }
          })

        });

      }
    });
  }

  conge.save().then(result => {
    res.status(200).json({
      message: 'Conge created',
      result: result
    });
  }).catch(err => {
    res.status(500).json({
      error: err
    });
  });;
});

router.get('/:matricule', (req, res, next)=> {

  const matricule= req.params.matricule;
  Conge.find({"idUnique": matricule}).sort({"congeDate":-1}).then(conges => {
    if(conges){
      res.status(200).json(conges);
    }
    else{
      res.status(404).json({message: 'Conges not found!'})
    }
  });
});

router.get('/direction/:direction', (req, res, next)=> {

  const direction= req.params.direction;
  Conge.find({"direction.directId": direction}).sort({"congeDate":-1}).then(conges => {
    if(conges){
      res.status(200).json(conges);
    }
    else{
      res.status(404).json({message: 'Conges not found!'})
    }
  });

});

router.get('/nbJours/:matricule', (req, res, next)=> {
  const matricule = req.params.matricule;

  Employe.findOne({"matricule": matricule}).then(employe => {
    console.log(employe);
    if(employe){
      res.status(200).json(employe);
    }
    else{
      res.status(404).json({message: 'Employe not found!'})
    }
  })
});

router.put('/direction/declarerConge', (req, res, next)=> {
  const matricule = req.body.matricule;
  const annee = req.body.annee;

  Employe.findOne({"matricule": matricule}).then(employe => {
    if(!employe){
      return next(new Error('could not load document'));
    }
    else{
      for(let i=0; i<employe.ancienConges.length; i++){
        if(employe.ancienConges[i].annee == annee){

          employe.nbJoursConge = employe.ancienConges[i].nbJour + employe.nbJoursConge;
          employe.ancienConges[i].declare = 1;
          employe.ancienConges[i].nbJour = 0;
          employe.save().then(result => {
            res.status(200).json({
              message: 'employe updated',
              result: result
            }).catch(err => {
              res.status(500).json({
                error: err
              });
            });

          })
        }
      }
    }


  });
})


module.exports = router;
