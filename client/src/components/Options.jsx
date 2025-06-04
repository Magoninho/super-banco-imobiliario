function Options({ handleClose }) {
    return (
        <div style={{
            backgroundColor: "var(--background)",
            padding: 20,
            minWidth: 300,
            position: "absolute",
            border: "1px solid lightgray",
            borderRadius: 10,
            marginBlockStart: 0
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>
            <b>Opções</b>
          </p>
          <button
            className="danger"
            onClick={handleClose}
            style={{
              padding: 0,
              margin: 0,
              marginBottom: 10
            }}
          >
            <i>close</i>
          </button>
        </div>
            <button className="responsive" onClick={() => {
                const localTheme = localStorage.getItem("theme");
                if (!localTheme) {
                    localStorage.setItem("theme", "dark");
                    document.body.className = "dark";
                    return;
                }
                document.body.className = localTheme == "light" ? "dark" : "light";
                localStorage.setItem("theme", document.body.className)
            }}><i>contrast</i>Trocar tema</button>
        </div>
    );
}

export default Options;