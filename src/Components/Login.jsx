import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Logo from "../image/logo.gif";
import { auth } from "../Config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [click, setClick] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (email !== "" && password !== "") {
            setClick(true)
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    navigate(
                        "/"
                    )
                    setClick(false)

                })
                .catch((error) => {
                    const errorMessage = error.message;
                    if (errorMessage === "Firebase: Error (auth/user-not-found).") {
                        swal({
                            title: "Dangerous!",
                            text: `You don't have any access of this account.`,
                            icon: "warning",
                            dangerMode: true,
                        })
                    }
                    else {
                        swal({
                            title: "Oops!",
                            text: `Incorrect Password.`,
                            icon: "warning",
                            dangerMode: true,
                        })
                    }
                    setClick(false)
                });
            setClick(false)
        }
        else {
            swal({
                title: "Oops!",
                text: `Fill All Data`,
                icon: "warning",
                dangerMode: true,
            })
        }
    }

    return (
        <>
            <div className="box">
                <div className="wrapper">
                    <div className="logo">
                        <img src={Logo} alt="logo" />
                    </div>
                    <form className="p-3 mt-3">
                        <div className="form-field d-flex align-items-center">
                            <span className="far fa-user" />
                            <input type="email" name="email" id="email" placeholder="Email Address" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        </div>
                        <div className="form-field d-flex align-items-center">
                            <span className="fas fa-key" />
                            <input type="password" name="password" id="pwd" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <div className="text-center">
                            {
                                click
                                    ? <button className="btn" onClick={handleSubmit} disabled={click}>
                                        <div className="spinner-border"></div>
                                    </button>
                                    : <button className="btn" onClick={handleSubmit}>
                                        Login
                                    </button>
                            }
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Login
