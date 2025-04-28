const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const { sendEmail } = require("../helpers/sendEmail");

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
    passwordRecovery: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email, isActive: true });
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    msg: 'User not found'
                });
            }

            const token = await generateJWT(user._id, user.name, user.email);
            const resetLink = `${process.env.FRONTEND_URL}/recovery-password/${token}`;

            const htmlContent = `
            <h3>Password Recovery</h3>
            <p>Click the following link to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
        `;

            await sendEmail(user.email, "Password Recovery", htmlContent);

            res.status(200).json({
                ok: true,
                msg: 'Email sent. Check your inbox!'
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Error to recover password'
            });
        }
    },
    renewToken: async (req, res) => {
        const { uid, name, email } = req.user;

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
