const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Db connection successful');
    } catch (error) {
        console.log(error);
        throw new Error('Error at moment to initialize the database');
    }
}

module.exports = { dbConnection };