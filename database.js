let knex;

if (process.env.DATABASE_URL){
    knex = require('knex')({
      client: 'cockroachdb',
      connection: process.env.DATABASE_URL
    });
} else {
    knex = require('knex')({
      client: 'pg',
      version: '11.1',
      connection: {
        host : '127.0.0.1',
        user : 'vyper374',
        password : '',
        database : 'challenge-14'
      }
    });
}

//INITIAL CREATE TABLES

knex.schema.hasTable('scores').then(exists => {
    if (!exists){
        return knex.schema.createTable('scores', t => {
            t.increments('id').primary();
            t.string('username', 25);
            t.integer('seconds');
            t.integer('moves');
            t.integer('score');
            t.string('difficulty', 6);
            t.timestamp('date').defaultTo(knex.fn.now()).notNullable();
        });
    }
}).catch(err => {
    if (err) console.log("Can't create table: scores");
});

module.exports = knex;