import { useState } from "react";

function Modal({ handleSubmit }) {
    const [nickname, setNickname] = useState(null); // TODO: generate default random username

    return (
        <div style={{
            position: "fixed",
            backgroundColor: "#00000005",
            inset: 0,
            zIndex: 999,
            backdropFilter: "blur(20px)"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}>
                <form style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    border: "1px solid lightgray",
                    borderRadius: 10
                    }} onSubmit={(e) => {
                        e.preventDefault();
                        if (nickname) {
                            handleSubmit(e);
                        }
                    }}>
                    <fieldset>
                        <legend>Defina seu nickname</legend>
                        <div className="field border label">
                            <input
                                type="text"
                                required={true}
                                value={nickname}
                                onChange={(e) => { setNickname(e.target.value) }}
                            />
                            <label>Nickname</label>
                        </div>

                        <button className="responsive">Ok</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Modal;