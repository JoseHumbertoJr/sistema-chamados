import './cliente.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import { FiUser} from 'react-icons/fi';
import { useState } from 'react';
import firebase from '../../services/firebaseConection';
import { toast } from 'react-toastify';

export default function Clientes(){
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function Cadastrar(e){
        e.preventDefault();
        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            }).then(() => {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.info("EMPRESA CADASTRADA COM SUCESSO!");
            }).catch((error) => {
                console.log(error);
                toast.error("ERRO AO CADASTRAR EMPRESA :(");
            })
        }else{
            toast.error("PREENCHA TODOS OS CAMPOS!");
        }
    }

    return(
        <div>
            <Header></Header>
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25}></FiUser>
                </Title>
                <div className='container'>
                    <form className='form-profile customers' onSubmit={Cadastrar}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder='Nome da sua empresa' value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)}></input>

                        <label>CNPJ</label>
                        <input type="number" placeholder='Seu CNPJ' value={cnpj} onChange={(e) => setCnpj(e.target.value)}></input>

                        <label>Endereco</label>
                        <input type="text" placeholder='Endereço da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)}></input>

                        <button type='submit'>Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}