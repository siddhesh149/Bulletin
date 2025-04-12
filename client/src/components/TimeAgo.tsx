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
      timeAgo = 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      timeAgo = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      timeAgo = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      timeAgo = `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      timeAgo = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      timeAgo = `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      timeAgo = `${years} ${years === 1 ? 'year' : 'years'} ago`;
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
