const Reserve = require("../model/reserve")
const joi = require("joi")

exports.selectTicket = (request, response) => {
    const knex = request.app.locals.knex
    knex("reserve")

    .select( 'trips.tripclass as class ','passengers.name as name','reserve.departureTime' ,'reserve.arrivalTime','trips.source', 'trips.destination', 'reserve.cost', 'reserve.seatnumber')
    .from('train_reservation.reserve')
    .where('trips.is_deleted','=','0'  )
    .where('passengers.is_deleted','=','0'  )
    .where('reserve.is_deleted','=','0'  )
    .innerJoin('train_reservation.trips', 'reserve.TripID', 'trips.id') 
    .innerJoin('train_reservation.passengers', 'reserve.PassangersID', 'passengers.id') 

        .then(reservations => {
            response.status(200).json(reservations)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.selectmyTicket = (request, response) => {
    const knex = request.app.locals.knex

    if (!request.body.code ) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

     knex("reserve")
    .select( 'trips.tripclass as class ','passengers.name as name','reserve.departureTime' ,'reserve.arrivalTime','trips.source', 'trips.destination', 'reserve.cost', 'reserve.seatnumber')
    .from('train_reservation.reserve')
    .where('trips.is_deleted','=','0'  )
    .where('passengers.is_deleted','=','0'  )
    .where('reserve.is_deleted','=','0'  )
    .innerJoin('train_reservation.trips', 'reserve.TripID', 'trips.id') 
    .innerJoin('train_reservation.passengers', 'reserve.PassangersID', 'passengers.id')
    .where('passengers.code', '=', `${request.body.code}`)
    .limit(1)
    .then(data => {
            return response.status(200).json(data)
        })
        .catch(error => {
            console.log(error);
            return response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.selectreservations = (request, response) => {
    const knex = request.app.locals.knex
    knex("reserve")

        .select("PassangersID", "TripID", "code", "departureTime", "arrivalTime", "cost", "seatnumber")
        .then(reservations => {
            response.status(200).json(reservations)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addreservation = (request, response ) => {
    const knex = request.app.locals.knex

    const PassangersID = request.body.PassangersID
    const TripID = request.body.TripID
    const code = request.body.code
    const departureTime = request.body.departureTime
    const arrivalTime = request.body.arrivalTime
    const cost = request.body.cost
    const seatnumber = request.body.seatnumber

    if (!PassangersID || !TripID || !code || !departureTime || !arrivalTime|| !cost || !seatnumber ) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const reserves = new Reserve(PassangersID, TripID, code, departureTime, arrivalTime, cost, seatnumber)

    const reserveSchema = joi.object({
        PassangersID: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        TripID: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        code: joi.string().not().empty().min(2).max(8).required(),
        departureTime: joi.string().not().empty().max(50).required(),
        arrivalTime: joi.string().not().empty().max(50).required(),
        cost: joi.string().not().empty().min(2).max(10).required(),
        seatnumber: joi.number().not().empty().min(2).max(4).required(),
    })

    const joiError = reserveSchema.validate(reserves)

    if (joiError.error) {
        console.log(joiError.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        }) 
    }
        
    knex("reserve")
    .insert({
            PassangersID: reserves.PassangersID,
            TripID: reserves.TripID,
            code: reserves.code,
            departureTime: reserves.departureTime,
            arrivalTime: reserves.arrivalTime,
            cost: reserves.cost ,
            seatnumber: reserves.seatnumber
        })

    .then(trips => {
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

exports.updatereservation = (request, response) => {
    const knex = request.app.locals.knex

    const PassangersID = request.body.PassangersID
    const TripID = request.body.TripID
    const code = request.body.code
    const departureTime = request.body.departureTime
    const arrivalTime = request.body.arrivalTime
    const cost = request.body.cost
    const seatnumber = request.body.seatnumber

    const reserves = new Reserve(PassangersID, TripID, code, departureTime, arrivalTime, cost, seatnumber)
    
  knex('reserve')
      .where('id', '=', request.params.id)
      .update({
        PassangersID: reserves.PassangersID,
        TripID: reserves.TripID,
        code: reserves.code,
        departureTime: reserves.departureTime,
        arrivalTime: reserves.arrivalTime,
        cost: reserves.cost ,
        seatnumber: reserves.seatnumber
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

exports.deletereservation = (request, response) => {
    const knex = request.app.locals.knex

     knex('reserve')
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

exports.restorereservation = (request, response) => {
    const knex = request.app.locals.knex

     knex('reserve')
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