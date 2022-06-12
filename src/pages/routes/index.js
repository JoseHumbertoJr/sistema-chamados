import { Switch } from 'react-router-dom';
import Route from '../routes/Route';

import SignIn from '../Signin';
import SignUp from '../Signup';
import Dashboard from '../Dashboard';
import Perfil from '../Perfil';
import Clientes from '../Clientes';
import Chamado from '../Chamado';

export default function Routes(){
    return (
        <Switch>
            <Route exact path="/" component={SignIn}/>
            <Route exact path="/registrar" component={SignUp}/>
            <Route exact path="/dashboard" component={Dashboard} isPrivate/>
            <Route exact path="/cliente" component={Clientes} isPrivate/>
            <Route exact path="/perfil" component={Perfil} isPrivate/>
            <Route exact path="/chamado" component={Chamado} isPrivate/>
            <Route exact path="/chamado/:id" component={Chamado} isPrivate/>
        </Switch>
    )
}