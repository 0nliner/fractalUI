import { Done, Edit } from "@mui/icons-material";
import React, { CSSProperties, forwardRef, useImperativeHandle, useMemo, useState } from "react";

export const inputStyle = {
    padding: 0,
    margin: 0,
    border: "none",
    color: "white",
    background: "none",
    fontSize: "1em",
    height: "24px",
    borderRadius: "6px",
    outline: "none"
};

export type UpdatableFieldProps = {
    defaultValue?: string;
    onSave: (value: string) => void;
    description?: string;

    label?: string;
    lablePosition?: "top" | "left" | "disabled";
    labelStyle?: "labelSecondary" | "labelPrimary",

    wrapperStyle?: CSSProperties;
    inputStyle?: CSSProperties;
    disablePenIcon?: boolean;
    disableSaveIcon?: boolean;
};


const UpdatableField: React.FC<UpdatableFieldProps> = (props) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>(props.defaultValue ?? "");
    const [showDescription, setShowDescription] = useState(false);

    const DescriptionContent = React.useMemo(
        () => (
            <div style={{ borderRadius: "6px",
                          color: "gray",
                          padding: "5px",
                          maxWidth: "200px",
                          fontSize: "0.7em",
                          backgroundColor: "black",
                          position: "absolute",
                          top: 20,
                          zIndex: 1000,
                          display: "flex",
                          flexDirection: "column",
                          gap: 5
                        }}
                          >
                {props.label ?<div>Название поля: {props.label}</div> : null}
                {props.description ? <div>Описание: {props.description}</div> : null}
                {value ? <div style={{ color: "gray" }}>Значение: {props.defaultValue ?? "Пусто"}</div> : null}
            </div>
        ),
        [props.label]
    );

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setIsEditing(false);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setValue(props.defaultValue ?? "");
            setIsEditing(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        } else if (isEditing === false && props.defaultValue !== value) {
            props.onSave(value);
        }
    }, [isEditing]);

    const labelSecondary = useMemo<CSSProperties>(()=>({
      fontSize: '0.7em',
      color: "#6a7575"
    }), [])

    const labelPrimary = useMemo<CSSProperties>(()=>({
      fontSize: '1em',
      color: "white"
    }), [])


    const labelStyle = useMemo(() => (props.labelStyle === "labelSecondary" ? labelSecondary : labelPrimary), [props.labelStyle]);

    if (isEditing) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    justifyContent: "space-between",
                    position: "relative",
                    ...(props.wrapperStyle ?? {})
                }}
                onMouseEnter={() => {setShowDescription(true)}}
                onMouseLeave={() => {setShowDescription(false)}}>
                {showDescription && DescriptionContent}

                <div style={{display: "flex", gap: 10}}>
                  {props.label && props.lablePosition !== "left" ? (
                    <div style={labelStyle}>
                      {props.label}
                    </div>
                  ) : null}
                  {/* {(props.label && props.lablePosition !== "top") ?? (
                    <div style={labelStyle}>
                      {props.label}
                    </div>)
                  } */}
                  <input
                      ref={inputRef}
                      value={value}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      style={{ ...inputStyle, ...(props.inputStyle ?? {}) }}
                  />
                </div>
                {props.disableSaveIcon?null:
                    <Done
                        style={{ width: "16px", height: "16px", color: "#5f5f5f" }}
                        onClick={() => setIsEditing(false)}
                    />
                }
            </div>
        );
    } else {
        return (
            <div
                style={{
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "none",
                    color: "white",
                    background: "none",
                    fontSize: "1em",
                    borderRadius: "6px",
                    cursor: "pointer",
                    position: "relative",
                    ...(props.wrapperStyle ?? {})
                }}
                onMouseEnter={() => setShowDescription(true)}
                onMouseLeave={() => setShowDescription(false)}
                onClick={() => setIsEditing(true)}
            >
                {showDescription && DescriptionContent}

                <div style={{display: "flex", gap: 10}}>
                  {props.label && props.lablePosition === "left" ? (
                    <div style={labelStyle}>
                      {props.label}
                    </div>
                  ) : null}
                  <div style={props.inputStyle ?? {}}>{value}</div>
                </div>
                {
                    props.disablePenIcon?null:
                    <Edit
                        style={{ width: "16px", height: "16px", color: "#5f5f5f" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                    />
                }
            </div>
        );
    }
};

export type UpdatableComponentRef = {
    isEditing: boolean;
    startEditing: () => void;
    stopEditing: () => void;
};

type UpdatableComponentProps = {
    children: React.ReactNode;
    onSave?: () => Promise<void>;
};

const UpdatableComponent = forwardRef<UpdatableComponentRef, UpdatableComponentProps>(
    ({ children, onSave }, ref) => {
        const [isEditing, setIsEditing] = useState<boolean>(false);

        useImperativeHandle(ref, () => ({
            isEditing,
            startEditing: () => setIsEditing(true),
            stopEditing: () => setIsEditing(false),
        }));

        const handleOnSave = async () => {
            setIsEditing(false);
            if (onSave) await onSave();
        };

        return (
            <div
                style={{
                    width: "100%",
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: 'none',
                    color: 'white',
                    background: 'none',
                    fontSize: '1em',
                    borderRadius: '6px',
                    cursor: isEditing ? 'text' : 'pointer',
                }}
                tabIndex={isEditing ? 0 : -1}
            >
                {isEditing ? (
                    <div style={{ outline: 'none', flexGrow: 1, padding: '5px' }}>
                        {children}
                    </div>
                ) : (
                    <div
                        style={{ position: 'relative', width: "100%" }}
                        onClick={() => setIsEditing(true)}
                    >
                        {children}
                        <Edit
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: '16px',
                                height: '16px',
                                color: '#5f5f5f',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                        />
                    </div>
                )}
                {isEditing && (
                    <Done
                        style={{ width: '16px', height: '16px', color: '#5f5f5f' }}
                        onClick={handleOnSave}
                    />
                )}
            </div>
        );
    }
);

export { UpdatableField, UpdatableComponent };