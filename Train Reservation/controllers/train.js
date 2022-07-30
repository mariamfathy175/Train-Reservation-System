const Train = require("../model/train")
const joi = require("joi")

exports.selectTrains = (request, response) => {
    const knex = request.app.locals.knex
    knex("trains")
        .select("id", "code", "name", "type")
        .then(trains => {
            response.status(200).json(trains)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addTrain = (request, response ) => {
    const knex = request.app.locals.knex

    const code = request.body.code
    const name = request.body.name
    const type = request.body.type

    if (!code || !name || !type) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const train = new Train('1',code, name, type)

    const trainSchema = joi.object({
        id: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        code: joi.string().not().empty().min(2).max(8).required(),
        name: joi.string().not().empty().min(3).max(50).pattern(/[a-z A-Z]{3,50}/).required(),
        type: joi.string().not().empty().max(10).required(),
    })

    const joiError = trainSchema.validate(train)

    if (joiError.error) {
        console.log(joiError.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        }) 
    }
        
    knex("trains")
    .insert({
            code: train.code,
            name: train.name,
            type: train.type
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

exports.updateTrain = (request, response) => {
    const knex = request.app.locals.knex

    const code = request.body.code
    const name = request.body.name
    const type = request.body.type

    const train = new Train('1',code, name, type)

  knex('trains')
      .where('id', '=', request.params.id)
      .update({
        code: train.code,
        name: train.name,
        type: train.type,
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

exports.deleteTrain = (request, response) => {
    const knex = request.app.locals.knex

     knex('trains')
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

exports.restoreTrain = (request, response) => {
    const knex = request.app.locals.knex

     knex('trains')
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