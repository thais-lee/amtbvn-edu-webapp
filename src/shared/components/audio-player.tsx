import React, { useRef, useState } from 'react';
import { IoRepeat } from 'react-icons/io5';

interface FloatingAudioPlayerProps {
  src?: string;
}

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({ src }) => {
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  if (!src) return null;
  return (
    <div className="floating-audio-player">
      <button
        onClick={() => setIsRepeat((r) => !r)}
        style={{
          marginRight: 12,
          background: isRepeat ? '#e6f7ff' : '#fff',
          border: '1px solid #91d5ff',
          borderRadius: 6,
          padding: 6,
          cursor: 'pointer',
          color: isRepeat ? '#1890ff' : '#888',
          outline: 'none',
        }}
        title="Lặp lại"
      >
        <IoRepeat size={20} />
      </button>
      <audio
        ref={audioRef}
        controls
        style={{ width: '360px', maxWidth: '70vw' }}
        loop={isRepeat}
      >
        <source src={src} type="audio/mpeg" />
        Trình duyệt của bạn không hỗ trợ audio.
      </audio>
    </div>
  );
};

export default FloatingAudioPlayer;
