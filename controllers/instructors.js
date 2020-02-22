const fs = require('fs')
const data = require("../data.json")

exports.index = function(req, res){
    return res.render("instructors/index", {instructors: data.instructors})
}

exports.show = function(req,res){
    const {id} = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("instrutor não existe")

    function age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()

        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }
        return age
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at:new Intl.DateTimeFormat("pt-br").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", { instructor })
}

exports.create = function(req, res){
    return res.render('instructors/create')
}

exports.post = function(req, res) {

        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos.')
            }
        }
        
        let  {avatar_url, birth, name, services, gender } = req.body

        birth = Date.parse(birth)
        const created_at = Date.now()
        const id = Number(data.instructors.length + 1)

        data.instructors.push({
            id,
            name,
            avatar_url,
            birth,
            gender,
            services,
            created_at,
        })

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if (err) return res.send("write file erro")

            return res.redirect(`/instructors/${id}`)
        })
        
        //return res.send(req.body)
    }

exports .edit = function(req, res){

    const {id} = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("instrutor não existe")

    return res.render('instructors/edit', {instructor: foundInstructor })
}

exports.put = function(req, res) {

    const {id} = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return res.send("instrutor não existe")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("write error")

        return res.redirect(`/instructors/${id}`)
    })

}

exports.delete = function (req, res) {
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })


    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("write file error")

        return res.redirect("/instructors")
    })
}
