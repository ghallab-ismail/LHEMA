import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomCursor from '../components/CustomCursor';
import WhatsAppButton from '../components/WhatsAppButton';

const PublicLayout = () => {
    return (
        <>
            <CustomCursor />
            <WhatsAppButton />
            <Outlet />
        </>
    );
};

export default PublicLayout;
