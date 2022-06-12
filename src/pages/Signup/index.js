import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import logo from '../../assets/logo.png'

function SignUp(){
    const[userName, setUserName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');   
    
    const { signUp, loadingAuth } = useContext(AuthContext);

    function submeter(e){
        e.preventDefault();
        
        if(userName !== '' && email !== '' && password !== ''){
            signUp(email, password, userName);
        }
    }
    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='logo-sistema'/>
                </div>
                <form onSubmit={submeter}>
                    <h1>Cadastre-se</h1>
                    <input type="text" placeholder='Seu nome' value={userName} onChange={(e) => setUserName(e.target.value)}/>
                    <input type="text" placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit'>{loadingAuth ? 'Carregando' : 'Cadastrar'}</button>
                </form>
                <Link to='/' id='criar-conta'>Já tem conta? Entre</Link>
            </div>           
        </div>
    );
}

export default SignUp;