import { useState, useRef } from "react";
import copy from 'copy-to-clipboard';

function Invite({ roomCode, onClose }) {
    const [url, setUrl] = useState(window.location.href);
    const inputRef = useRef(null);
    return (
        <div style={{
            backgroundColor: "var(--background)",
            maxWidth: 350,
            padding: 10,
            border: "1px solid lightgray",
            borderRadius: 10
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <p><b>Compartilhar</b></p>
                <button className="danger" onClick={onClose} style={{
                    padding: 0,
                    margin: 0,
                    marginBottom: 20
                }}><i>close</i></button>
            </div>
            <div style={{
                display: "flex"
            }}>
                <div className="field border label">
                    <input
                        type="text"
                        ref={inputRef}
                        required={true}
                        value={window.location.origin + '/join?code=' + roomCode}
                        readOnly
                    />
                    <label>URL</label>

                </div>
                <button onClick={async (e) => {
                    copy(inputRef.current.value);
                    e.target.innerHTML = "<i>check</i>Copiado!"
                }}>Copiar</button>
            </div>
        </div>
    );
}

export default Invite;