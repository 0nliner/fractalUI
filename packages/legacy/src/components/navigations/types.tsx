type NavigationItemsBlockProps = {
    title: string;
    elements: NavigationItemProps[];
};

type NavigationItemProps = {
    icon?: any;
    title: string;
    link?: string;
    onClick?: any;
    Component?: any;
    extraProps?: Record<string, any>;
};

type NavigationProps = {
    navigationItems?: NavigationItemProps[] | NavigationItemsBlockProps[];
    children?: React.ReactNode;
};

function isNavigationItemsBlockPropsArray(
    items: NavigationItemProps[] | NavigationItemsBlockProps[]
): items is NavigationItemsBlockProps[] {
    // Проверяем, что у первого элемента есть поле elements
    return (
        Array.isArray(items) &&
        items.length > 0 &&
        "elements" in items[0] &&
        Array.isArray((items[0] as NavigationItemsBlockProps).elements)
    );
}

export type { NavigationItemProps };
export type { NavigationItemsBlockProps };
export type { NavigationProps };

export { isNavigationItemsBlockPropsArray };
