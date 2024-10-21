import { useContext, useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { db, storage } from '../../services/firebaseConnection';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import './profile.css';

export default function Profile() {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [imageAvatar, setImageAvatar] = useState(null);
  
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || ''); // Usar o role como tipo de perfil

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl);
      setNome(user.nome);
      setEmail(user.email);
      setRole(user.role); // Atualiza o role
    }
  }, [user]);

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("Envie uma imagem do tipo PNG ou JPEG");
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleUpload() {
    const currentUid = user.uid;
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

    const uploadTask = uploadBytes(uploadRef, imageAvatar)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          let urlFoto = downloadURL;

          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, {
            avatarUrl: urlFoto,
            nome: nome,
          })
            .then(() => {
              let data = {
                ...user,
                nome: nome,
                avatarUrl: urlFoto,
              };

              setUser(data);
              storageUser(data);
              toast.success("Atualizado com sucesso!");
            });
        });
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (imageAvatar === null && nome !== '') {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
      })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
          };

          setUser(data);
          storageUser(data);
          toast.success("Atualizado com sucesso!");
        });

    } else if (nome !== '' && imageAvatar !== null) {
      handleUpload();
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
          <label className="label-avatar">
  <span>
    <FiUpload color="#FFF" size={25} />
  </span>

  <input type="file" accept="image/*" onChange={handleFile} /> <br />

  {avatarUrl ? (
    <img src={avatarUrl} alt="Foto de perfil" className="profile-img" />
  ) : (
    <img src={avatar} alt="Foto de perfil" className="profile-img" />
  )}
</label>


            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />

            <label>Tipo de Perfil</label>
            <input type="text" value={role} disabled={true} />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button className="logout-btn" onClick={() => logout()}>Sair</button>
        </div>
      </div>
    </div>
  );
}
