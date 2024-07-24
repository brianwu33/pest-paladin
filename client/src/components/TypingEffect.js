import React, { useEffect, useState } from 'react';

const TypingEffect = ({ text, speed = 100, reset }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setDisplayedText('');
        setIndex(0);
    }, [reset]);

    useEffect(() => {
        if (index < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(displayedText + text[index]);
                setIndex(index + 1);
            }, speed);
            return () => clearTimeout(timeoutId);
        }
    }, [index, text, speed, displayedText]);

    return <h2>{displayedText}</h2>;
};

export default TypingEffect;
