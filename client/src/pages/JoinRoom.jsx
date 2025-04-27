import { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router';
import logo from '../assets/SUPER.png'
import "beercss";

export default function Login() {
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState("");
    const [roomCode, setRoomCode] = useState(searchParams ? searchParams.get('code') : roomCode);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            username,
            roomCode,
            password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/room/join", requestOptions)
            .then(response => response.json())
            .then(result => {
                const { token, roomCode } = result;
                localStorage.setItem('token', token);
                navigate(`/room/${roomCode}`);
            })
            .catch((error) => {
                if (error.code == "ERR_NETWORK")
                    setError("Falha na conexão com o servidor");
                else
                    setError('Credenciais invalidas');
            });

    };

    return (

        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column"
        }}>
            <img src={logo} width={300} style={{ margin: 0 }} />

            <form onSubmit={handleSubmit} style={{
                display: "flex",
                justifyContent: "center"
            }}>

                <fieldset style={{
                    width: "max-content",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <legend>Entrar</legend>
                    <div className="field border label prefix" style={{ width: 264 }}>
                        <i>person</i>
                        <input
                            type="text"
                            value={username}
                            required={true}
                            onChange={(e) => { setUsername(e.target.value) }}
                        />
                        <label>Seu nickname</label>
                    </div>
                    <div className="field border label prefix" style={{ width: 264 }}>
                        <i>vpn_key</i>
                        <input
                            type="text"
                            value={roomCode}
                            required={true}
                            onChange={(e) => { setRoomCode(e.target.value) }}
                        />
                        <label>Código da sala</label>
                    </div>
                    <div className="field border label prefix" style={{ width: 264 }}>
                        <i>password</i>
                        <input
                            type="password"
                            value={password}
                            required={true}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <label>Senha da sala</label>
                    </div>

                    <button className='responsive' type="submit">
                        <i>arrow_forward</i>
                        <span>Entrar na sala</span>
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}

                </fieldset>

            </form>
        </div>
    );
}
