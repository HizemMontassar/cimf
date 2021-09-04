const express = require('express');
const Administration = require('../models/administration');
const Conge = require('../models/conge');
const Employe = require('../models/employe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { forEachTrailingCommentRange } = require('typescript');
const nodeMailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

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

transporter.verify().then(console.log).catch(console.error);

const router = express.Router();

router.get('/loginAdministration', (req, res, next) => {
  const matricule = req.query.matricule;
  const password = req.query.password;

  Administration.findOne({"idUnique": matricule}).then(administration => {
    if(!administration){
      return next(new Error('could not load administration'));
    }
    else{
      fetchedAdministration = administration;
      return bcrypt.compare(password, administration.password);
    }
  }).then(result => {
    if(!result){
      return next(new Error('Passowrd Invalid'));
    }
    else{
      const token = jwt.sign({
        idUnique: fetchedAdministration.idUnique,
        matricule: fetchedAdministration.matricule,
        nomPrenom: fetchedAdministration.nomPrenom,
        email: fetchedAdministration.email,
        numTel: fetchedAdministration.numTel,
        adresse: fetchedAdministration.adresse,
        role: fetchedAdministration.role
      },'secret_this_should_be_logner', {expiresIn: "1h"});
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        message: 'success'
      }).catch(err => {
        return res.status(404).json({
          message: err.toString()
        });
      });
    }
  });
});


router.post('/signupAdministration', (req, res, next)=> {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const administration =new Administration ({
      idUnique: req.body.idUnique,
      matricule: req.body.matricule,
      nomPrenom: req.body.nomPrenom,
      email: req.body.email,
      numTel: req.body.numTel,
      adresse: req.body.adresse,
      password: hash,
      role: req.body.role
    });
    administration.save().then(result => {
      res.status(200).json({
        message: 'Administration created',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

router.get('/demandesConge',(req, res, next)=>{

  Conge.find({"administrationStatus": 0, "directionStatus": 1}).then(result => {
    res.status(200).json(result);
  });

});

router.put('/agree', (req, res, next) => {
  let congeId = req.body.congeId;
  let employeMatricule = req.body.employeMatricule;
  let employeTypeConge = req.body.employeTypeConge;
  let employeDureeConge = req.body.employeDureeConge;
  let employeEmail = req.body.employeEmail;

  Conge.findById(congeId, (err, conge) => {
    if(!conge){
      return next(new Error('could not load Conge'));
    }
    else{
      conge.administrationStatus = 1;
      conge.save().then(result => {
        res.status(200).json(result);

        Employe.findOne({"matricule": employeMatricule}).then(employe => {
            if(employeTypeConge === "سنوية"){
              employe.nbJoursConge.annuel = employe.nbJoursConge.annuel - employeDureeConge;
              if(employe.nbJoursConge.annuel < 0){
                employe.nbJoursConge.annuel = 0;
              }
              employe.save().then(result => {
                res.status(200).json(result)
                .catch(err => {
                  res.status(500).json(err);
                });
              });
            }
            else if(employeTypeConge === "إستثنائية"){
              employe.nbJoursConge.exceptionnel = employe.nbJoursConge.exceptionnel - employeDureeConge;
              if(employe.nbJoursConge.exceptionnel < 0){
                employe.nbJoursConge.exceptionnel = 0;
              }
              employe.save().then(result => {
                res.status(200).json(result)
                .catch(err => {
                  res.status(500).json(err);
                });
              });
            }
            else if(employeTypeConge === "تعويضية"){
              employe.nbJoursConge.compensation = employe.nbJoursConge.compensation - employeDureeConge;
              if(employe.nbJoursConge.compensation < 0){
                employe.nbJoursConge.compensation = 0;
              }
              employe.save().then(result => {
                res.status(200).json(result)
                .catch(err => {
                  res.status(500).json(err);
                });
              });
            }
            else {
              employe.nbJoursConge.annuel = employe.nbJoursConge.annuel - employeDureeConge;
              if(employe.nbJoursConge.annuel < 0){
                employe.nbJoursConge.annuel = 0;
              }
              employe.save().then(result => {
                res.status(200).json(result)
                .catch(err => {
                  res.status(500).json(err);
                });
              });
            }

            readHTMLFile('src/app/lettres/administrationAcceptation.html', function(err, html){
              var template = handlebars.compile(html);
              var replacements = {

              };

              var htmlToSend = template(replacements);
              var mailOptions = {
                from: '"CIMF"<luisvillala8@gmail.com>',
                to: employeEmail,
                subject: 'لقد تم قبول مطلبك',
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
                  callback(error);
                }
              })

            });

        });

      }).catch(err => {
        res.status(500).json(err);
      });
    }
  });
});

router.put('/disagree', (req, res, next)=> {
  let congeId = req.body.congeId;
  let employeEmail = req.body.employeEmail;

  Conge.findById(congeId, (err, conge) => {
    if(!conge){
      return next(new Error('Could not load Conge'));
    }
    else{
      conge.administrationStatus = -1;
      conge.save().then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.status(500).json(err);
      });

      readHTMLFile('src/app/lettres/administrationRefus.html', function(err, html){
        var template = handlebars.compile(html);
        var replacements = {

        };

        var htmlToSend = template(replacements);
        var mailOptions = {
          from: '"CIMF"<luisvillala8@gmail.com>',
          to: employeEmail,
          subject: 'لقد تم رفض مطلبك',
          html: htmlToSend,
          attachments: [{
            filename: 'logo.png',
            path: './src/assets/images/logo.png',
            cid: 'uniqe@logo'
          },
          {
            filename: 'success.png',
            path: './src/assets/images/refus.png',
            cid: 'uniqe@success'
          }
        ]
        };

        transporter.sendMail(mailOptions, function(error, response){
          if(error){
            console.log(error);
            callback(error);
          }
        })

      });

    }
  });
});

router.get('/utilisateurs', (req,res, next) => {
  Employe.find().then(result => {
    res.status(200).json(result);
  });
});

router.get('/administrateurs', (req, res, next) => {
  Administration.find().then(result => {
    res.status(200).json(result);
  });
});

router.put('/updateEmploye', (req, res, next) => {

    bcrypt.hash(req.body.password, 10).then(hash => {
      Employe.findOne({'idUnique': req.body.idUnique}).then(employe => {
        if(!employe){
          return res.status(404).json({
            message: employe
          });
        }
        else{

          const emp = new Employe({
            idUnique: req.body.idUnique,
            matricule: req.body.matricule,
            nomPrenom: req.body.nomPrenom,
            emploi: req.body.emploi,
            affectation: req.body.affectation,
            password: hash,
            direction: req.body.direction,
            role: req.body.role,
            email: req.body.email,
            nbJoursConge: req.body.nbJoursConge,
            ancienConges: req.body.ancienConges
          });

          employe.nomPrenom = emp.nomPrenom;
          employe.emploi = emp.emploi;
          employe.affectation = emp.affectation;
          employe.password = emp.password;
          employe.direction = emp.direction;
          employe.role = emp.role;
          employe.email = emp.email;
          employe.nbJoursConge = emp.nbJoursConge;
          employe.ancienConges = emp.ancienConges;

          employe.save().then(result => {
            res.status(200).json(result);
          }).catch(err => {
            res.status(500).json(err);
          });

        }
      });

    }).catch(err => {
      res.status(500).json(err);
    })


});

router.put('/updateAdministrateur', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    Administration.findOne({'idUnique': req.body.idUnique}).then(admin => {
      if(!admin){
        return res.status(404).json({
          message: admin
        });
      }
      else{

        const adm = new Administration({
          idUnique: req.body.idUnique,
          matricule: req.body.matricule,
          nomPrenom: req.body.nomPrenom,
          adresse: req.body.adresse,
          role: req.body.role,
          password: hash,
          email: req.body.email,
          numTel: req.body.numTel
        });


        admin.idUnique = adm.idUnique;
        admin.matricule = adm.matricule;
        admin.nomPrenom = adm.nomPrenom;
        admin.adresse = adm.adresse;
        admin.role = adm.role;
        admin.password = adm.password;
        admin.email = adm.email;
        admin.numTel = adm.numTel;

        admin.save().then(result => {
          res.status(200).json(result);
        }).catch(err => {
          res.status(500).json(err);
        });

      }
    });

  }).catch(err => {
    res.status(500).json(err);
  })

})

router.delete('/deleteEmploye/:_id', (req, res, next)=> {
  Employe.deleteOne({'_id': req.params._id}).then(employe => {
    res.status(200).json({
      result: "employe deleted"
    })
  }).catch(err => {
    res.status(500).json({
      message: "error"
    });
  })
});

router.delete('/deleteAdministrateur/:_id', (req,res, next)=> {
  Administration.deleteOne({'_id': req.params._id}).then(admin => {
    res.status(200).json({
      result: "admin deleted"
    });
  }).catch(err => {
    res.status(500).json({
      message: "error"
    });
  });
});

module.exports = router;
