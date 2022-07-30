const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const admin = require("../model/admin")
const joi = require("joi")

exports.selectadmins = (request, response) => {
    const knex = request.app.locals.knex
    knex("Admins")
        .select("id", "username", "name", "phonenumber", "email")
        .then(admins => {
            response.status(200).json(admins)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addadmin = (request, response) => {
    const knex = request.app.locals.knex

    const name = request.body.name
    const username = request.body.username
    const phonenumber = request.body.phonenumber
    const email = request.body.email
    const password = request.body.password
    const address = request.body.address
    const gender = request.body.gender

    if (!name || !username || !phonenumber || !email || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

        const admins = new admin('1', username, name, phonenumber, gender, address, email, password, "hash")

        const adminSchema = joi.object({
            id: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
            username: joi.string().not().empty().min(2).max(8).required(),
            name: joi.string().not().empty().min(3).max(50).pattern(/[a-z A-Z]{3,50}/).required(),
            phonenumber: joi.string().pattern(/[0-9]{11}/).required(),
            gender: joi.string().not().empty().max(6).valid('female', 'male').required(),
            address: joi.string().not().empty().min(6).max(60).required(),
            email: joi.string().email().min(6).max(60).required(),
            password: joi.string().min(6).max(20).required(),
            hashedPassword: joi.string().min(1).max(100).required(),
        })
    
        const joiError = adminSchema.validate(admins)
    
        if (joiError.error) {
            console.log(joiError.error.details);
            return response.status(400).json({
                status: "error",
                msg: "400 Bad Request"
            }) 
        }

        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                console.log(err);
            }
            admins.hashedPassword = hash

        knex("Admins")
            .insert({
                name: admins.name,
                username: admins.username,
                phonenumber: admins.phonenumber,
                email: admins.email,
                password: admins.hashedPassword,
                address: admins.address,
                gender: admins.gender
            })
            .then(data => {
                response.status(201).json({
                    status: "ok",
                    msg: "Created"
                })
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({
                    status: "error",
                    msg: "500 Internal Server Error"
                })
            })

    });

}

exports.login = (request, response) => {

    const knex = request.app.locals.knex

    const username = request.body.username
    const password = request.body.password
    
    if (!username || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    knex("Admins")
        .select('username', 'password')
        .limit(1)
        .where('username', '=', username)
        .then(admin => {
            console.log(admin);
            if (admin[0] != null) {
                bcrypt.compare(password, admin[0].password, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {

                        const token = jwt.sign({
                            userusername: admin[0].username,
                            usertype: 'Admin'
                        }, "123456", {})

                        response.status(200).json({
                            token: token,
                            status: "ok",
                            msg: "login"
                        })
                    } else {
                        response.status(401).json({
                            status: "error",
                            msg: "invalid password"
                        })
                    }
                })

            } else {
                response.status(401).json({
                    status: "error",
                    msg: "401 not Auth"
                })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}