import { useSelector } from 'react-redux';
import { permissionCategories } from '../pages/EmployeePart/permissionsData';

/**
 * Custom hook to check user permissions for a specific module or action.
 * @param {string} moduleName - The name of the module (e.g., "Leads Management") 
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

        // Parse if string
        if (typeof perms === 'string') {
            try {
                perms = JSON.parse(perms);
            } catch (e) {
                return { create: false, read: false, update: false, delete: false };
            }
        }

        if (!perms) {
            return { create: false, read: false, update: false, delete: false };
        }

        // NEW Flat Array Logic
        if (Array.isArray(perms)) {
            const categoryPerms = permissionCategories[moduleName] || [];

            const hasAction = (actionKeywords) => {
                return categoryPerms.some(cp =>
                    actionKeywords.some(keyword => cp.id.includes(keyword)) &&
                    perms.includes(cp.id)
                );
            };

            return {
                create: hasAction(['create', 'add', 'submit']),
                read: hasAction(['view', 'read', 'list', 'use']),
                update: hasAction(['edit', 'update', 'manage', 'configure', 'assign', 'approve']),
                delete: hasAction(['delete', 'remove', 'cancel']),
                // Direct access for custom checks
                hasPermission: (actionId) => perms.includes(actionId)
            };
        }

        // OLD Object Structure Logic (Fallback)
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
