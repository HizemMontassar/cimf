const express = require('express');
const Conge = require('../models/conge');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.put("/agree", (req, res, next) => {
  const congeId = req.body.congeId;
  const uniqueId = req.body.uniqueId;
  const employeEmail = req.body.employeEmail;
  const nomPrenom = req.body.nomPrenom;
  console.log(congeId);
  console.log(uniqueId);
  let compteur=0;
  Conge.findById(congeId, (err, p) => {
    if(!p){
      return next(new Error('could not load document'));
    }
    else{
      for(let i=0; i<p.direction.length; i++){
        if(p.direction[i].directId == uniqueId){
          p.direction[i].directStatus = 1;
          p.save().then(result => {
            res.status(200).json({
              message: 'conge updated',
              result: result
            }).catch(err => {
                res.status(500).json({
                  error: err
                });
            });
          });
        }
      }

      for(let i=0; i<p.direction.length; i++){

        if(p.direction[i].directStatus == 1){
          compteur++;
        }
        console.log(compteur);
      }
      if(compteur == p.direction.length){
        p.directionStatus = 1;
        p.save().then(result => {
          res.status(200).json({
            message: 'status update too',
            result: result
          }).catch(err => {
              res.status(500).json({
                error: err
              });
          });
        });

        readHTMLFile('src/app/lettres/acceptation.html', function(err, html){
          var template = handlebars.compile(html);
          var replacements = {
            username: nomPrenom
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
      }

    }
  });
});

router.put('/disagree', (req, res, next)=> {
  const congeId = req.body.congeId;
  const uniqueId = req.body.uniqueId;
  const employeEmail = req.body.employeEmail;
  const nomPrenom = req.body.nomPrenom;
  Conge.findById(congeId, (err, p) => {
    if(!p){
      return next(new Error('could not load document'));
    }
    else{
      for(let i=0; i<p.direction.length; i++){
        if(p.direction[i].directId == uniqueId){
          p.direction[i].directStatus = -1;
          p.save().then(result => {
            res.status(200).json({
              message: 'conge updated',
              result: result
            }).catch(err => {
                res.status(500).json({
                  error: err
                });
            });
          });
        }
      }

      for(let i=0; i<p.direction.length; i++){
        if(p.direction[i].directStatus == -1){
          p.directionStatus = -1;
          p.administrationStatus = -1;
          p.save().then(result => {
            res.status(200).json({
              message: 'status updated too',
              result: result
            }).catch(err => {
              res.status(500).json({
                error: err
              });
            });
          });
        }
      }

      readHTMLFile('src/app/lettres/refus.html', function(err, html){
        var template = handlebars.compile(html);
        var replacements = {
          username: nomPrenom
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


module.exports = router;
