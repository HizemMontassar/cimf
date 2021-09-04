  const express = require('express');
const Employe = require('../models/employe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/signup", (req, res, next)=>{
  bcrypt.hash(req.body.password, 10).then(hash => {
    const employe = new Employe({
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
    employe.save().then(result => {
      res.status(200).json({
        message: 'Employe created',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

router.get("/login", (req, res, next)=> {
  Employe.findOne({idUnique: req.query.matricule}).then(employe =>{
    if(!employe){
      return res.status(404).json({
        message: 'error'
      });
    }
    fetchedEmploye = employe;
    return bcrypt.compare(req.query.password, employe.password);
  }).then(result => {
    if(!result){
      return res.status(404).json({
        message: 'error'
      });
    }
    console.log("Year: "+new Date().getFullYear());
    console.log("Month: "+(new Date().getMonth()));

    if(fetchedEmploye.nbJoursConge.annee === new Date().getFullYear()){
      console.log("same year");
      if(fetchedEmploye.nbJoursConge.mois === new Date().getMonth()){
        console.log("already added to month");
      }
      else{
        if(new Date().getMonth() != 11){
          let ajouterJoursConge = ((new Date().getMonth() + 1)- fetchedEmploye.nbJoursConge.mois) * 2;
          fetchedEmploye.nbJoursConge.annuel += ajouterJoursConge;
          fetchedEmploye.nbJoursConge.mois = new Date().getMonth();
          fetchedEmploye.save().then(result => {
            res.status(200).json({
              result: result,
              message: "jours de moin ajoutés !!"
            });
          });
        }
        else{
          let ajouterJoursConge = (((new Date().getMonth() + 1)- fetchedEmploye.nbJoursConge.mois) * 2)+2;
          console.log("Jours ajoutés pour conge en decembre: "+ajouterJoursConge);
        }
      }
    }
    else{
      let ancienConge = {
        annee: fetchedEmploye.nbJoursConge.annee,
        annuel: fetchedEmploye.nbJoursConge.annuel,
        exceptionnel: fetchedEmploye.nbJoursConge.exceptionnel,
        compensation: fetchedEmploye.nbJoursConge.compensation
      };
      fetchedEmploye.ancienConges.push(ancienConge);
      fetchedEmploye.nbJoursConge.annee = new Date().getFullYear();
      if(new Date().getMonth() != 11){
        fetchedEmploye.nbJoursConge.annuel = ((new Date().getMonth() +1) * 2)
      }
      else{
        fetchedEmploye.nbJoursConge.annuel = ((new Date().getMonth() * 2) + 1) + 2;
      }
      fetchedEmploye.nbJoursConge.exceptionnel = 6;
      fetchedEmploye.nbJoursConge.mois = new Date().getMonth();

      fetchedEmploye.save().then(result => {
        res.status(200).json({
          result: result,
          message: "ancien congé ajouté !!"
        });
      });

    }
    const token = jwt.sign({
      idUnique: fetchedEmploye.idUnique,
      matricule: fetchedEmploye.matricule,
      nomPrenom: fetchedEmploye.nomPrenom,
      emploi: fetchedEmploye.emploi,
      affectation: fetchedEmploye.affectation,
      employeId: fetchedEmploye._id,
      direction: fetchedEmploye.direction,
      role: fetchedEmploye.role,
      email: fetchedEmploye.email,
      nbJoursConge: fetchedEmploye.nbJoursConge,
      ancienConges: fetchedEmploye.ancienConges,
      },'secret_this_should_be_logner', {expiresIn: "1h"});
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        message: 'success'
      });
  }).catch(err => {
    return res.status(404).json({
      message: err.toString()
    });
  });
});

router.post("/logintest", (req, res, next)=> {
  Employe.findOne({matricule: req.body.matricule}).then(employe =>{
    if(!employe){
      return res.status(404).json({
        message: 'error'
      });
    }
    fetchedEmploye = employe;
    return bcrypt.compare(req.body.password, employe.password);
  }).then(result => {
    if(!result){
      return res.status(404).json({
        message: 'error'
      });
    }
    console.log("Year: "+new Date().getFullYear());
    console.log("Month: "+(new Date().getMonth()));

    if(fetchedEmploye.nbJoursConge.annee === new Date().getFullYear()){
      console.log("same year");
      if(fetchedEmploye.nbJoursConge.mois === new Date().getMonth()){
        console.log("already added to month");
      }
      else{
        if(new Date().getMonth() != 11){
          let ajouterJoursConge = ((new Date().getMonth() + 1)- fetchedEmploye.nbJoursConge.mois) * 2;
          fetchedEmploye.nbJoursConge.annuel += ajouterJoursConge;
          fetchedEmploye.nbJoursConge.mois = new Date().getMonth();
          fetchedEmploye.save().then(result => {
            res.status(200).json({
              result: result,
              message: "jours de moin ajoutés !!"
            });
          });
        }
        else{
          let ajouterJoursConge = (((new Date().getMonth() + 1)- fetchedEmploye.nbJoursConge.mois) * 2)+2;
          console.log("Jours ajoutés pour conge en decembre: "+ajouterJoursConge);
        }
      }
    }
    else{
      let ancienConge = {
        annee: fetchedEmploye.nbJoursConge.annee,
        annuel: fetchedEmploye.nbJoursConge.annuel,
        exceptionnel: fetchedEmploye.nbJoursConge.exceptionnel,
        compensation: fetchedEmploye.nbJoursConge.compensation
      };
      fetchedEmploye.ancienConges.push(ancienConge);
      fetchedEmploye.nbJoursConge.annee = new Date().getFullYear();
      if(new Date().getMonth() != 11){
        fetchedEmploye.nbJoursConge.annuel = ((new Date().getMonth() +1) * 2)
      }
      else{
        fetchedEmploye.nbJoursConge.annuel = ((new Date().getMonth() * 2) + 1) + 2;
      }
      fetchedEmploye.nbJoursConge.exceptionnel = 6;
      fetchedEmploye.nbJoursConge.mois = new Date().getMonth();

      fetchedEmploye.save().then(result => {
        res.status(200).json({
          result: result,
          message: "ancien congé ajouté !!"
        });
      });

    }


    const token = jwt.sign({
    idUnique: fetchedEmploye.idUnique,
    matricule: fetchedEmploye.matricule,
    nomPrenom: fetchedEmploye.nomPrenom,
    emploi: fetchedEmploye.emploi,
    affectation: fetchedEmploye.affectation,
    employeId: fetchedEmploye._id,
    direction: fetchedEmploye.direction,
    role: fetchedEmploye.role,
    email: fetchedEmploye.email,
    nbJoursConge: fetchedEmploye.nbJoursConge,
    ancienConges: fetchedEmploye.ancienConges,
    },'secret_this_should_be_logner', {expiresIn: "1h"});
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      message: 'success'
    });
  }).catch(err => {
    return res.status(404).json({
      message: err.toString()
    });
  });
});

module.exports = router;
