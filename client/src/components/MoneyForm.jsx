import { useState } from "react";

function MoneyForm({ type = "receive" }) { // it can be either "receive" or "waste"
    const [value, setValue] = useState(0);
    return (
        
        <form style={{
            backgroundColor: "#fff",
            padding: 20,
            border: "1px solid lightgray",
            borderRadius: 10
            }} onSubmit={(e) => {
                e.preventDefault();
                if (value) {
                    handleSubmit(e);
                }
            }}>
            <fieldset>
                <legend>Quanto você quer { type == "receive" ? "receber" : "gastar"}?</legend>
                <div className="field border label prefix">
                    <i>attach_money</i>
                    <input
                        type="number"
                        required={true}
                        value={value}
                        onChange={(e) => { setValue(e.target.value) }}
                    />
                    <label>Quantia</label>
                </div>

                {type == "receive" ?
                    <button className="responsive success"><i>add</i>Receber</button>
                    :

                    <button className="responsive danger"><i>remove</i>Gastar</button>
                }
            </fieldset>
        </form>
    );
}

export default MoneyForm;