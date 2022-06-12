import './chamado.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import { FiPlusCircle } from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

export default function Chamado(){
    const {id} = useParams();
    const history = useHistory();
    const [idChamado, setIdChamado] = useState(false);
    const [carregarChamado, setCarregarChamado] = useState(true);
    const [chamado, setChamado] = useState([]);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function carregarChamado(){
            await firebase.firestore().collection('customers').get()
            .then((snapshot) => {
                let lista = [];
                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })
                if(lista.length === 0){
                    console.log("NEHUMA EMPRESA ENCONTRADA");
                    setChamado([{id: '1', nomeFantasia: 'Freela'}]);
                    setCarregarChamado(false);
                    return;
                }
                setChamado(lista);
                setCarregarChamado(false);
                if(id){
                    loadId(lista);
                }
            })
            .catch((error) =>{
                console.log(error);
                setCarregarChamado(false);
                setChamado([{id: '1', nomeFantasia: ''}])
            })
        }
        carregarChamado();
    }, [])

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id).get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setChamadoSelecionado(index);
            setIdChamado(true);
        })
        .catch((error)=>{
            console.log(error);
            setIdChamado(false);
        })
    }

    function SelectAssunto(e){
        setAssunto(e.target.value);
    }

    function Status(e){
        setStatus(e.target.value);
    }

    async function Registrar(e){
        e.preventDefault();
        if(idChamado){
            await firebase.firestore().collection('chamados').doc(id).update({
                cliente: chamado[chamadoSelecionado].nomeFantasia,
                clienteId: chamado[chamadoSelecionado].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() =>{
                toast.success("Chamado Editado com sucesso!");
                setChamadoSelecionado(0);
                setComplemento('');
                history.push('/dashboard');
            })
            .catch((error) => {
                toast.error("Ops erro ao registrar :( tente mais tarde!")
            })
            return;
        }
        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: chamado[chamadoSelecionado].nomeFantasia,
            clienteId: chamado[chamadoSelecionado].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success("Chamado criado com sucesso!");
            setComplemento('');
            setChamadoSelecionado(0);
        })
        .catch(()=>{
            toast.error("Algo deu errado :(");
        })
    }

    function selecionarCliente(e){
        setChamadoSelecionado(e.target.value);
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name="Novo chamado">
                    <FiPlusCircle size={25}/>
                </Title>
                <div className='container'>
                    <form className='form-profile' onSubmit={Registrar}>
                        <label>Cliente</label>
                        {carregarChamado ? (
                            <input type="text" disabled={true} value="Carregando clientes..."/>
                        ):(
                        <select value={chamadoSelecionado} onChange={selecionarCliente}>
                            {chamado.map((item, index) =>{
                                return(
                                    <option key={item.id} value={index}>{item.nomeFantasia}</option>
                                )
                            })}
                        </select>
                        )
                        }
                        <label>Assunto</label>
                        <select value={assunto} onChange={SelectAssunto}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>
                        <label>Status</label>
                        <div className='status'>
                            <input
                            type='radio'
                            name='radio' value='Aberto'
                            onChange={Status}
                            checked={status === 'Aberto'}
                            />
                            <span>Em Aberto</span>

                            <input
                            type='radio'
                            name='radio' value='Progresso'
                            onChange={Status}
                            checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>

                            <input
                            type='radio'
                            name='radio' value='Atendido'
                            onChange={Status}
                            checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text" placeholder='Descreva seu problema (opcional).'
                        value={complemento}
                        onChange={ (e) => setComplemento(e.target.value)}
                        />

                        <button>Registrar</button>
                    </form>
                </div>
            </div>            
        </div>
    )
}