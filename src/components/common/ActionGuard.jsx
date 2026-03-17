import React from 'react';
import usePermission from '../../hooks/usePermission';
import { useSelector } from 'react-redux';

/**
 * ActionGuard Component
 * 
 * Wraps action buttons (Add, Edit, Delete) to handle permission-based disabling and tooltips.
 * 
 * @param {string} permission - The specific permission ID to check (e.g., "leads_delete")
 * @param {string} module - The module name for usePermission hook (e.g., "Leads")
 * @param {string} type - Permission type: 'create', 'read', 'update', 'delete'
 * @param {string} tooltipMsg - Custom message for the tooltip when disabled
 * @param {React.ReactNode} children - The button or element to wrap
 */
const ActionGuard = ({ permission, module, type, tooltipMsg, children }) => {
    const { user } = useSelector((state) => state.auth);
    const permissions = usePermission(module);
    
    // Super Admin and Admin have full access
    const isFullAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';
    
    // Check permission based on either individual ID or module-type
    let hasPermission = false;
    
    if (isFullAdmin) {
        hasPermission = true;
    } else {
        if (permission) {
            // Check specific ID
            const userPerms = user?.permissions || [];
            hasPermission = Array.isArray(userPerms) ? userPerms.includes(permission) : false;
        } else if (module && type) {
            // Check via usePermission hook (e.g., type='create' for 'Leads')
            hasPermission = permissions[type] === true;
        }
    }

    // Default tooltip message
    const defaultMsg = "You don't have permission to perform this action. Contact Administrator.";
    const activeTooltip = hasPermission ? "" : (tooltipMsg || defaultMsg);

    // If it's a single child, we can clone it and add props
    if (React.isValidElement(children)) {
        return React.cloneElement(children, {
            disabled: children.props.disabled || !hasPermission,
            title: activeTooltip || children.props.title,
            className: `${children.props.className || ''} ${!hasPermission ? 'opacity-50 grayscale cursor-not-allowed pointer-events-auto' : ''}`,
            // We use pointer-events-auto to ensure title/tooltip works even when disabled
            onClick: hasPermission ? children.props.onClick : (e) => e.preventDefault(),
        });
    }

    return <span title={activeTooltip} className={!hasPermission ? 'opacity-50 grayscale cursor-not-allowed' : ''}>{children}</span>;
};

export default ActionGuard;
