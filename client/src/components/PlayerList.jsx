function PlayerList({ onClose }) {
    return (
        <div style={{
            backgroundColor: "var(--background)",
            minWidth: 300
        }}>
            <fieldset style={{
                padding: 10
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <p><b>Lista de Jogadores</b></p>
                    <button className="danger" onClick={onClose} style={{
                        padding: 0,
                        margin: 0
                    }}><i>close</i></button>
                </div>
                <div style={{
                    maxHeight: "300px",
                    overflow: "scroll"
                }}>
                    <table style={{
                        marginTop: 0
                    }}>
                        <thead>
                            <tr>
                                <th>Jogador</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Jogador 1</td>
                                <td>$ 10.000</td>
                            </tr>
                            <tr>
                                <td>Jogador 2</td>
                                <td>$ 11.000</td>
                            </tr>
                            <tr>
                                <td>Jogador 3</td>
                                <td>$ 5.455</td>
                            </tr>
                            <tr>
                                <td>Jogador 4</td>
                                <td>$ 4.206</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </fieldset>
        </div>
    );
}

export default PlayerList;