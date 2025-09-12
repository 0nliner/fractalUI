import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { memo, useState } from "react";

export type AccordionProps = {
    children: React.ReactNode;
    title: string,
    isOpenedDefault?: boolean
}

export const Accordion = memo(({ children, title, isOpenedDefault = false }: AccordionProps) => {
    const [isOpened, setIsOpened] = useState(isOpenedDefault);
    return (
        <div>
            <div className="accordion"
                onClick={() => setIsOpened(!isOpened)}
                style={{
                    display: "flex",
                    justifyContent: "space-betwwen",
                    alignContent: "center"
                }}>
                <div>
                    {title}
                </div>
                <div>
                    {isOpened ? <ArrowDropDown /> : <ArrowDropUp />}
                </div>
            </div>
            {isOpened ? children : null}
        </div>
    );
})