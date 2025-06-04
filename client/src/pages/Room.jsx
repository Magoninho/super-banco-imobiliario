import { createContext, useCallback, useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "./Room.css";
import Modal from "../components/Modal";
import RequestApproval from "../components/RequestApproval";
import Options from "../components/Options";
import MoneyForm from "../components/MoneyForm";
import TransferModal from "../components/TransferModal";
import PlayerList from "../components/PlayerList";
import Invite from "../components/Invite";
import CrownIcon from "../assets/CrownIcon";
import "beercss";
import io from "socket.io-client";
import { API_URL } from "../config";

export const SocketContext = createContext();
export const RoomContext = createContext();

function Room() {
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(true);
  const [playerState, setPlayerState] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [socket, setSocket] = useState(null);
  const [requestMessages, setRequestMessages] = useState([]);

  // modals
  const [playerList, setPlayerList] = useState(false);
  const [inviteWindow, setInviteWindow] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const [wasteModal, setWasteModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch(`${API_URL}/player/get-player-info`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPlayerState(result);
        setRoomCode(result.room_code);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    // getting the player id from localStorage
    const token = localStorage.getItem("token");

    fetchUserData();

    const newSocket = io(API_URL, {
      auth: {
        token: token,
      },
    });

    // SOCKET EVENTS

    // request approval dialog (for admin only)
    newSocket.on("request-approval", (data) => {
      setRequestMessages(prevRequestMessages => [...prevRequestMessages, data]);
    });

    newSocket.on("transfer-response", (data) => {
      if (data.success) {
        toast.info(
          `Você recebeu uma transferência de $ ${data.value} do jogador ${data.sender}!`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
        fetchUserData();
      }
    });

    newSocket.on("admin-update", () => {
      fetchUserData();
    });

    newSocket.on("status-update", (data) => {
      if (data.response == "accept") {
        toast.info(
          `O administrador ACEITOU sua solicitação de ${
            data.type == "receive"
              ? "RECEBER $" + data.value
              : "GASTAR $" + data.value
          }`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
      } else {
        toast.error(
          `O administrador RECUSOU sua solicitação de ${
            data.type == "receive"
              ? "RECEBER $" + data.value
              : "GASTAR $" + data.value
          }`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
      }

      fetchUserData();
    });

    newSocket.on("user_joined", (userData) => {
      toast.success(`${userData.username} entrou no jogo`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    });

    newSocket.on("user_left", (userData) => {
      toast.error(`${userData.username} saiu do jogo`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    });

    newSocket.connect();

    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      console.log("Socket disconnected");
    };
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    setReceiveModal(false);
    setWasteModal(false);
    setTransferModal(false);
    setOptionsModal(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SocketContext.Provider value={socket}>
        {requestMessages.length > 0 ? 
          <Modal>
            {requestMessages.map((messageData, index) => (
                <RequestApproval key={index} messageData={messageData} handleClose={(e) => {
                  setRequestMessages(prevRequestMessages => {
                    return prevRequestMessages.filter((_, i) => i !== index);
                  });
                }} />
            ))}
          </Modal> :null}
        {inviteWindow && (
          <Modal>
            <Invite
              roomCode={roomCode}
              onClose={() => {
                setInviteWindow(false);
              }}
            />
          </Modal>
        )}
        
        {optionsModal &&
          <Modal>
            <Options handleClose={handleClose} />
          </Modal>
        }

        {playerList && (
          <Modal>
            <PlayerList
              onClose={() => {
                setPlayerList(false);
              }}
            />
          </Modal>
        )}

        {receiveModal && (
          <Modal>
            <MoneyForm handleClose={handleClose} type="receive" />
          </Modal>
        )}

        {wasteModal && (
          <Modal>
            <MoneyForm handleClose={handleClose} type="waste" />
          </Modal>
        )}

        {transferModal && (
          <RoomContext.Provider value={roomCode}>
            <Modal>
              <TransferModal
                handleClose={(e) => {
                  setTransferModal(false);
                  fetchUserData();
                }}
              />
            </Modal>
          </RoomContext.Provider>
        )}
      </SocketContext.Provider>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          width: "fit-content",
          height: "100vh",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
            margin: 20,
            rowGap: 10,
          }}
        >
          <button
            onClick={() => {
              setPlayerList(true);
            }}
          >
            <i>Group</i>Jogadores
          </button>
          {admin && (
            <button onClick={() => {
              setOptionsModal(true);
            }}>
              <i>settings</i>Opções
            </button>
          )}
          <button
            onClick={() => {
              setInviteWindow(true);
            }}
          >
            <i>share</i>Convidar
          </button>
        </div>
        <div
          style={{
            display: "flex",
            marginRight: "10px",
            marginLeft: "10px",
            flexDirection: "column",
          }}
        >
          <p>
            {playerState.admin == 1 ? <CrownIcon /> : <i>person</i>}{" "}
            {playerState.nickname} {playerState.admin == 1 && "(admin)"}
          </p>
          <p>
            <i>vpn_key</i> Código da sala:{" "}
            <b style={{ fontFamily: "monospace" }}>{roomCode}</b>
          </p>

          <h6>
            Saldo: <b>$ {playerState.balance}</b>
          </h6>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            gap: "40px",
          }}
        >
          <button
            className="small-round primary extra small-elevate success"
            onClick={() => {
              setReceiveModal(true);
            }}
          >
            <i>add</i>
            <span>Receber</span>
          </button>

          <button
            className="small-round secondary extra small-elevate"
            onClick={() => {
              setTransferModal(true);
            }}
          >
            <i>sync_alt</i>
            <span>Tranferir</span>
          </button>
          <button
            className="small-round primary extra small-elevate danger"
            onClick={() => {
              setWasteModal(true);
            }}
          >
            <i>remove</i>
            <span>Gastar</span>
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Room;
