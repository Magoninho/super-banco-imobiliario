import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../pages/Room";

function MoneyForm({ type = "receive", handleClose }) { // it can be either "receive" or "waste"
    const [value, setValue] = useState(0);
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        socket.on("submission-response", (data) => {
            if (!data.success) {
                alert(data.error);
            }
        });
    }, []);
    
    const handleSubmit = (e, type, value) => {
        socket.emit("money-request", { type, value })
        handleClose(e);
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
                    handleSubmit(e, type, value);
                }
            }}>
            <fieldset>
                <legend>Quanto você quer { type == "receive" ? "receber" : "gastar"}?</legend>
                <div className="field border label prefix">
                    <i>attach_money</i>
                    <input
                        type="number"
                        step="any"
                        min={1}
                        required={true}
                        value={value}
                        onChange={(e) => { setValue(parseInt(e.target.value)) }} // TODO: i know this is akward but i dont give a fuck
                    />
                    <label>Quantia</label>
                </div>

                {type == "receive" ?
                    <button className="responsive success" type="submit"><i>add</i>Receber</button>
                    :
                    <button className="responsive danger" type="submit"><i>remove</i>Gastar</button>
                }
                <br />
                <br />
                <button className="responsive border" style={{color: "var(--danger)"}} type="button" onClick={(e) => {
                    handleClose(e);
                }}><i>close</i>Cancelar</button>

            </fieldset>
        </form>
    );
}

export default MoneyForm;