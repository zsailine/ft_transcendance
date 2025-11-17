import { Outlet } from "react-router-dom";
import React from "react";

const PlayComponent = () => {
    return (
        <div className="">
            <Outlet />
        </div>
    );
};

const Play = React.memo(PlayComponent);

export default Play;