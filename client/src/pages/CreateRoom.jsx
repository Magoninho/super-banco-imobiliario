import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import logo from "../assets/SUPER.png";
import "beercss";
import { API_URL } from "../config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  console.log(API_URL);


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // TODO: stop using axios because of security reasons

    axios
      .post(`${API_URL}/room/create`, {
        username,
        roomName,
        password,
      })
      .then(function (response) {
        const { token, roomCode } = response.data;
        console.log(response.data);
        localStorage.setItem("token", token);
        navigate(`/room/${roomCode}`);
      })
      .catch(function (error) {
        if (error.code == "ERR_NETWORK")
          setError("Falha na conexão com o servidor");
        else setError("Credenciais invalidas");
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <img src={logo} width={300} style={{ margin: 0 }} />

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <fieldset
          style={{
            width: "max-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <legend>Criar</legend>
          <div className="field border label prefix" style={{ width: 264 }}>
            <i>person</i>
            <input
              type="text"
              value={username}
              required={true}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <label>Seu nickname</label>
          </div>
          <div className="field border label prefix" style={{ width: 264 }}>
            <i>sticky_note</i>
            <input
              type="text"
              value={roomName}
              required={true}
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <label>Nome da sala</label>
          </div>
          <div className="field border label prefix" style={{ width: 264 }}>
            <i>password</i>
            <input
              type="password"
              value={password}
              required={true}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label>Senha da sala</label>
          </div>

          <button className="responsive" type="submit">
            <i>arrow_forward</i>
            <span>Criar sala</span>
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
      </form>
    </div>
  );
}
