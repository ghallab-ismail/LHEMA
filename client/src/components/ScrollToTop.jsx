import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Track pageview on route change
        ReactGA.send({ hitType: "pageview", page: pathname });
        ReactPixel.pageView();
    }, [pathname]);

    return null;
};

export default ScrollToTop;
