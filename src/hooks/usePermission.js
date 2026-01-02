import { useSelector } from 'react-redux';

/**
 * Custom hook to check user permissions for a specific module.
 * @param {string} moduleName - The name of the module to check permissions for (must match keys in user.permissions).
 * @returns {object} - An object containing boolean values for { create, read, update, delete }.
 */
const usePermission = (moduleName) => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return { create: false, read: false, update: false, delete: false };
    }

    // Super Admin and Admin have full access
    if (user.role === 'Super Admin' || user.role === 'Admin') {
        return { create: true, read: true, update: true, delete: true };
    }

    // Employee Access Check
    if (user.role === 'Employee') {
        let perms = user.permissions;

        // Parse if string (legacy handling, though Redux should typically store it parsed)
        if (typeof perms === 'string') {
            try {
                perms = JSON.parse(perms);
            } catch (e) {
                console.error("Failed to parse permissions in usePermission hook", e);
                return { create: false, read: false, update: false, delete: false };
            }
        }

        if (!perms || typeof perms !== 'object') {
            return { create: false, read: false, update: false, delete: false };
        }

        const modulePerms = perms[moduleName];

        if (!modulePerms) {
            return { create: false, read: false, update: false, delete: false };
        }

        return {
            create: !!modulePerms.create,
            read: !!modulePerms.read,
            update: !!modulePerms.update,
            delete: !!modulePerms.delete,
        };
    }

    return { create: false, read: false, update: false, delete: false };
};

export default usePermission;
