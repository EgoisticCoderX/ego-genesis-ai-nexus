
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ResponseTimerProps {
  startTime: number | null;
  isActive: boolean;
}

const ResponseTimer: React.FC<ResponseTimerProps> = ({ startTime, isActive }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    } else if (!isActive) {
      setElapsed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${isActive ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
      <div className="text-sm">
        {isActive ? (
          <span className="text-green-600 font-mono">{formatTime(elapsed)}</span>
        ) : (
          <span className="text-gray-400">Ready</span>
        )}
      </div>
    </div>
  );
};

export default ResponseTimer;
