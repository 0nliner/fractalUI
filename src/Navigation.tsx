import { Card } from "@mui/material";
// хуйня, потом сделаем
type NavigationItemProps = {
    icon?: any;
    title: string;
    link: string;
    navigate: (link: string) => void;
    onClick: any;
};

const NavigationItem: React.FC<NavigationItemProps> = (props) => {
    // const [isActive, setIsActive]
    const handleClick = () => {
        props.onClick ? props.onClick() : null;
        props.navigate(props.link);
    };
    return (
        <Card onClick={handleClick} style={{ width: "100%", display: "flex", justifyContent: "left" }}>
            {props.icon ? props.icon : null}
            {props.title}
        </Card>
    );
};

export type { NavigationItemProps };
export { NavigationItem };
