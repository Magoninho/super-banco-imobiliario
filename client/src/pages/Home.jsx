import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../assets/SUPER.png'
import { useNavigate } from "react-router";
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

function Home() {

    const navigate = useNavigate();

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 64px)",
                flexDirection: "column"
            }}>
                    <img src={logo} width={300} style={{margin: 0, paddingBottom: 30}} />
                    <fieldset style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "300px"
                }}>
                    <button className='extra' onClick={() => {
                        navigate('/create')
                    }}>Criar sala</button>
                    <button className='extra' onClick={() => {
                        navigate('/join')
                    }}>Entrar na sala</button>
                </fieldset>
            </div>
            <footer>
                <p>Criado por João Felipe Ribeiro <FontAwesomeIcon icon={faCoffee} /></p>
            </footer>
        </>
    );
}

export default Home;