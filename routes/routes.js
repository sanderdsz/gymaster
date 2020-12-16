const express = require('express')
const routes = express.Router()

const instructors = require('./instructors')
const members = require('./members')

routes.get('/', function(req, res) { return res.redirect('/instructors') })

routes.get('/instructors', instructors.index)
routes.get('/instructors/create', instructors.create)
routes.get('/instructors/:id', instructors.show)
routes.get('/instructors/:id/edit', instructors.edit)
routes.post('/instructors', instructors.post)
routes.put('/instructors', instructors.put)
routes.delete('/instructors', instructors.delete)  

routes.get('/members', members.index)
routes.get('/members/create', members.create)
routes.get('/members/:id', instructors.show)
routes.get('/members/:id/edit', instructors.edit)
routes.post('/members', instructors.post)
routes.put('/members', instructors.put)
routes.delete('/members', instructors.delete)  

module.exports = routes;