import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = +targetDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] border-2 transition-all duration-300 hover:scale-105" style={{ borderColor: '#AB3933' }}>
        <div className="text-3xl md:text-5xl font-bold" style={{ color: '#E3C276' }}>
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="text-sm md:text-base font-medium mt-2" style={{ color: '#E3C276' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      <TimeBox value={timeLeft.days} label="Dias" />
      <TimeBox value={timeLeft.hours} label="Horas" />
      <TimeBox value={timeLeft.minutes} label="Minutos" />
      <TimeBox value={timeLeft.seconds} label="Segundos" />
    </div>
  );
}
