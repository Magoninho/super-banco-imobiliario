import { useState } from "react";

function NicknameForm({ handleSubmit }) {
    const [nickname, setNickname] = useState(""); // TODO: generate default random username

    return (
        <form style={{
            backgroundColor: "#fff",
            padding: 20,
            border: "1px solid lightgray",
            borderRadius: 10
            }} onSubmit={(e) => {
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
    );
}

export default NicknameForm;