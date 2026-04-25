import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function LoginPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: user,
                password: pass
            });
            if (response.data.success) {
                localStorage.setItem('username', user);
                localStorage.setItem('role', response.data.role); // Save role for Sidebar
                navigate('/dashboard');
            } else {
                setErrorMsg(response.data.message || 'sai tên username hoặc password');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg('sai tên username hoặc password');
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>HỆ THỐNG NHÂN SỰ</h2>
                {errorMsg && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-login">ĐĂNG NHẬP</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
