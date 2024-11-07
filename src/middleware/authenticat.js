const jwtProvider = require("../config/jwtProvider")
const userService = require("../services/user.service")


const authenticate = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return req.status(404).send({ message: "token not found" })
        }

        const userId = jwtProvider.getUserIdFromToken(token);

        req.user = { userId: userId };
        next()
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = authenticate;