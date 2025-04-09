import { useEffect, useState } from "react";
import "./Room.css";
import Modal from "../components/Modal";
import NicknameForm from "../components/NicknameForm";
import MoneyForm from "../components/MoneyForm";
import PlayerList from "../components/PlayerList";
import Invite from "../components/Invite";
import { jwtDecode } from "jwt-decode";
import "beercss";

function Room() {
    const [isLoading, setIsLoading] = useState(true);
    const [admin, setAdmin] = useState(true);
    const [playerState, setPlayerState] = useState(null);

    // modals
    const [playerList, setPlayerList] = useState(false);
    const [inviteWindow, setInviteWindow] = useState(false);
    const [receiveModal, setReceiveModal] = useState(false);
    const [wasteModal, setWasteModal] = useState(false);


    useEffect(() => {
        // getting the player id from localStorage
        const token = localStorage.getItem('token');
        const playerId = jwtDecode(token).playerId;
        
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://localhost:3000/player/get-player-info?playerId=${playerId}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setPlayerState(result);
                setIsLoading(false);
            })
            .catch(error => console.log('error', error));
    }, []);

    const handleNicknameSubmit = (e) => {
        e.preventDefault();

        // TODO: send request to set nickname

        setNicknameModal(false);
    };

    const handleMoneySubmit = (e, type, value) => {
        e.preventDefault();

        // TODO: only proceed if value is greater than 0

        // TODO:
        // if type == receive then do stuff to add money on the api
        // if type == waste then do stuff to remove money on the api


        setReceiveModal(false);
        setWasteModal(false);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setReceiveModal(false);
        setWasteModal(false);
    }


    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {inviteWindow &&
                <Modal>
                    <Invite onClose={() => {
                        setInviteWindow(false);
                    }} />
                </Modal>
            }

            {playerList &&
                <Modal>
                    <PlayerList onClose={() => {
                        setPlayerList(false);
                    }} />
                </Modal>
            }

            {receiveModal &&
                <Modal>
                    <MoneyForm handleSubmit={handleMoneySubmit} handleCancel={handleCancel} type="receive" />
                </Modal>
            }

            {wasteModal &&
                <Modal>
                    <MoneyForm handleSubmit={handleMoneySubmit} handleCancel={handleCancel} type="waste" />
                </Modal>
            }
            <div style={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                width: "fit-content",
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
                    rowGap: 10
                }}>
                    <button onClick={() => {
                        setPlayerList(true);
                    }}><i>Group</i>Jogadores</button>
                    {admin && <button><i>settings</i>Opções</button>}
                    <button onClick={() => {
                        setInviteWindow(true);
                    }}><i>share</i>Convidar</button>
                </div>
                <div style={{
                    display: "flex",
                    marginRight: "10px",
                    marginLeft: "10px",
                    flexDirection: "column"
                }}>
                    <p>{playerState.admin == 1 ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z" /></svg> : <i>person</i>} {playerState.nickname} {playerState.admin == 1 && "(admin)"}</p>
                    
                    <h6>Saldo: <b>$15.000</b></h6>
                </div>


                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    gap: "40px"
                }}>
                    <button className="small-round primary extra small-elevate success"
                        onClick={() => {
                            setReceiveModal(true);
                        }}>
                        <i>add</i>
                        <span>Receber</span>
                    </button>

                    <button className="small-round secondary extra small-elevate">
                        <i>sync_alt</i>
                        <span>Tranferir</span>
                    </button>
                    <button className="small-round primary extra small-elevate danger"
                        onClick={() => {
                            setWasteModal(true);
                        }}>
                        <i>remove</i>
                        <span>Gastar</span>
                    </button>
                </div>
            </div>

        </>
    );
}

export default Room;