import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { roomCode } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Voce nao tem permissao para entrar nessa sala");
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }
        
        // if the roomcode from the token that the user has is not the same as the roomcode on the url
        let decodedRoomCode = jwtDecode(token).roomCode;

        if (roomCode != decodedRoomCode) {
            alert("Voce nao tem permissao para entrar nessa sala");
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);


        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow' 
        };

        fetch(`${ process.env.API_URL || "http://localhost:3000" }/room/verify-token`, requestOptions)
            .then(response => {
                if (response.ok) {
                    setIsAuthenticated(true);
                    return response.text();    
                }

                alert("Voce nao tem permissao para entrar nessa sala");
                setIsAuthenticated(false);
                navigate('/join');
            })
            .catch(error => {
                alert("Erro no servidor", error);
                setIsAuthenticated(false);
                navigate('/join');
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? children : <Navigate to={'/join'} />;
}

export default ProtectedRoute;