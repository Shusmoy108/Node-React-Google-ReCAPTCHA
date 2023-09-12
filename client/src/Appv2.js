import './App.css';
import React, { useState, useRef } from 'react';
import Axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';




function App() {

  const [SuccessMsg, setSuccessMsg] = useState("")
  const [ErrorMsg, setErrorMsg] = useState("")
  const [valid_token, setValidToken] = useState([]);
  const captchaRef = useRef(null);

  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const SECRET_KEY = process.env.REACT_APP_reCAPTCHA_SECRET_KEY;



  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = captchaRef.current.getValue();
    captchaRef.current.reset();

   
    if(token){
      
      let valid_token = await verifyToken(token);
      setValidToken(valid_token);

      if(valid_token[0].success === true){
        console.log("verified");
        setSuccessMsg("Hurray!! you have submitted the form")
      }else{
        console.log("not verified");
        setErrorMsg(" Sorry!! Verify you are not a bot")
      }

  }
}

const verifyToken = async (token) => {
  let APIResponse = [];

  try {
    let response = await Axios.post(`http://localhost:8000/verify-token`, {
      reCAPTCHA_TOKEN: token,
      Secret_Key: SECRET_KEY,
    });
    APIResponse.push(response['data']);
    return  APIResponse;
  } catch (error) {
    console.log(error);
  }
};


 
  return (
    <div className="App">
      <header className="App-header">      
        <div className="logIn-form">
            <form onSubmit={handleSubmit}>
             {valid_token.length > 0 && valid_token[0].success === true ? <h3 className="textSuccess">{SuccessMsg}</h3>: <h3 className="textError">{ErrorMsg} </h3> }                            
                <p>User Name</p>
                  <input
                  type="text" 
                  placeholder="User Name..."
                  />

                <p> Password</p>
                  <input 
                  type="password" 
                  placeholder = "Password..."  
                  />

                  <ReCAPTCHA
                    className="recaptcha"
                    sitekey={SITE_KEY}
                    ref={captchaRef}
                   
                  />
                  <button type="submit">Submit</button>
            </form>
        </div>
      </header>
    </div>
  );
}

export default App
