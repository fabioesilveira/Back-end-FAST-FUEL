const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/jwt");


const {
    findUserByEmail,
    createNewUser,
    findAllUsersAdmin,
    findAllNormalUsers,
    findUserById,
    deleteUserById,
    updateUserPassword,

    setEmailVerificationToken,
    findUserByVerificationToken,
    verifyUserEmail,

    setPasswordResetToken,
    findUserByPasswordResetToken,
    clearPasswordResetToken,
} = require("../models/userModel");

const {
    sendEmailVerification,
    sendPasswordResetEmail,
} = require("./emailService");

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

async function postUserService(fullName, phone, email, password) {
    const e = String(email || "").trim().toLowerCase();

    const existing = await findUserByEmail(e);

    if (existing.length > 0) {
        return {
            msg: "User already exists",
            status: 409,
        };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await createNewUser(
        fullName,
        phone,
        e,
        hashedPassword
    );

    const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

    const verificationTokenHash = hashToken(verificationToken);

    const verificationExpires = new Date(
        Date.now() + 60 * 60 * 1000
    );

    await setEmailVerificationToken(
        result.insertId,
        verificationTokenHash,
        verificationExpires
    );

    try {
        await sendEmailVerification({
            customerName: fullName,
            customerEmail: e,
            verificationToken,
        });
    } catch (error) {
        console.error(
            "Email verification failed:",
            error
        );

        return {
            ...result,
            msg: "Account created, but verification email could not be sent.",
            emailSent: false,
        };
    }

    return {
        ...result,
        msg: "Account created. Please verify your email.",
        emailSent: true,
    };
}

async function verifyUserEmailService(token) {
    if (!token) {
        return {
            msg: "Verification token is required",
            status: 400,
        };
    }

    const tokenHash = hashToken(token);

    const rows = await findUserByVerificationToken(tokenHash);

    const user = rows[0];

    if (!user) {
        return {
            msg: "Verification link is invalid or has expired",
            status: 400,
        };
    }

    await verifyUserEmail(user.id);

    return {
        msg: "Email verified successfully",
    };
}

async function resendEmailVerificationService(email) {
    const e = String(email || "").trim().toLowerCase();

    const rows = await findUserByEmail(e);
    const user = rows[0];

    if (!user) {
        return {
            msg: "User not found",
            status: 404,
        };
    }

    if (user.email_verified) {
        return {
            msg: "Email is already verified",
            status: 400,
        };
    }

    const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

    const verificationTokenHash = hashToken(verificationToken);

    const verificationExpires = new Date(
        Date.now() + 60 * 60 * 1000
    );

    await setEmailVerificationToken(
        user.id,
        verificationTokenHash,
        verificationExpires
    );

    await sendEmailVerification({
        customerName: user.fullName,
        customerEmail: user.email,
        verificationToken,
    });

    return {
        msg: "Verification email sent successfully",
    };
}

async function forgotPasswordService(email) {
    const e = String(email || "").trim().toLowerCase();

    const rows = await findUserByEmail(e);
    const user = rows[0];

    if (!user) {
        return {
            msg: "If an account exists with this email, a password reset link has been sent.",
        };
    }

    const resetToken = crypto
        .randomBytes(32)
        .toString("hex");

    const resetTokenHash = hashToken(resetToken);

    const resetExpires = new Date(
        Date.now() + 30 * 60 * 1000
    );

    await setPasswordResetToken(
        user.id,
        resetTokenHash,
        resetExpires
    );

    await sendPasswordResetEmail({
        customerName: user.fullName,
        customerEmail: user.email,
        resetToken,
    });

    return {
        msg: "If an account exists with this email, a password reset link has been sent.",
    };
}

async function resetPasswordService(token, newPassword) {
    if (!token || !newPassword) {
        return {
            msg: "Token and new password are required",
            status: 400,
        };
    }

    const isValidPassword =
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
            String(newPassword)
        );

    if (!isValidPassword) {
        return {
            msg: "Password must be at least 8 characters long and contain at least one letter and one number.",
            status: 400,
        };
    }

    const tokenHash = hashToken(token);

    const rows = await findUserByPasswordResetToken(tokenHash);
    const user = rows[0];

    if (!user) {
        return {
            msg: "Password reset link is invalid or has expired",
            status: 400,
        };
    }

    const isSamePassword = await bcryptjs.compare(
        String(newPassword),
        user.password
    );

    if (isSamePassword) {
        return {
            msg: "New password cannot be the same as your current password.",
            status: 400,
        };
    }

    const hashedPassword = await bcryptjs.hash(
        String(newPassword),
        10
    );

    await updateUserPassword(
        user.id,
        hashedPassword
    );

    await clearPasswordResetToken(user.id);

    return {
        msg: "Password updated successfully",
    };
}

async function postUserLoginService(email, password) {
    const e = String(email || "").trim().toLowerCase();

    const rows = await findUserByEmail(e);
    const user = rows[0];

    if (!user) return { msg: "User not found" };

    if (!user.email_verified) {
        return {
            msg: "Please verify your email before signing in",
            status: 403,
        };
    }

    const ok = await bcryptjs.compare(password, user.password);
    if (!ok) return { msg: "Invalid Password" };

    const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        type: user.type || "normal",
    };

    const token = generateToken(payload);

    return { ...payload, token };
}

async function getAdminUsersService() {
    const users = await findAllUsersAdmin();
    return users;
}

async function getNormalUsersService() {
    const users = await findAllNormalUsers();
    return users;
}

async function removeOwnUserService(userId) {
    const result = await deleteUserById(userId);

    if (!result.affectedRows) {
        return { msg: "User not found", status: 404 };
    }

    return {
        affectedRows: result.affectedRows,
        msg: "User deleted",
    };
}

async function adminUpdateUserPasswordService(userId, password) {
    if (!password) {
        return { msg: "Password is required", status: 400 };
    }

    const hashed = await bcryptjs.hash(String(password), 10);

    const result = await updateUserPassword(userId, hashed);

    if (!result.affectedRows) {
        return { msg: "User not found", status: 404 };
    }

    return {
        affectedRows: result.affectedRows,
        msg: "Password updated",
    };
}

async function getUserByIdService(requestedId, loggedUser) {
    const isSelf = String(loggedUser.id) === String(requestedId);
    const isAdmin = loggedUser.type === "admin";

    if (!isSelf && !isAdmin) {
        return { msg: "Permission denied", status: 403 };
    }

    const rows = await findUserById(requestedId);

    if (!rows || rows.length === 0) {
        return { msg: "User not found", status: 404 };
    }

    return rows[0];
}

module.exports = {
    postUserService,
    verifyUserEmailService,
    resendEmailVerificationService,

    forgotPasswordService,
    resetPasswordService,

    postUserLoginService,
    getAdminUsersService,
    getNormalUsersService,
    removeOwnUserService,
    adminUpdateUserPasswordService,
    getUserByIdService,
};