const Payment = require("../model/payment")
const joi = require("joi")

exports.selectpayments = (request, response) => {
    const knex = request.app.locals.knex
    knex("payments")
        .select("id", "code", "type")
        .then(payments => {
            response.status(200).json(payments)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addpayment = (request, response ) => {
    const knex = request.app.locals.knex

    const code = request.body.code
    const type = request.body.type

    if (!code || !type) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const payment = new Payment('1',code, type)

    const paymentSchema = joi.object({
        id: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        code: joi.string().not().empty().min(2).max(8).required(),
        type: joi.string().not().empty().max(10).required(),
    })

    const joiError = paymentSchema.validate(payment)

    if (joiError.error) {
        console.log(joiError.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        }) 
    }
        
    knex("payments")
    .insert({
            code: payment.code,
            type: payment.type
        })
    .then(data => {
    return response.status(201).json({
                status: "ok",
                msg: "created"
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

exports.updatepayment = (request, response) => {
    const knex = request.app.locals.knex

    const code = request.body.code
    const type = request.body.type

    const payment = new Payment('1',code, type)

  knex('payments')
      .where('id', '=', request.params.id)
      .update({
        code: payment.code,
        type: payment.type,
      })
      .then(data => {
          response.status(200).json({
              status: "ok",
              msg: "updated"
          })
      })
      .catch(err => {
        response.status(500).json({
            status:"error",
            msg:"500 internal server error"
        })
      })

}

exports.deletepayment = (request, response) => {
    const knex = request.app.locals.knex

     knex('payments')
        .where('id', '=', request.params.id)
        .update({
            is_deleted: '1',
        })
        .then(data => {
            response.status(200).json({
                status: "ok",
                msg: "deleted"
            })
        })
        .catch(err => {
            console.log("error");
        })
}

exports.restorepayment = (request, response) => {
    const knex = request.app.locals.knex

     knex('payments')
        .where('id', '=', request.params.id)
        .update({
            is_deleted: '0',
        })
        .then(data => {
            response.status(200).json({
                status: "ok",
                msg: "restored"
            })
        })
        .catch(err => {
            console.log("err");
        })
}