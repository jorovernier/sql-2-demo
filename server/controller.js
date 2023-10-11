require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.CONNECTION_STRING)

const userID = 4;
const clientID = 3;

module.exports = {
    getUserInfo: (req, res) => {
        sequelize.query(`
            SELECT * FROM cc_clients AS c
            JOIN cc_users AS u
            ON c.user_id = u.user_id
            WHERE u.user_id = ${userID};
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
        // this is an optional error handling method, usually the parameter is called err but the joke was too good not to implement
    },
    updateUserInfo: (req, res) => {
        const {firstName, lastName, phoneNumber, email, address, city, state, zipCode} = req.body;
        sequelize.query(`
            UPDATE cc_users SET
            first_name = '${firstName}',
            last_name = '${lastName}',
            phone_number = ${phoneNumber},
            email = '${email}'
            WHERE user_id = ${userID};

            UPDATE cc_clients SET
            address = '${address}',
            city = '${city}',
            state = '${state}',
            zip_code = ${zipCode}
            WHERE user_id = ${userID};
        `).then(() => res.sendStatus(200))
        .catch(theseHands => console.log(theseHands))
    },
    getUserAppt: (req, res) => {
        sequelize.query(`
            SELECT * FROM cc_appointments
            WHERE client_id = ${clientID}
            ORDER BY date DESC;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    },
    requestAppointment: (req, res) => {
        const {date, service} = req.body
        sequelize.query(`
            INSERT INTO cc_appointments (client_id, date, service_type, notes, approved, completed)
            VALUES (${clientID}, '${date}', '${service}', '', false, false)
            RETURNING *;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    }
}