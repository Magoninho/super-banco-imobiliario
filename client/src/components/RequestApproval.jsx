import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../pages/Room";

function RequestApproval({ messageData, handleClose }) {
    const [value, setValue] = useState(0);
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        socket.on("submission-response", (data) => {
            if (!data.success) {
                alert(data.error);
            }
        });
    }, []);
    
    const handleAccept = (e) => {
        socket.emit("response-accept", messageData);
        handleClose(e);
    };
    
    const handleDeny = (e) => {
        socket.emit("response-deny", messageData);
        handleClose(e);
    };
    

    return (
        <form style={{
            backgroundColor: messageData.type == "receive" ? "var(--success-bg)" : "var(--danger-bg)",
            padding: 20,
            position: "absolute",
            border: "1px solid lightgray",
            borderRadius: 10,
            marginBlockStart: 0
            }} onSubmit={(e) => {
                e.preventDefault();
                if (value) {
                    handleAccept(e, type, value);
                }
            }}>
            <div style={{textAlign: "center", marginBottom: 15}}>
                <p>O usuário <b>{messageData.user.username}</b> quer <b>{ messageData.type == "receive" ? "ganhar" : "gastar" }</b> </p>
                <p style={{fontSize: "xx-large"}}><b>${ messageData.value }</b></p>
            </div>

                <div style={{
                    display: "flex"
                }}>
                    <button className="responsive success" type="button" onClick={(e) => {
                        handleAccept(e);
                    }}><i>check</i>Aceitar</button>

                    <button className="responsive danger" type="button" onClick={(e) => {
                        handleDeny(e);
                    }}><i>close</i>Negar</button>
                </div>

        </form>
    );
}

export default RequestApproval;