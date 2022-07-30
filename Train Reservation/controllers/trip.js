const Trip = require("../model/trip")
const joi = require("joi")

exports.Tripdetails = (request, response) => {
const knex = request.app.locals.knex
knex("trips")

.select('trips.state ','trips.bookedseats','trips.availableseats' ,'trips.tripclass','trains.Name as train name', 'trains.type', 'reserve.departureTime' ,'reserve.arrivalTime','trips.source', 'trips.destination', 'reserve.cost', 'reserve.seatnumber')
.from('train_reservation.trips')
.where('trips.is_deleted','=','0' )
.where('reserve.is_deleted','=','0' )
.where('trains.is_deleted','=','0'  )
.innerJoin('train_reservation.reserve', 'trips.id', 'reserve.TripID')
.innerJoin('train_reservation.trains', 'trips.TrainsID', 'trains.ID') 

.then(trip => {
     response.status(200).json(trip)
    })
.catch(error => {
    console.log(error);
    response.status(500).json({
            status: "error",
            msg: "500 Internal Server Error"
            })
        })
}

exports.selecttrip = (request, response) => {
    const knex = request.app.locals.knex
    knex("trips")
        .select("id", "code", "state", "bookedseats","availableseats","source","destination","tripclass")
        .then(trips => {
            response.status(200).json(trips)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}
exports.addtrip = (request, response ) => {
    const knex = request.app.locals.knex

    const code = request.body.code
    const state = request.body.state
    const bookedseats = request.body.bookedseats
    const availableseats = request.body.availableseats
    const source = request.body.source
    const destination = request.body.destination
    const tripclass = request.body.tripclass
    const trainsid = request.body.trainsid

    if (!code || !state  || !bookedseats || !availableseats || !source || !destination || !tripclass) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const trip = new Trip('1',code, state, bookedseats, availableseats,source,destination, tripclass, trainsid)

    const tripSchema = joi.object({
        id: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        code: joi.string().not().empty().min(2).max(8).required(),
        state: joi.string().not().empty().max(1).valid('0', '1').required(),
        bookedseats:joi.string().not().empty().min(1).max(3).pattern(/[0-9]+/).required(),
        availableseats:joi.string().not().empty().min(1).max(3).pattern(/[0-9]+/).required(),
        source: joi.string().not().empty().min(3).max(50).pattern(/[a-z A-Z]{3,50}/).required(),
        destination: joi.string().not().empty().min(3).max(50).pattern(/[a-z A-Z]{3,50}/).required(),
        tripclass:joi.string().not().empty().min(6).max(50).pattern(/[1-3][a-z A-Z]{3,50}/).required(),
        trainsid: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
    })

    const joiError = tripSchema.validate(trip)

    if (joiError.error) {
        console.log(joiError.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        }) 
    }
        
    knex("trips")
    .insert({
            code: trip.code,
            state: trip.state,
            bookedseats: trip.bookedseats,
            availableseats: trip.availableseats,
            source:trip.source , 
            destination:trip.destination ,
            tripclass:trip.tripclass,
            trainsid:trip.trainsid
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

exports.updateTrip = (request, response) => {
    const knex = request.app.locals.knex
    
    const code = request.body.code
    const state = request.body.state
    const bookedseats = request.body.bookedseats
    const availableseats = request.body.availableseats
    const source = request.body.source
    const destination = request.body.destination
    const tripclass = request.body.tripclass
    const trainsid = request.body.trainsid

    const trip = new Trip('1',code, state, bookedseats, availableseats,source,destination, tripclass, trainsid)

  knex('trips')
      .where('id', '=', request.params.id)
      .update({
        code: trip.code,
        state: trip.state,
        bookedseats: trip.bookedseats,
        availableseats: trip.availableseats,
        source: trip.source ,
        destination: trip.destination ,
        tripclass:trip.tripclass,
        trainsid:trip.trainsid
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

exports.deleteTrip = (request, response) => {
    const knex = request.app.locals.knex

     knex('trips')
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

exports.restoreTrip = (request, response) => {
    const knex = request.app.locals.knex

     knex('trips')
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