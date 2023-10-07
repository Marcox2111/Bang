import classNames from "classnames";
import React, { PropsWithChildren, useState } from "react";
import {Sidebar} from "./Sidebar";

const Layout = (props: PropsWithChildren) => {
    const [collapsed, setSidebarCollapsed] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    

    return (
        // this is the alternative in case you don't want to use classnames
        // <div className={'grid min-h-screen ' + (collapsed ? 'grid-cols-sidebar-collapsed' : 'grid-cols-sidebar') + ' transition-[grid-template-columns] duration-300 ease-in-out'}>
        //     {/* ... */}
        // </div>

        <div
            className={classNames({
                "grid bg-gray-100 min-h-screen": true,
                "grid-cols-sidebar": !collapsed,
                "grid-cols-sidebar-collapsed": collapsed,
                "transition-[grid-template-columns] duration-300 ease-in-out": true,
            })}
        >
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setSidebarCollapsed}
                shown={showSidebar}
            />
            <div className="">
                {props.children}
            </div>
        </div>
    );
};

export default Layout;