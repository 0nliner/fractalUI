import { Routes, Route } from "react-router-dom";
import { PageConfig } from "../../contentWrappers/types";
import React from "react";
import { generateContentApapterComponent } from "../../contentWrappers/utils";


export type PageSwitcherProps = {
    pagesConfigs: PageConfig[];
}

const PageSwitcher: React.FC<PageSwitcherProps> = ({ pagesConfigs }) => {
    return (
        <>
            <Routes>
                { pagesConfigs.map((pageConfig) => {
                    const PageComponent = generateContentApapterComponent(pageConfig).Component;
                    return <Route key={pageConfig.pageURI} path={pageConfig.pageURI} element={<PageComponent/>} />
                }
                )}
            </Routes>
        </>
    );
};

export default PageSwitcher;
