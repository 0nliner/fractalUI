import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// конпонент генерирующий иконку по uuid. Иконка - это радиальный градиент
// примеры использования: иконка пользователя может быть 
// сгенерирована из id пользователя


// Функция для преобразования UUID в цвет
const uuidToColor = (uuid: string): string => {
    const hex = uuid.slice(0, 6);
    return `#${hex}`;
};

// Функция для генерации радиального градиента
const generateRadialGradient = (uuid1?: string, uuid2?: string): string => {
    const uuid1_ = uuid1 || uuidv4();
    const uuid2_ = uuid2 || uuidv4();
    const color1 = uuidToColor(uuid1_);
    const color2 = uuidToColor(uuid2_);
    return `radial-gradient(circle, ${color1}, ${color2})`;
};

// Компонент с градиентом
const GradientComponent: React.FC = (uuid1?: string, uuid2?: string) => {
    const [gradient, setGradient] = useState<string>('');

    // Генерируем градиент при монтировании компонента
    useEffect(() => {
        setGradient(generateRadialGradient(uuid1, uuid2));
    }, []);

    return (
        <div
            style={{
                width: '32px',
                height: '32px',
                background: gradient,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            }}>
        </div>
    );
};

export default GradientComponent;