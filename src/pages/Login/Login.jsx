import React, {useState} from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { InputText } from "../../common/InputText/InputText";
import { checkError } from "../../services/useful";
import { logIn } from "../../services/apiCalls";
import { useNavigate } from "react-router-dom"; 
//RDX
//Importo métodos de Redux
import { useDispatch, useSelector } from "react-redux";
import { login, userData } from "../userSlice";
import jwtDecode from "jwt-decode";

export const Login = () => {
  
  //Dispatch escritura
  const dispatch = useDispatch();

  //useSelector es para el modo de lectura
  const credentialsRdx = useSelector(userData);

// Instanciamos el useNavigate dentro de la constante
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [credentialsError, setCredentialsError] = useState({
    emailError: "",
    passwordError: ""
  }) 

  const [welcome, setWelcome] = useState("");

  const InputHandler = (e) => {
    // Ahora procedemos a bindear(atar) los inputs mediante la presente
    // función handler a sus correspondientes estados del Hook, que se llama credentials

    setCredentials((prevState) => ({
        ...prevState,
        //En este punto es donde el handler 
        //asigna el valor a la propiedad adecuada....
        [e.target.name]: e.target.value,
      }));
  }

  const inputCheck = (e) => {

    let errorMessage = checkError(e.target.name, e.target.value);

    setCredentialsError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: errorMessage,
    }));
    // console.log(e.target.name, "soy el check.....");
  }


  const logInMe = (body) => {
  
    logIn(body)
    .then((results) => {
      let decodificated = jwtDecode(results);
      console.log(decodificated)
      // localStorage.setItem("token", results.data.token);

      //Guardo en redux.....
      dispatch(login({
        token: results,
        name: decodificated.userName,
        role: decodificated.roleId
      }))

      setTimeout(() => {
        navigate("/");
      }, 1000);

      setWelcome(`Nos alegramos de verte ${decodificated?.userName}`);
    })
    .catch((error) => console.log(error));
  };


  return (
    <div className="mainLogin">
      <div className="loginDesign">
      {welcome !== "" ? (
        <div>{welcome}</div>
      ) : (
        <div className="mainLogInDesign">Pide tu cita on-line
          {/* La utilidad de la siguiente linea es renderizar un hook at tiempo real en el DOM */}
          {/* {<pre>{JSON.stringify(credentials, null, 2)}</pre>} */}

          <InputText
            type={"email"}
            design={
              credentialsError.emailError === ""
                ? "normalInput"
                : "normalInput errorInput"
            }
            placeholder={"Introduce tu e-mail"}
            name={"email"}
            functionHandler={InputHandler}
            onBlurFunction={inputCheck}
          />
          <div className="errorText">{credentialsError.emailError}</div>
          <InputText
            type={"password"}
            design={
              credentialsError.passwordError === ""
                ? "normalInput"
                : "normalInput errorInput"
            }
            placeholder={"Introduce tu contraseña"}
            name={"password"}
            functionHandler={InputHandler}
            onBlurFunction={inputCheck}
          />
          <div className="errorText">{credentialsError.passwordError}</div>

          <div onClick={() => logInMe(credentials)} className="logButton">
            Iniciar sesión
          </div>
          <div className="registerLinkText">¿No tienes una cuenta?
          <Link to="/register" className="registerLink">
           ¡Regístrate aquí!
          </Link>
          </div>
          
          
        </div>
      )}
    </div>
    </div>
    
  );
};
