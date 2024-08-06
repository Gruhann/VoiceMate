import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VoiceInput.css'; // Ensure this CSS file exists
import voiceLogo from '../assets/voice.png'; // Ensure the path is correct
import del from '../assets/delete.png'; // Ensure the path is correct

const VoiceInput = () => {
    const [listening, setListening] = useState(false);
    const [fullTranscription, setFullTranscription] = useState('');
    const [reminders, setReminders] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchReminders();
    }, []); // No need to include fetchReminders as dependency because it's not defined inside this component

    const fetchReminders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reminders', {
                withCredentials: true // Include credentials (cookies) in the request
            });
            console.log('Reminders fetched:', response.data);
            setReminders(response.data);
        } catch (error) {
            console.error('Error fetching reminders:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 403) {
                console.error('Forbidden: Invalid or expired session, redirecting to login.');
                navigate('/login'); // Redirect to login if forbidden
            }
        }
    };

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            }
        }
        setFullTranscription((prev) => prev + finalTranscript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ', event.error);
    };

    const toggleListening = () => {
        if (listening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        setListening(true);
        setFullTranscription('');
        recognition.start();
    };

    const stopListening = async () => {
        setListening(false);
        recognition.stop();
    
        if (fullTranscription.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/api/reminders/add', {
                    reminder: fullTranscription,
                    date: new Date(),
                }, {
                    withCredentials: true, // Include credentials (cookies) in the request
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Reminder added:', response.data);
                fetchReminders();
            } catch (error) {
                console.error('Error saving transcription:', error.response ? error.response.data : error.message);
                if (error.response && error.response.status === 403) {
                    console.error('Forbidden: Invalid or expired session, redirecting to login.');
                    navigate('/login'); // Redirect to login if forbidden
                }
            }
        }
    };

    const deleteReminder = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/reminders/delete/${id}`, {
                withCredentials: true, // Include credentials (cookies) in the request
            });
            fetchReminders();
        } catch (error) {
            console.error('Error deleting reminder:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 403) {
                console.error('Forbidden: Invalid or expired session, redirecting to login.');
                navigate('/login'); // Redirect to login if forbidden
            }
        }
    };

    const handleLogout = () => {
        // You might need to make a logout request to invalidate the session on the server
        axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem('token'); // Optional: remove token if stored
                navigate('/login'); // Redirect to login page
            })
            .catch(error => {
                console.error('Error logging out:', error.response ? error.response.data : error.message);
                // Handle logout errors
            });
    };

    return (
        <div className="voice-input-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <img
                src={voiceLogo}
                alt="Voice Input"
                className={`voice-logo ${listening ? 'listening' : ''}`}
                onClick={toggleListening}
            />
            <div className="transcription-area">
                <input
                    type="text"
                    value={fullTranscription}
                    readOnly
                    className="interim-transcription"
                />
            </div>
            <div className="reminder-list">
                {reminders.length > 0 && <p><strong>Reminders</strong></p>}
                {reminders.map(reminder => (
                    <div key={reminder._id} className="reminder-item">
                        <span>{reminder.reminder}</span>
                        <button
                            className="delete-button"
                            onClick={() => deleteReminder(reminder._id)}
                        >
                            <img
                                src={del}
                                alt="delete"
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoiceInput;
