import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";


// import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import Infobar from '../Infobar/Infobar';
import Input from '../Input/Input';

import './Chat.css';

const ENDPOINT = 'http://localhost:5000';
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  // const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room },() => {
      
    });

  return () => {
    socket.emit('disconnect');

    socket.off(); //Turn one instance of socket i.e One chat person off
  }

  }, [ENDPOINT,location.search]);
  
  // For handling messages..
  useEffect(() => {
    socket.on('message', message => {
      setMessages([ ...messages, message ]);
    });
    
    // socket.on("roomData", ({ users }) => {
    //   setUsers(users);
    // });
}, [messages]);

// Function for sending message..

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
 }

  return (
    <div className="outerContainerchat">
      <div className="containerchat">
          <Infobar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {/* <TextContainer users={users}/> */}
    </div>
  );
}

export default Chat;