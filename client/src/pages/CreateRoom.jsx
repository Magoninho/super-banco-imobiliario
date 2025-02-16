import { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import logo from '../assets/SUPER.png'
import "beercss";

export default function Login() {
    const [roomName, setRoomName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setError("");

    //     if (!user || !password) {
    //         setError("Email and password are required");
    //         return;
    //     }

    //     axios.post('https://joofeliperi-jwt-authent-28.deno.dev/auth/login', {
    //         username: user.trim(),
    //         password: password
    //     })
    //         .then(function (response) {
    //             const { token, username } = response.data;
    //             console.log(response.data);
    //             localStorage.setItem('token', token);
    //             localStorage.setItem('username', username);
    //             navigate('/home');
    //         })
    //         .catch(function (error) {
    //             if (error.code == "ERR_NETWORK")
    //                 setError("Falha na conexão com o servidor");
    //             else
    //                 setError('Credenciais invalidas');
    //         });

    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("todo");
    };
    return (
        
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column"
        }}>
            <img src={logo} width={300} style={{margin: 0}} />

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
                <legend>Criar</legend>
                <div className="field border label">
                    <input
                        type="text"
                        value={roomName}
                        required={true}
                        onChange={(e) => { setRoomName(e.target.value) }}
                    />
                    <label>Nome da sala</label>
                </div>
                <div className="field border label">
                    <input
                        type="password"
                        value={password}
                        required={true}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <label>Crie uma senha</label>
                </div>

                <button className='responsive' type="submit">
                    <i>arrow_forward</i>
                    <span>Criar sala</span>
                </button>
                {error && <p style={{color: "red"}}>{error}</p>}
                
                </fieldset>

            </form>
        </div>
    );
}
