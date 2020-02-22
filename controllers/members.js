const fs = require('fs')
const data = require("../data.json")

exports.index = function(req, res){
    return res.render("members/index", {members: data.members})
}

// show
exports.show = function(req,res){
    const {id} = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if (!foundMember) return res.send("instrutor não existe")

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

    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    }

    return res.render("members/show", { member })
}

exports.create = function(req, res){
    return res.render('members/create')
}

exports.post = function(req, res) {

        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos.')
            }
        }
        
       

        birth = Date.parse(req.body.birth)

        let id = 1
        const lastMember = data.members[data.members.length - 1]

        if (lastMember) {
            id = lastMember.id + 1
        }
        
        data.members.push({
                id,  
                ...req.body,
                birth
        })

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if (err) return res.send("write file erro")

            return res.redirect(`/members/${id}`)
        })
        
    }

exports .edit = function(req, res){

    const {id} = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if (!foundMember) return res.send("instrutor não existe")

    return res.render('members/edit', {member: foundMember })
}

exports.put = function(req, res) {

    const {id} = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex){
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return res.send("instrutor não existe")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("write error")

        return res.redirect(`/members/${id}`)
    })

}

exports.delete = function (req, res) {
    const {id} = req.body

    const filteredMembers = data.members.filter(function(member){
        return member.id != id
    })


    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("write file error")

        return res.redirect("/members")
    })
}
