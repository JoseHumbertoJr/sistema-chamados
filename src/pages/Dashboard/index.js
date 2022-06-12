import { useState, useEffect } from "react";
import "./dashboard.css";
import Title from "../../components/Title";
import Header from "../../components/Header";
import { FiMessageSquare, FiPlus, FiSearch, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import firebase from "../../services/firebaseConection";
import { format } from 'date-fns';
import Modal from "../../components/Modal";

const listaRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

function Dashboard() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDoc] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(()=>{
        carregarChamados();
        return(()=>{

        })
    },[])

    async function carregarChamados(){
        await listaRef.limit(5).get()
        .then((snapshot)=>{
            updateSnapshot(snapshot);
        }).catch((error)=>{
            console.log(error);
            setLoadingMore(false);
        });
        setLoading(false);
    }

    async function updateSnapshot(snapshot){
        const isColletionEmpty = snapshot.size === 0;
        if(!isColletionEmpty){
            let lista = [];
            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length -1];
            setChamados(chamados => [...chamados, ...lista]);
            setLastDoc(lastDoc);
        }else{
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }
    async function carregarMais(){
        setLoadingMore(true);
        await listaRef.startAfter(lastDocs).limit(5).get()
        .then((snapshot) =>{
            updateSnapshot(snapshot)
        })
    }
    if(loading){
        return(
            <div>
                <div className="content">
                    <Title name="Antendimentos">
                        <FiMessageSquare size={25}></FiMessageSquare>
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando Chamados!</span>
                    </div>
                </div>
            </div>
        )
    }

    function modal(item){
        setShowPostModal(!showPostModal);
        setDetail(item);
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Antendimentos">
                    <FiMessageSquare size={25}></FiMessageSquare>
                </Title>
                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado....</span>

                        <Link to="/chamado" className="new" id="semChamado">
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado
                        </Link>
                    </div>
                )
                    :
                    (
                        <>
                            <Link to="/chamado" className="new">
                                <FiPlus size={25} color="#FFF" />
                                Novo chamado
                            </Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col"> Cliente</th>
                                        <th scope="col"> Assunto</th>
                                        <th scope="col"> Status</th>
                                        <th scope="col"> Cadastrado em </th>
                                        <th scope="col"> # </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index)=>{
                                        console.log(chamados);
                                        return(
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{backgroundColor: item.status === "Aberto" ? '#5cb85c' : "#999"}}>{item.status}</span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormated}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => modal(item)}>
                                                        <FiSearch color="#FFF" size={17}/>
                                                    </button>
                                                    <Link className="action" style={{ backgroundColor: '#F6a935' }} to={`/chamado/${item.id}`}>
                                                        <FiEdit color="#FFF" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={carregarMais}>Buscar mais</button>}
                        </>
                    )}
            </div>
            {showPostModal && (
                <Modal conteudo={detail} close={modal}/>
            )}
        </div>
    )
}


export default Dashboard;