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
  const [email] = useState(user?.email || ''); // O email não deve ser editável
  const [role] = useState(user?.role || ''); // O role não deve ser editável

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl);
      setNome(user.nome);
    }
  }, [user]);

  const handleFile = (e) => {
    const image = e.target.files[0];

    if (image) {
      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.error("Envie uma imagem do tipo PNG ou JPEG");
        setImageAvatar(null);
      }
    }
  };

  const handleUpload = async () => {
    const currentUid = user.uid;
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

    try {
      const snapshot = await uploadBytes(uploadRef, imageAvatar);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const docRef = doc(db, "users", currentUid);
      await updateDoc(docRef, {
        avatarUrl: downloadURL,
        nome: nome,
      });

      const updatedUser = {
        ...user,
        nome: nome,
        avatarUrl: downloadURL,
      };

      setUser(updatedUser);
      storageUser(updatedUser);
      toast.success("Atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "users", user.uid);
      let updatedUser = { ...user };

      if (imageAvatar) {
        await handleUpload();
      } 

      if (nome !== user.nome) { // Verifica se o nome foi alterado
        await updateDoc(docRef, { nome: nome });
        updatedUser.nome = nome; // Atualiza o nome no objeto user
        toast.success("Nome atualizado com sucesso!");
      }

      setUser(updatedUser);
      storageUser(updatedUser);

    } catch (error) {
      toast.error("Erro ao atualizar informações: " + error.message);
    }
  };

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
              <input type="file" accept="image/*" onChange={handleFile} />
              <br />
              <img
                src={avatarUrl || avatar}
                alt="Foto de perfil"
                className="profile-img"
              />
            </label>

            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Email</label>
            <input type="text" value={email} disabled />

            <label>Tipo de Perfil</label>
            <input type="text" value={role} disabled />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button className="logout-btn" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
