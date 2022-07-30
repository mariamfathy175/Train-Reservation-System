class Trip {
    constructor(id, code, state , bookedseats, availableseats, source, destination, tripclass ,trainsid) {
        this.id = id
        this.code=code
        this.state = state
        this.bookedseats = bookedseats
        this.availableseats = availableseats
        this.source = source
        this.destination = destination
        this.tripclass = tripclass
        this.trainsid = trainsid
    }
}

module.exports = Trip