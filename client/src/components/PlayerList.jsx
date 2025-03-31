import { useEffect, useState } from "react";
import { useParams } from "react-router";

function PlayerList({ onClose }) {
    const { roomCode } = useParams();
    const [playerListState, setPlayerListState] = useState([]);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`http://localhost:3000/room/get-players?roomCode=${roomCode}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                setPlayerListState(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    }, [])

    return (
        <div style={{
            backgroundColor: "var(--background)",
            minWidth: 300
        }}>
            <fieldset style={{
                padding: 10
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <p><b>Lista de Jogadores</b></p>
                    <button className="danger" onClick={onClose} style={{
                        padding: 0,
                        margin: 0
                }}><i>close</i></button>
                </div>
                <div style={{
                    maxHeight: "300px",
                    overflow: "scroll",
                    overflowX: "hidden"
                }}>
                    <table style={{
                        marginTop: 0
                    }}>
                        <thead>
                            <tr>
                                <th>Jogador</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                playerListState.map((player) => 
                                    <tr key={ player.player_id }>
                                        <td>{player.nickname}</td>
                                        <td>$ {player.balance}</td>
                                    </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </fieldset>
        </div>
    );
}

export default PlayerList;