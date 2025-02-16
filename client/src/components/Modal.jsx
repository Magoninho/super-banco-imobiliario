import { useState } from "react";
import NicknameForm from "./NicknameForm";

function Modal({ children }) {

    return (
        <div style={{
            position: "fixed",
            backgroundColor: "#00000005",
            inset: 0,
            zIndex: 999,
            backdropFilter: "blur(20px)"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}>
                { children }
            </div>
        </div>
    );
}

export default Modal;