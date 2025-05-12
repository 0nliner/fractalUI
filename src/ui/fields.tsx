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
    label?: string;
    description?: string;
    lablePosition?: "top" | "left" | "disabled";
    wrapperStyle?: CSSProperties;
    inputStyle?: CSSProperties;
};

const UpdatableField: React.FC<UpdatableFieldProps> = (props) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>(props.defaultValue ?? "");

    const [showDescription, setShowDescription] = useState(false);

    const DescriptionContent = useMemo(
      () => (
      <div style={{ borderRadius: "13px", color: "gray", padding: "5px", maxWidth: "200px", fontSize: "0.7em"}}>
        { props.label ?? <div>Название поля: {props.label}</div>}
        { props.description?? <div>{props.description}</div>}
        { value ?? <div style={{ color: "gray" }}>{props.defaultValue ?? "Пусто"}</div>}
      </div>),
      [props.label]
    );

    // Ссылка на input для фокуса
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Обработчик нажатия клавиши Enter
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Предотвращаем стандартное поведение Enter
            setIsEditing(false); // Переключаем состояние isEditing на false
        }
    };

    // Обработчик изменения значения
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    // При переходе в режим редактирования фокусируем input
    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
        else if (isEditing === false && props.defaultValue !== value) {
            props.onSave(value);
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    justifyContent: "space-between",
                    ...(props.wrapperStyle ?? {})
                }}
                onMouseEnter={() => setShowDescription(true)}
                onMouseLeave={() => setShowDescription(false)}>
                {showDescription?
                  DescriptionContent
                }
                <input
                    ref={inputRef} // Присваиваем ссылку для фокуса
                    value={value} // Используем controlled component
                    onChange={handleChange} // Обрабатываем изменения
                    onKeyDown={handleKeyDown} // Обрабатываем нажатие клавиш
                    style={{ ...inputStyle, ...(props.inputStyle ?? {}) }}
                />
                <Done
                    style={{ width: "16px", height: "16px", color: "#5f5f5f" }}
                    onClick={() => setIsEditing(false)}
                />
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
                    cursor: "pointer", // Добавляем курсор для указания возможности редактирования
                    ...(props.wrapperStyle ?? {})
                }}
                onClick={() => setIsEditing(true)} // Переход в режим редактирования при клике
            >
                <div>{value}</div>
                <Edit
                    style={{ width: "16px", height: "16px", color: "#5f5f5f" }}
                    onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем распространение события
                        setIsEditing(true); // Переход в режим редактирования
                    }}
                />
            </div>
        );
    }
};



// Определяем интерфейс для ref-объекта
export type UpdatableComponentRef = {
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
};

type UpdatableComponentProps = {
  children: React.ReactNode;
  onSave?: () => Promise<void>
};

// Используем forwardRef для передачи ref
const UpdatableComponent = forwardRef<UpdatableComponentRef, UpdatableComponentProps>(
  ({ children, onSave }, ref) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Создаём ref-интерфейс
    useImperativeHandle(ref, () => ({
      isEditing,
      startEditing: () => setIsEditing(true),
      stopEditing: () => setIsEditing(false),
    }));

    const handleOnSave = async () => {
      setIsEditing(false)
      onSave?? await onSave()
    }

    return (
      <div
        // @ts-ignore
        ref={ref} // Передаём ref в корневой элемент
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
          // ...(isEditing && { outline: '2px dashed #5f5f5f' }), // Визуальное выделение редактирования
        }}
        // onKeyDown={handleKeyDown}
        tabIndex={isEditing ? 0 : -1} // Для возможности фокусировки при редактировании
      >
        {isEditing ? (
          <div
            style={{
              outline: 'none',
              flexGrow: 1,
              padding: '5px',
            }}
          >
            {children}
          </div>
        ) : (
          <div
              style={{
                position: 'relative',
                width: "100%"
              }}
              onClick={() => setIsEditing(true)}>
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
            style={{
              width: '16px',
              height: '16px',
              color: '#5f5f5f',
            }}
            onClick={handleOnSave}
          />
        )}
      </div>
    );
  }
);


export { UpdatableField, UpdatableComponent };