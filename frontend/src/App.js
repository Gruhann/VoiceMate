import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoiceInput from './components/VoiceInput';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <div style={{ padding: '20px', fontFamily: 'Poppins' }}>
                <h1 align="center"><strong>Voice Mate</strong></h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Use PrivateRoute to protect the VoiceInput component */}
                    <Route path="/" element={<PrivateRoute component={VoiceInput} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
