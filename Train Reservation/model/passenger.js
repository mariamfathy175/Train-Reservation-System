class Passenger {
    constructor(id, code, name, phonenumber, gender, address, email, password, hashedPassword) {
        this.id = id
        this.code = code
        this.name = name
        this.phonenumber = phonenumber
        this.gender = gender
        this.address = address
        this.email = email
        this.password = password
        this.hashedPassword = hashedPassword
    }
}

module.exports = Passenger