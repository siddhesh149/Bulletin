import React, { useState, useEffect } from 'react';

interface ViewCounterProps {
  count: number;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ count }) => {
  const [currentCount, setCurrentCount] = useState(count);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Format the number
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Occasionally simulate a real-time view increment
  useEffect(() => {
    const simulateViewIncrement = () => {
      // Only increment with 30% probability to make it feel natural
      if (Math.random() > 0.7) {
        const increment = Math.floor(Math.random() * 3) + 1;
        setCurrentCount(prevCount => prevCount + increment);
        setIsHighlighted(true);
        
        // Remove highlight after animation completes
        setTimeout(() => {
          setIsHighlighted(false);
        }, 500);
      }
    };

    const intervalId = setInterval(simulateViewIncrement, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Update if prop changes
  useEffect(() => {
    if (count !== currentCount && count > currentCount) {
      setCurrentCount(count);
    }
  }, [count]);

  return (
    <span className={`view-count ${isHighlighted ? 'text-primary' : ''} transition-colors duration-300`}>
      <i className="far fa-eye mr-1"></i> {formatCount(currentCount)} views
    </span>
  );
};

export default ViewCounter;
