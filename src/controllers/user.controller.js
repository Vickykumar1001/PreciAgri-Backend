const userService = require("../services/user.service")

const getUserProfile = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(' ')[1];

        if (!jwt) {
            return res.status(404).send({ error: "token not found" })
        }
        const user = await userService.getUserProfileByToken(jwt)

        return res.status(200).send(user)


    } catch (error) {
        console.log("error from controller - ", error)
        return res.status(500).send({ error: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const getUserAddress = async (req, res) => {
    try {

        const address = await userService.getUserAddress(req)
        return res.status(200).send(address)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const getSellerDetail = async (req, res) => {
    try {

        const detail = await userService.getSellerDetail(req)
        return res.status(200).send(detail)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const addUserAddress = async (req, res) => {
    try {

        const address = await userService.addUserAddress(req)
        return res.status(200).send(address)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = { getUserProfile, getAllUsers, addUserAddress, getUserAddress, getSellerDetail }