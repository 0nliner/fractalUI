import { AnimationControls, motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";

const getRandomPosition = () => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
});

export type LavaLampBubblesProps = {
    count: number;
    colorStart: string;
    colorEnd: string;
};
// не буду удалять, просто добавлю свои свойства
export type BubbleProps = {
    properties: {
        x: number;
        y: number;
        r: number;
        colorStart: string;
        colorEnd: string;
    };
    bubbleAnimation: AnimationControls;
};

// Warning: Refactoring required
const LavaLampBubbles: React.FC<LavaLampBubblesProps> = ({ count, colorStart, colorEnd }) => {
    const controls: AnimationControls[] = [];
    const wrapper = useRef(null);

    // for (let i = 0; i < count; i ++) {
    //     const animHookResult = useAnimation();
    //     controls.push(animHookResult);
    // }
    const bubbleCount = 10;
    const bubbles: BubbleProps[] = [];
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
            properties: {
                x: Math.floor(Math.random() * 1000),
                y: Math.floor(Math.random() * 1000),
                r: 1,
                colorStart,
                colorEnd,
            },
            bubbleAnimation: useAnimation(),
        });
    }

    const getRandomPosition = (
        x: number = 0,
        y: number = 0,
        maxDistanceX: number | null = null,
        maxDistanceY: number | null = null
    ) => {
        const wrapperWidth = wrapper.current?.offsetWidth;
        const wrapperHeight = wrapper.current?.offsetHeight;
        if (maxDistanceX === null) {
            maxDistanceX = wrapperWidth;
        }
        if (maxDistanceY === null) {
            maxDistanceY = wrapperHeight;
        }
        const xRange = Math.floor(Math.random() * maxDistanceX);
        const yRange = Math.floor(Math.random() * maxDistanceY);

        x = x === 0 ? xRange : x - xRange / 2;
        y = y === 0 ? yRange : y - yRange / 2;
        x = x < 0 ? 0 : x > wrapperWidth ? wrapperWidth : x;
        y = y < 0 ? 0 : y > wrapperHeight ? wrapperHeight : y;

        return { x, y };
    };

    useEffect(() => {
        const moveBubble = async (bubble: BubbleProps) => {
            while (true) {
                const newPos = getRandomPosition(bubble.properties.x, bubble.properties.y, 600, 600);
                await bubble.bubbleAnimation.start({
                    x: newPos.x,
                    y: newPos.y,
                    transition: { duration: 5, ease: "easeInOut" },
                });
            }
        };

        for (let bubble of bubbles) {
            moveBubble(bubble);
        }
    }, []);

    return (
        <div ref={wrapper} style={{ backgroundColor: "rgba(0,0,0,0.2)", overflow: "hidden", height: "100%" }}>
            <div
                className="relative w-full h-screen flex items-center justify-center bg-black"
                style={{ filter: "blur(20px)", height: "100%" }}
            >
                <svg
                    className="absolute w-full h-full"
                    style={{ filter: "url(#Gooey)", height: "100%", width: "100%" }}
                >
                    <defs>
                        <filter id="Gooey">
                            {/* <feGaussianBlur in="SourceGraphic" stdDeviation="10" /> */}
                            {/* <feColorMatrix
                            values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 20 -10"
                        /> */}
                        </filter>
                        {/*  по сути тут должно быть описание градиентов и так много не надо */}
                        {bubbles.map((control, index) => {
                            return (
                                <radialGradient key={index} id="gradient1" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgb(124, 175, 84)" />
                                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                </radialGradient>
                            );
                        })}
                    </defs>
                    {bubbles.map((bubble, index) => {
                        // const newPos = getRandomPosition(bubble.properties.x, bubble.properties.y, 600, 600);
                        // console.log(newPos);

                        return (
                            <motion.circle
                                key={index}
                                cx={bubble.properties.x}
                                cy={bubble.properties.y}
                                r={Math.random() * 80 + 240}
                                fill="url(#gradient1)"
                                animate={bubble.bubbleAnimation}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default LavaLampBubbles;
