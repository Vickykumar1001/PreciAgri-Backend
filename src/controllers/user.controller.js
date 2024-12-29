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
const getMyProducts = async (req, res) => {
    try {
        const userId = req.user._id; // Extract the user ID from the authenticated request
        const products = await userService.getMyProducts(userId);
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch products',
        });
    }
};
const addUserAddress = async (req, res) => {
    try {

        const address = await userService.addUserAddress(req)
        return res.status(200).send(address)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; // Extract user ID from the authenticated token

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required.' });
        }

        await userService.changePassword(userId, oldPassword, newPassword);

        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
const editProfile = async (req, res) => {
    const userId = req.user.id; // Assuming you're using authentication middleware to populate `req.user`
    const { firstName, lastName, mobile } = req.body;

    try {
        const updatedUser = await userService.updateUserProfile(userId, { firstName, lastName, mobile });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getUserProfile, getAllUsers, addUserAddress, getUserAddress, getSellerDetail, changePassword, getMyProducts, editProfile }