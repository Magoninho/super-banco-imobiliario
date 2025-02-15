import logo from '../assets/SUPER.png'
import { useNavigate } from "react-router";

function Home() {

    const navigate = useNavigate();

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column"
        }}>
                <img src={logo} width={300} style={{margin: 0, paddingBottom: 30}} />
                <fieldset style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "300p"
            }}>
                <button onClick={() => {
                    navigate('/create')
                }}>Criar sala</button>
                <button onClick={() => {
                    navigate('/join')
                }}>Entrar na sala</button>
            </fieldset>
        </div>

    );
}

export default Home;