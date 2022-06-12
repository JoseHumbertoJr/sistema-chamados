import { useState, useContext } from "react";
import Header from "../../components/Header";
import './perfil.css';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import { FiSettings, FiUpload } from 'react-icons/fi';
import firebase from '../../services/firebaseConection';

import { AuthContext } from "../../contexts/auth";

export default function Perfil(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);
    const [ nome, setNome ] = useState(user && user.nome);
    const [ email, setEmail ] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [image, setImage] = useState(null);

    function preview(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImage(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
            }else{
                alert("Envie uma imagem do tipo PNG ou JPEG");
                setImage(null);
                return null;
            }
        }
    }

    async function upImage(){
        const currentUid = user.uid;

        const upload = await firebase.storage()
        .ref(`images/${currentUid}/${image.name}`)
        .put(image).then(async () => {
            console.log("FOTO ENVIADA COM SUCESSO!");

            await firebase.storage().ref(`images/${currentUid}`)
            .child(image.name).getDownloadURL().then(async (url) => {
                let urlFoto = url;
                await firebase.firestore().collection('users')
                .doc(user.uid).update({
                    avatarUrl: urlFoto,
                    nome: nome
                }).then(() => {
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        nome: nome
                    };
                    setUser(data);
                    storageUser(data);
                })
            })
        })
    }

    async function salvar(e){
        e.preventDefault();
        if(image === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
            })
        }
        else if(image !== null && nome !== '' ){
            upImage();
        }
    }
    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu Perfil">
                    <FiSettings size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={salvar}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25}/>
                            </span>

                            <input type="file" accept="image/*" onChange={preview}/><br/>
                            { avatarUrl === null ? 
                                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario"/>
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario"/>
                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>

                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type="submit">SALVAR</button>
                    </form>
                </div>
                <div className="container">
                    <button className="btn-logout" onClick={() => signOut()}>
                        Sair
                    </button>
                </div>
            </div>            
        </div>
    )
}