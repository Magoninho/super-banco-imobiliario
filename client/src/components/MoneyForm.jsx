function MoneyForm({ type = "receive" }) { // it can be either "receive" or "waste"
    return (
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
    );
}

export default MoneyForm;