const fs = require('fs')
const data = require("../data.json")
const { age, date } = require("../utils/utils")

exports.index = function(req, res) {
    return res.render('members/index', /*{ members: data.members }*/)
}

exports.show = function(req, res) {
    const { id } = req.params
    const foundmember = data.members.find(function(member) {
        return member.id == id
    })
    if (!foundmember) { 
        return res.send("member not found.")
    }

    const member = {
        ...foundmember,
        age: age(foundmember.birth),
        created_at: new Intl.DateTimeFormat("en-US").format(foundmember.created_at),
    }

    return res.render('members/show/index', { member: member })
} 

exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    /* Simple validation of blank input fields */
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields.')
        }
    }
    
    let {avatar_url, birth, name, gender} = req.body

    birth = Date.parse(req.body.birth)
    const created_at = req.body.created_at = Date.now()
    const id = req.body.id = Number(data.members.length + 1)

    /* Persistence */
    data.members.push({
        id,
        avatar_url,
        name,
        birth,
        gender, 
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) {
            return res.send("Write file error.")
        }
        return res.redirect("/members")
    })
}

exports.edit = function(req, res) {
    const { id } = req.params
    const foundmember = data.members.find(function(member) {
        return member.id == id
    })
    if (!foundmember) { 
        return res.send("member not found.")
    }

    const member = {
        ...foundmember,
        birth: date(foundmember.birth)
    }

    return res.render('members/edit/index', { member })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0
    /* find index position for member */
    const foundmember = data.members.find(function(member, foundIndex) {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })
    if (!foundmember) { 
        return res.send("member not found.")
    }

    const member = {
        ...foundmember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) {
            return res.send("Write file error.")
        }
        return res.redirect(`/members/${id}`)
    })
}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredmembers = data.members.filter(function(member) {
        return member.id != id
    })
    data.members = filteredmembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) {
            return res.send("Write file error.")
        }
        return res.redirect(`/members`)
    })
}

exports.create = function(req, res) {
    return res.render('members/create/index')
}