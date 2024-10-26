import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, query, onSnapshot, addDoc, orderBy, serverTimestamp, where } from 'firebase/firestore';
import './chat.css';

function Chat() {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Obter todos os usuários e monitorar o status de autenticação
    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        });

        return () => unsubscribe();
    }, []);

    // Obter mensagens em tempo real, filtradas pelo usuário selecionado
    useEffect(() => {
        if (!selectedUser) return;

        const q = query(
            collection(db, "messages"),
            where("participants", "array-contains", user.uid),
            orderBy("timestamp")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(msg => msg.participants.includes(selectedUser.id));
                
            console.log('Mensagens recebidas:', msgs); // Debug: Exibir mensagens recebidas
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [selectedUser, user.uid]);

    // Função para enviar mensagem
    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '' || !selectedUser) return;

        await addDoc(collection(db, "messages"), {
            text: message,
            uid: user.uid,
            name: user.nome,
            timestamp: serverTimestamp(),
            participants: [user.uid, selectedUser.id],
        });

        setMessage('');
    };

    return (
        <div className="chat-container">
            <aside className="online-users">
                <h3>Usuários</h3>
                {users.map((usr) => (
                    <div
                        key={usr.id}
                        className={`online-user ${selectedUser?.id === usr.id ? 'selected' : ''}`}
                        onClick={() => setSelectedUser(usr)}
                    >
                        <span className={`status-indicator ${usr.status === 'online' ? 'online' : 'offline'}`}></span>
                        <span>{usr.nome}</span>
                    </div>
                ))}
            </aside>

            <section className="chat-section">
                {selectedUser ? (
                    <>
                        <h3>Conversando com {selectedUser.nome}</h3>
                        <div className="messages">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`message ${msg.uid === user.uid ? 'sent' : 'received'}`}>
                                        <span className="user-name">{msg.name}</span>
                                        <p>{msg.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-messages">Nenhuma mensagem ainda.</p> // Mensagem quando não há mensagens
                            )}
                        </div>
                        <form onSubmit={sendMessage} className="message-form">
                            <input
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit">Enviar</button>
                        </form>
                    </>
                ) : (
                    <div className="no-user-selected">
                        <h3>Selecione um usuário para iniciar o chat</h3>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Chat;
