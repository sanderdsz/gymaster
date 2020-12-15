const fs = require('fs')
const data = require("../data.json")
const { age, date } = require("../utils/utils")


exports.show = function(req, res) {
    const { id } = req.params
    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })
    if (!foundInstructor) { 
        return res.send("Instructor not found.")
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("en-US").format(foundInstructor.created_at),
    }

    return res.render('instructors/show/index', { instructor: instructor })
} 

exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    /* Simple validation of blank input fields */
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields.')
        }
    }
    
    let {avatar_url, birth, name, gender, services} = req.body

    birth = Date.parse(req.body.birth)
    const created_at = req.body.created_at = Date.now()
    const id = req.body.id = Number(data.instructors.length + 1)

    /* Persistence */
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender, 
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) {
            return res.send("Write file error.")
        }
        return res.redirect("/instructors")
    })
}

exports.edit = function(req, res) {
    const { id } = req.params
    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })
    if (!foundInstructor) { 
        return res.send("Instructor not found.")
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    return res.render('instructors/edit/index', { instructor })
}