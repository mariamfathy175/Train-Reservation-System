const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const passenger = require("../model/passenger")
const joi = require("joi")

exports.selectpassengers = (request, response) => {
    const knex = request.app.locals.knex
    knex("Passengers")
        .select("id", "code", "name", "phonenumber", "email")
        .then(passengers => {
            response.status(200).json(passengers)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addpassenger = (request, response) => {
    const knex = request.app.locals.knex

    const name = request.body.name
    const code = request.body.code
    const phonenumber = request.body.phonenumber
    const email = request.body.email
    const password = request.body.password
    const address = request.body.address
    const gender = request.body.gender

    if (!name || !code || !phonenumber || !email || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const passengers = new passenger('1',  code, name, phonenumber, gender, address, email, password, "hash")

        const passengerSchema = joi.object({
            id: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
            code: joi.string().not().empty().min(2).max(8).required(),
            name: joi.string().not().empty().min(3).max(50).pattern(/[a-z A-Z]{3,50}/).required(),
            phonenumber: joi.string().pattern(/[0-9]{11}/).required(),
            gender: joi.string().not().empty().max(6).valid('female', 'male').required(),
            address: joi.string().not().empty().min(6).max(60).required(),
            email: joi.string().email().min(6).max(60).required(),
            password: joi.string().min(6).max(20).required(),
            hashedPassword: joi.string().min(1).max(100).required(),
        })
    
        const joiError = passengerSchema.validate(passengers)
    
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
            passengers.hashedPassword = hash

        knex("Passengers")
            .insert({
                name: passengers.name,
                code: passengers.code,
                phonenumber: passengers.phonenumber,
                email: passengers.email,
                password: passengers.hashedPassword,
                address: passengers.address,
                gender: passengers.gender,
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

    const code = request.body.code
    const password = request.body.password

    if (!code || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    knex("Passengers")
        .select('code', 'password')
        .limit(1)
        .where('code', '=', code)
        .then(Passenger => {
            console.log(Passenger);
            if (Passenger[0] != null) {
                bcrypt.compare(password, Passenger[0].password, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {

                        const token = jwt.sign({
                            PassengerCode: Passenger[0].code,
                            usertype: "Passenger"
                        }, '12345', {})

                        return response.status(200).json({
                            status: "ok",
                            msg: "Login",
                            token
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

