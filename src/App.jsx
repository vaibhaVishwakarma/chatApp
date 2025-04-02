import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <header>
            <h1>Chat App</h1>
            <button onClick={() => auth.signOut()}>Sign Out</button>
          </header>
          <ChatRoom />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;