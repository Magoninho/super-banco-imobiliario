import { useContext, useEffect, useState } from "react";
import { RoomContext, SocketContext } from "../pages/Room";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

function TransferModal({ handleClose }) { // it can be either "receive" or "waste"
    const [value, setValue] = useState(0);
    const [playerListState, setPlayerListState] = useState([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const roomCode = useContext(RoomContext);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Erro de autenticação');
            navigate('/join');
        }

        const currentPlayerId = jwtDecode(token).playerId;
        
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Authorization': `Bearer ${token}`
            }
          };
          
        // todo
        fetch(`http://localhost:3000/room/get-players?roomCode=${roomCode}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                setPlayerListState(JSON.parse(result).filter((elem) => (elem.active != 0 && elem.player_id != currentPlayerId)));
            })
            .catch(error => console.log('error', error));
    }, []);
    
    const handleSubmit = (e, value, targetPlayerId) => {
        // TODO
        if (!targetPlayerId) {
            alert("Selecione um jogador primeiro!");
            return;
        }
        socket.emit("transfer-request", {
            value: parseInt(value),
            targetPlayerId: parseInt(targetPlayerId)
        });
        
        handleClose(e);
    };
    
    const handleOptionChange = (e) => {
        setSelectedPlayerId(e.target.value);
    };

    return (
        
        <form style={{
            backgroundColor: "var(--background)",
            padding: 20,
            border: "1px solid lightgray",
            borderRadius: 10
            }} onSubmit={(e) => {
                e.preventDefault();
                if (value) {
                    handleSubmit(e, value, selectedPlayerId);
                }
            }}>
            <fieldset>
                <legend>Quanto você quer transferir?</legend>
                <div className="field border label prefix">
                    <i>attach_money</i>
                    <input
                        type="number"
                        min={1}
                        required={true}
                        value={value}
                        onChange={(e) => { setValue(e.target.value) }}
                    />
                    <label>Quantia</label>
                </div>

                <div className="field border label prefix">
                    <i>person</i>
                    <select name="player_select" defaultValue={"DEFAULT"} onChange={(e) => {handleOptionChange(e)}}>
                        <option disabled value="DEFAULT"></option>
                        {
                            playerListState.map((player) => <option key={ player.player_id } value={parseInt(player.player_id)}>{player.nickname}</option>)
                        }
                    </select>
                    <label>Jogador</label>
                </div>

                <button className="responsive success"><i>sync_alt</i>Tranferir</button>

                <br /><br />

                <button className="responsive border" style={{color: "var(--danger)"}} type="button" onClick={(e) => {
                    handleClose(e);
                }}><i>close</i>Cancelar</button>

            </fieldset>
        </form>
    );
}

export default TransferModal;
