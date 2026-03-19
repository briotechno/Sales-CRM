import React, { useId } from 'react';
import usePermission from '../../hooks/usePermission';
import { useSelector } from 'react-redux';
import { Lock } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

/**
 * ActionGuard Component
 * 
 * Wraps action buttons (Add, Edit, Delete) to handle permission-based disabling and tooltips.
 */
const ActionGuard = ({ permission, module, type, tooltipMsg, children }) => {
    const { user } = useSelector((state) => state.auth);
    const permissions = usePermission(module);
    const tooltipId = useId();

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

    if (!hasPermission) {
        // Styled as disabled
        const disabledClasses = "opacity-50 grayscale cursor-not-allowed pointer-events-auto transition-all duration-300 transform active:scale-100";

        // Prepare the cloned children or fallback with disabled appearance
        // We use pointer-events-auto even when visually disabled so tooltips can fire
        const wrappedChild = React.isValidElement(children)
            ? React.cloneElement(children, {
                disabled: true,
                "data-tooltip-id": tooltipId,
                className: `${children.props.className || ''} ${disabledClasses}`,
                onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                },
            })
            : <span
                data-tooltip-id={tooltipId}
                className={disabledClasses}
            >
                {children}
            </span>;

        return (
            <>
                {wrappedChild}

                <Tooltip
                    id={tooltipId}
                    place="bottom"
                    className="z-[9999] !bg-transparent !p-0 !opacity-100 !shadow-none"
                    style={{ backgroundColor: 'transparent', padding: 0 }}
                >
                    <div className="relative px-4 py-3 bg-[#FFFBF5] border border-orange-200 rounded-xl shadow-[0_10px_30px_rgba(255,123,29,0.12)] flex items-center gap-3.5 animate-fadeIn">
                        {/* Orange Themed Icon Container */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-orange-100/80 flex items-center justify-center border border-orange-200 shadow-sm">
                            <Lock size={16} className="text-[#FF7B1D]" />
                        </div>

                        <div className="flex flex-col pr-1 pt-0.5">
                            <span className="font-bold text-[14px] capitalize  text-[#FF7B1D] leading-none mb-1.5 opacity-90">Access Restricted</span>
                            <span className="font-semibold text-[13px] text-orange-950/80 tracking-tight leading-none whitespace-nowrap">
                                {tooltipMsg || defaultMsg}
                            </span>
                        </div>

                        {/* Top Indicator Arrow */}
                        <div className="absolute top-[-7px] left-1/2 -translate-x-1/2 border-[7px] border-transparent border-b-[#FFFBF5] drop-shadow-[0_-1px_0_rgba(251,146,60,0.15)]" />
                    </div>
                </Tooltip>
            </>
        );
    }

    // If has permission, just return children as they are
    return children;
};

export default ActionGuard;
