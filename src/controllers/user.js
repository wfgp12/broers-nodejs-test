const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

module.exports = {
    createUser: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    ok: false,
                    msg: 'User already exists'
                });
            }

            user = new User({ name, email, password });

            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);

            await user.save();

            const token = await generateJWT(user._id, user.name, user.email);

            res.status(201).json({
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
    updateUser: async (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;

        try {
            let user = await User.findById(id);
            if (!user || !user.isActive) {
                return res.status(404).json({
                    ok: false,
                    msg: 'User not found'
                });
            }

            let isUpdate = false;

            if (email && email !== user.email) {
                let emailExists = await User.findOne({ email });
                if (emailExists) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'This email is already in use'
                    });
                }
                user.email = email;
                isUpdate = true;
            }

            if (name) {
                user.name = name;
                isUpdate = true;
            }

            let token = isUpdate
                ? await generateJWT(user._id, user.name, user.email)
                : req.header('x-token');


            await user.save();

            res.json({
                ok: true,
                user: {
                    uid: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Internal server error'
            });
        }
    },
    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id, "name email createdAt");

            if (!user || !user.isActive) {
                return res.status(404).json({
                    ok: false,
                    msg: "User not found"
                });
            }

            res.status(200).json({
                ok: true,
                user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: "Internal server error"
            });
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.find({isActive: true}, "name email createdAt");
            res.status(200).json({
                ok: true,
                users
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: "Internal server error"
            });
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id);

            if (!user || !user.isActive) {
                return res.status(404).json({
                    ok: false,
                    msg: 'User not found or already inactive'
                });
            }

            user.isActive = false;
            await user.save();

            res.status(200).json({
                ok: true,
                msg: 'User deleted',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Internal server error'
            });
        }
    }
}