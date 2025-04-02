import { format } from 'date-fns';
import { useMemo } from 'react';

const BUBBLE_COLORS = [
  '#E3F2FD', // Light Blue
  '#F3E5F5', // Light Purple
  '#E8F5E9', // Light Green
  '#FFF3E0', // Light Orange
  '#F3E5F5', // Light Pink
  '#E0F7FA', // Light Cyan
  '#F1F8E9', // Lime
  '#FFF8E1', // Light Amber
];
function removeDomain(email) {
  return email.replace(/@[^@]+$/, '');
}

export default function ChatMessage({ message, isCurrentUser }) {
  const timestamp = message.timestamp?.toDate();
  const formattedTime = timestamp ? format(timestamp, 'HH:mm') : '';

  const bubbleColor = useMemo(() => {
    if (isCurrentUser) return null;
    const hashCode = message.email.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return BUBBLE_COLORS[Math.abs(hashCode) % BUBBLE_COLORS.length];
  }, [message.email, isCurrentUser]);

  const messageStyle = !isCurrentUser ? { '--bubble-color': bubbleColor } : {};

  return (
    <div className={`message ${isCurrentUser ? 'sent' : 'received'}`}>
      <div className="message-content" style={messageStyle}>
        <div className="message-header">
          <span className="email">{removeDomain(message.email)}</span>
        </div>
        <p className="message-text">{message.text}</p>
        <span className="message-timestamp">{formattedTime}</span>
      </div>
    </div>
  );
}