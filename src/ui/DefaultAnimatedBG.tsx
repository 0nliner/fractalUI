import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { random } from "lodash";

interface AnimatedBackgroundProps {
  gradientCount: number; // Количество радиальных градиентов
  colorRange: [string, string]; // Диапазон цветов (например, ["#FF5733", "#33FF57"])
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  gradientCount,
  colorRange,
}) => {
    return (
        <></>
    )
};

export default AnimatedBackground;