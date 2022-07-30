exports.openConnection = () => {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'FUe123456',
            database: 'train_reservation'
        }
    });

    return knex
}