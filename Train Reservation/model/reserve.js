class Reserve {
    constructor(PassangersID, TripID, code, departureTime, arrivalTime, cost, seatnumber) {
        this.PassangersID = PassangersID
        this.TripID = TripID
        this.code = code
        this.departureTime = departureTime
        this.arrivalTime = arrivalTime
        this.cost = cost
        this.seatnumber = seatnumber
    }
}

module.exports = Reserve