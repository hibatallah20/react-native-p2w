import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Route PUT : compléter le profil
router.put("/complete-profile/:id", async (req, res) => {
    const { id } = req.params; // id de l'utilisateur dans l'URL
    const { bio, interests, instagram /* , profileImage */} = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Mettre à jour les champs si fournis
        user.bio = bio || user.bio;
        user.interests = interests || user.interests;
        user.instagram = instagram || user.instagram;
        /* user.profileImage = profileImage || user.profileImage; */

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                bio: user.bio,
                interests: user.interests,
                instagram: user.instagram,
               /*  profileImage: user.profileImage */
            }
        });
    } catch (error) {
        console.error("Erreur dans complete-profile :", error);
        res.status(500).json({ message: "Error server" });
    }
});

export default router;

