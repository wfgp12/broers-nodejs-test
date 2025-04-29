const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');;

const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const { sendEmail } = require("../helpers/sendEmail");

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Internal server error'
            });
        }

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
            const resetLink = `${process.env.FRONTEND_URL}/api/auth/reset-password/${token}`;

            //TODO: mover template a un archivo externo
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
    showResetPasswordForm: async (req, res) => {
        const token = req.params.token;

        //TODO: mover template a un archivo externo
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de Contraseña</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 400px;
                    }
                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .input-group {
                        margin-bottom: 15px;
                        }
                        .input-group input {
                            width: 100%;
                        padding: 10px;
                        font-size: 14px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .btn {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 15px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                        font-size: 16px;
                        }
                        .btn:hover {
                            background-color: #45a049;
                            }
                            </style>
                            </head>
                            <body>
                            
                <div class="container">
                <h2>Recuperar Contraseña</h2>
                <form action="/api/auth/reset-password/${token}" method="POST">
                        <div class="input-group">
                        <input type="password" name="newPassword" placeholder="Nueva Contraseña" required>
                        </div>
                        <button type="submit" class="btn">Cambiar Contraseña</button>
                        </form>
                        </div>
                        
            </body>
            </html>
            `;

        res.send(htmlContent);
    },
    resetPassword: async (req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            const { uid } = jwt.verify(token, process.env.SECRET_KEY);

            const user = await User.findById(uid);
            if (!user || !user.isActive) {
                return res.status(400).json({
                    ok: false,
                    msg: 'User not found'
                });
            }

            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(newPassword, salt);

            await user.save();

            //TODO: mover template a un archivo externo
            const successHtml = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contraseña Actualizada</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .container {
                            background-color: white;
                            padding: 2rem;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            width: 100%;
                            max-width: 400px;
                            text-align: center;
                        }
                        h2 {
                            color: #4CAF50;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>¡Contraseña actualizada exitosamente!</h2>
                        <p>Ahora puedes iniciar sesión con tu nueva contraseña.</p>
                    </div>
                </body>
                </html>
            `;

            res.send(successHtml);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error updating password',
            });
        }
    },
    renewToken: async (req, res) => {
        const { uid, name, email } = req.user;

        try {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Internal server error',
            });
        }

    }
}
