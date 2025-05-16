import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CrownIcon from "../assets/CrownIcon";

function PlayerList({ onClose }) {
    const { roomCode } = useParams();
    const [playerListState, setPlayerListState] = useState([]);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
        // TODO: tirar o room code explicito da url e colocar o token nos headers
        // que nem eu fiz no Room.jsx e no playerController.ts no backend
        // assim eu evito problemas de segurança
         fetch(`http://localhost:3000/room/get-players?roomCode=${roomCode}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                setPlayerListState(JSON.parse(result).filter((elem) => elem.active != 0));
                console.log(result);
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
                                        <td>{player.admin == 1 && <CrownIcon />} {player.nickname}</td>
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