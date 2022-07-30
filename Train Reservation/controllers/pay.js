const Pay = require("../model/pay")
const joi = require("joi")

exports.selectpay = (request, response) => {
    const knex = request.app.locals.knex
    knex("pay")
        .select("PaymentsID", "ReservePassangersID", "ReserveTripId")
        .then(pay => {
            response.status(200).json(pay)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addpay = (request, response ) => {
    const knex = request.app.locals.knex

    const PaymentsID = request.body.PaymentsID
    const ReservePassangersID = request.body.ReservePassangersID
    const ReserveTripId =request.body.ReserveTripId
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const codes = () =>  getRandomNumber(1, 10000000);
    const code = codes();

    if (!PaymentsID || !ReservePassangersID || !ReserveTripId  ) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const pays = new Pay(PaymentsID,ReservePassangersID, ReserveTripId )

    const paySchema = joi.object({
        PaymentsID: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        ReservePassangersID:joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        ReserveTripId: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
    })

    const joiError = paySchema.validate(pays)

    if (joiError.error) {
        console.log(joiError.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        }) 
    }
knex("pay")
    .insert({
        PaymentsID: pays.PaymentsID,
        ReservePassangersID: pays.ReservePassangersID ,
        ReserveTripId : pays.ReserveTripId ,
        })
    .then(data => {

    return response.status(201).json({
                status: "ok",
                msg: "created",code
            })

            })
    .catch(error => {
        console.log(error);
        response.status(500).json({
             status: "error",
             msg: "500 Internal Server Error"
            })
        })
    }