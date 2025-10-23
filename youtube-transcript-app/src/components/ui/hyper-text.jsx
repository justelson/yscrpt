import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { cn } from "@/lib/utils";

const alphabets = "ABCDEUVWXYZ".split("");

const getRandomInt = (max) => Math.floor(Math.random() * max);

export function HyperText({
    children,
    className,
    duration = 800,
    framerProps = {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 3 },
    },
    animateOnLoad = true,
}) {
    const [displayText, setDisplayText] = useState(children.split(""));
    const [trigger, setTrigger] = useState(false);
    const interations = useRef(0);
    const isFirstRender = useRef(true);

    const triggerAnimation = () => {
        interations.current = 0;
        setTrigger(true);
    };

    useEffect(() => {
        const interval = setInterval(
            () => {
                if (!animateOnLoad && isFirstRender.current) {
                    clearInterval(interval);
                    isFirstRender.current = false;
                    return;
                }
                if (interations.current < children.length) {
                    setDisplayText((t) =>
                        t.map((l, i) =>
                            l === " "
                                ? l
                                : i <= interations.current
                                    ? children[i]
                                    : alphabets[getRandomInt(26)]
                        )
                    );
                    interations.current = interations.current + 0.1;
                } else {
                    setTrigger(false);
                    clearInterval(interval);
                }
            },
            duration / (children.length * 10)
        );
        return () => clearInterval(interval);
    }, [children, duration, trigger, animateOnLoad]);

    return (
        <div
            className="overflow-hidden inline-flex cursor-default"
            onMouseEnter={triggerAnimation}
        >
            <AnimatePresence mode="wait">
                {displayText.map((letter, i) => (
                    <Motion.span
                        key={i}
                        className={cn("", letter === " " ? "w-3" : "", className)}
                        {...framerProps}
                    >
                        {letter}
                    </Motion.span>
                ))}
            </AnimatePresence>
        </div>
    );
}
