import { findAllUsers, findUserById, registerUser, findByCredentials, updateRole } from "../data/userData.js";

export const getUsers = async () => {
    return await findAllUsers();
}

export const getUserById = async (id) => {
    return await findUserById(id);
}

export const registerUserService = async ({ username, email, password }) => {
    try {
        return await registerUser({ username, email, password });
    } catch (error) {
        if (error.message === "El email ya está registrado") {
            // Re-lanzar para que el controller lo maneje
            throw error;
        }
        throw new Error("Error al registrar el usuario");
    }
}

export const loginUserService = async ({ email, password }) => {
    const user = await findByCredentials(email, password);
    if (!user) {
        throw new Error("Credenciales inválidas");
    }
    // No devolver password
    const { password: _pw, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export const updateUserRoleService = async ({ id, role }) => {
    const user = await findUserById(id);
    if (!user) {
        throw new Error("No se encontro el usuario");
    }
    if(!["collaborator", "supervisor"].includes(role)){
        throw new Error('Rol invalido');
    }
    // No devolver password
    return await updateRole(id, role);
}

export const getNotifications = async ({ id }) => {
    const user = await findUserById(id);
    if (!user) {
        throw new Error("No se encontro el usuario");
    }
    return user.notifications;
}