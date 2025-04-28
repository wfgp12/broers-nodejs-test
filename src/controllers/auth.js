const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        let user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'User or password is incorrect'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'User or password is incorrect'
            });
        }

        const token = await generateJWT(user._id, user.name, user.email);
        
        res.json({
            ok: true,
            token,
            user: {
                uid: user._id,
                name: user.name,
                email: user.email
            }
        });
    },
    renewToken: async(req, res) => {
        const { uid, name , email } = req.user;

        const token = await generateJWT(uid, name, email);
        res.json({
            ok: true,
            token,
            user: {
                uid,
                name,
                email
            }
        });
    }
}
