import { useState } from "react";
import "./Room.css";

function Room() {
    const [admin, setAdmin] = useState(false);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "fit-content", // TODO: sera que compensa?
            height: "100vh",
            justifyContent: "space-between"
        }}>
            <div style={{
                textAlign: "center"
            }}>
                <p><b>[Nome da sala]</b></p>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap", 
                alignItems: "center",
            }}>
                <button><i>Group</i>Jogadores</button>
                {admin && <button><i>settings</i>Opções</button>}
                <button><i>share</i>Convidar</button>
            </div>
            <div style={{
                display: "flex",
                marginRight: "10px",
                marginLeft: "10px",
                flexDirection: "column"
            }}>
                <fieldset style={{
                    marginTop: "20px"
                }}>
                    <p>{admin && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z"/></svg>} Jogador</p>
                    <article class="round secondary-container" style={{
                        width: "300px",
                        margin: "auto",
                        marginTop: "10px"
                    }}>
                        <h6>Saldo: <b>$15.000</b></h6>
                    </article>
                </fieldset>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                gap: "40px"
            }}>
                <button class="small-round primary extra small-elevate success">
                    <i>add</i>
                    <span>Receber</span>
                </button>

                <button class="small-round secondary extra small-elevate">
                    <i>sync_alt</i>
                    <span>Tranferir</span>
                </button>
                <button class="small-round primary extra small-elevate danger">
                    <i>remove</i>
                    <span>Gastar</span>
                </button>
            </div>
        </div>
    );
}

export default Room;