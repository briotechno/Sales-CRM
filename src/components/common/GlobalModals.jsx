import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UpgradePlanModal from './UpgradePlanModal';
import { hideLimitModal } from '../../store/slices/uiSlice';

const GlobalModals = () => {
    const dispatch = useDispatch();
    const { limitReached } = useSelector((state) => state.ui);

    return (
        <>
            <UpgradePlanModal
                isOpen={limitReached.isOpen}
                onClose={() => dispatch(hideLimitModal())}
                data={limitReached.data}
            />
        </>
    );
};

export default GlobalModals;
