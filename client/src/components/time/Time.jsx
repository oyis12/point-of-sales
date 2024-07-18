import React, { useState, useEffect } from "react";

const Time = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <p className="time font-bold font-sans">{time.toLocaleTimeString()}</p>
    </div>
  );
}

export default Time;
