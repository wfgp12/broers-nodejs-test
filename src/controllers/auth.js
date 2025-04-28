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
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Password Recovery</title>
                </head>
                <body style="background-color: #f7f7f7; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 50px auto; padding: 30px; background-color: #ffffff; border-radius: 8px; text-align: center; font-family: Arial, sans-serif; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333;">Recuperar contraseña</h2>
                        <p style="color: #666; font-size: 16px;">
                            Hemos recibido una solicitud para restablecer tu contraseña.
                        </p>
                        <p style="color: #666; font-size: 16px;">
                            Haz clic en el siguiente enlace para establecer una nueva contraseña:
                        </p>
                        <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Restablecer contraseña
                        </a>
                        <p style="margin-top: 30px; font-size: 12px; color: #999;">
                            Si no solicitaste este cambio, puedes ignorar este correo.
                        </p>
                    </div>
                </body>
                </html>

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
