import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import './signin.css';


function SignIn(){
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const {signIn, loadingAuth} = useContext(AuthContext);

    function submeter(e){
        e.preventDefault();
        if(email !== '' && password !== ''){
            signIn(email, password);
        }
    }
    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='logo-sistema'/>
                </div>
                <form onSubmit={submeter}>
                    <h1>Entrar</h1>
                    <input type="text" placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit'>{loadingAuth ? 'Carregando' : 'Entrar'}</button>
                </form>
                <Link to='/registrar' id='criar-conta'>Criar uma conta</Link>
            </div>           
        </div>
    );
}

export default SignIn;