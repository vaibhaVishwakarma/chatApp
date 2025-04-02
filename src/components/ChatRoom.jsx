import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ChatMessage from './ChatMessage';

export default function ChatRoom() {
  const [formValue, setFormValue] = useState('');
  const dummy = useRef(null);
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('timestamp'), limit(25));
  const [messages] = useCollectionData(q, { idField: 'id' });

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, email } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      timestamp: serverTimestamp(),
      uid,
      email
    });

    setFormValue('');
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-room">
      <div className="messages">
        {messages && messages.map(msg => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            isCurrentUser={msg.uid === auth.currentUser.uid}
          />
        ))}
        <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}
      style={{padding: '1% 9px', marginTop:"0.5rem", background:'#f5f5f5' , borderRadius:'5px'}}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message"
          
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}