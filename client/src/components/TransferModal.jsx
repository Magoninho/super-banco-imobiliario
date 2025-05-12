import { useState } from "react";

function TransferModal({ handleSubmit, handleCancel }) { // it can be either "receive" or "waste"
    const [value, setValue] = useState(0);
    return (
        
        <form style={{
            backgroundColor: "var(--background)",
            padding: 20,
            border: "1px solid lightgray",
            borderRadius: 10
            }} onSubmit={(e) => {
                e.preventDefault();
                if (value) {
                    handleSubmit(e, type, value);
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
                    <select name="player_select">
                        <option disabled selected value=""></option>
                        <option value="teste">teste</option>
                        <option value="teste">teste</option>
                        <option value="teste">teste</option>
                    </select>
                    <label>Jogador</label>
                </div>

                <button className="responsive success"><i>sync_alt</i>Tranferir</button>

                <br /><br />

                <button className="responsive border" style={{color: "var(--danger)"}} type="button" onClick={(e) => {
                    handleCancel(e);
                }}><i>close</i>Cancelar</button>

            </fieldset>
        </form>
    );
}

export default TransferModal;
