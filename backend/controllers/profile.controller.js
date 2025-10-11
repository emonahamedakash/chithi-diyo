const db = require("../config/db");

const getProfileDetails = async (req, res) => {
    try {
        const { user_id } = req.query;
        console.log("userid: ", user_id);
        if (!user_id) {
            return res.status(400).json({
                flag: "FAIL",
                message: "User id required"
            })
        }
        const userDetails = await db("users")
            .select("id", "email", "facebook", "user_name")
            .where("id", parseInt(user_id))
            .first();
        if (!userDetails) {
            return res.status(404).json({
                flag: "FAIL",
                message: "No user Found"
            })
        }
        res.status(200).json({
            flag: "SUCCESS",
            message: "User details fetch successfully",
            details: userDetails
        })
    } catch (err) {
        console.log(err);
    }
}

const updatePassword = async (req, res) => {
    try {
        const { user_id, current_password, new_password } = req.body;

        if (!user_id || !current_password || !new_password) {
            return res.status(400).json({
                flag: "FAIL",
                message: "User ID, Current Password and New Password required"
            });
        }

        const baseQuery = await db("users")
            .select("*")
            .where("id", parseInt(user_id))
            .first();

        if (!baseQuery) {
            return res.status(404).json({
                flag: "FAIL",
                message: "No user found",
            });
        }

        if (baseQuery.password !== current_password) {
            return res.status(400).json({
                flag: "FAIL",
                message: "Current password is not correct"
            });
        }
        const updatingPassword = await db("users")
            .update({
                password: new_password
            })
            .where("id", parseInt(user_id));

        if (!updatingPassword) {
            return res.status(400).json({
                flag: "FAIL",
                message: "Something went wrong in database"
            });
        }

        res.status(204).json({
            flag: "SUCCESS",
            message: "Password updated successfully"
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports = { getProfileDetails, updatePassword };