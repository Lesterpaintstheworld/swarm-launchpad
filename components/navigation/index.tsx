'use client'

import useScreenSize from "@/hooks/useScreenSize";
import { DesktopNavigation } from "./desktop"
import { MobileNavigation } from "./mobile";

const Navigation = () => {

    const { width } = useScreenSize();

    if (!width) return <></>;

    if (width < 800) {
        return <MobileNavigation />;
    }

    return <DesktopNavigation />;
};

export { Navigation };