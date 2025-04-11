import React, { useState, useEffect } from 'react';

interface TimeAgoProps {
  timestamp: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState('');

  const calculateTimeAgo = () => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let timeAgo;
    if (diffInSeconds < 60) {
      timeAgo = `${diffInSeconds} ${diffInSeconds === 1 ? 'sec' : 'secs'} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      timeAgo = `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      timeAgo = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      timeAgo = `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    setTimeAgo(timeAgo);
  };

  useEffect(() => {
    calculateTimeAgo();
    
    // Update time ago every minute
    const intervalId = setInterval(calculateTimeAgo, 60000);
    
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return <span className="time-ago">{timeAgo}</span>;
};

export default TimeAgo;
