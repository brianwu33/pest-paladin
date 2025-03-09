import React, { useEffect, useState } from 'react';

type TypingEffectProps = {
    text: string;
    speed?: number; // Typing speed (in ms)
    loop?: boolean; // Optional: Loop the text effect
    as?: 'h1' | 'p'; // Dynamic element type (h1 or p)
    className?: string; // Optional: Custom class for styling
};

const TypingEffect: React.FC<TypingEffectProps> = ({
    text,
    speed = 100,
    loop = false,
    as: Element = 'h1',
    className = "",
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex((prevIndex) => prevIndex + 1);
            }, speed);

            return () => clearTimeout(timeoutId);
        } else if (loop) {
            setTimeout(() => {
                setDisplayedText('');
                setIndex(0);
            }, 2000); // Pause before restarting
        }
    }, [index, text, speed, loop]);

    const Tag = Element; // Dynamic tag element

    return <Tag className={className}>{displayedText}</Tag>;
};

export default TypingEffect;
