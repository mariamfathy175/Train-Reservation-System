class admin {
    constructor(id, username, name, phonenumber, gender, address, email, password, hashedPassword) {
        this.id = id
        this.username = username
        this.name = name
        this.phonenumber = phonenumber
        this.gender = gender
        this.address = address
        this.email = email
        this.password = password
        this.hashedPassword = hashedPassword
    }
}

module.exports = admin