import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contratos, setContratos] = useState([]);
  const navigate = useNavigate();

  const storageUser = (data) => {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data));
  };

  useEffect(() => {
    const loadUser = () => {
      const storageUserData = localStorage.getItem('@ticketsPRO');
      if (storageUserData) {
        const parsedUser = JSON.parse(storageUserData);
        setUser(parsedUser);
        loadUserContracts(parsedUser.uid);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email, password) => {
    setLoadingAuth(true);
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const uid = firebaseUser.uid;
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        toast.error('Usuário não encontrado no banco de dados.');
        setLoadingAuth(false);
        return;
      }

      const data = {
        uid,
        nome: userDoc.data().nome,
        email: firebaseUser.email,
        telefone: userDoc.data().telefone,
        avatarUrl: userDoc.data().avatarUrl,
        role: userDoc.data().role || 'user',
        setor: userDoc.data().setor || 'Setor não definido',
      };

      setUser(data);
      storageUser(data);
      loadUserContracts(uid);
      toast.success('Bem-vindo(a) de volta!');
      navigate('/dashboard');
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const signUp = async (email, password, name, telefone, setor, role = 'user') => {
    setLoadingAuth(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName: name });

      const uid = firebaseUser.uid;

      const userData = {
        nome: name,
        telefone,
        avatarUrl: null,
        email,
        setor,
        role,
        lastActive: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', uid), userData);

      const data = { uid, ...userData };

      setUser(data);
      storageUser(data);
      loadUserContracts(uid);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const updateUserPassword = async (newPassword) => {
    if (!user) return toast.error('Usuário não autenticado!');

    setLoadingAuth(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Senha atualizada com sucesso!');
      logout();
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const resetPassword = async (email) => {
    setLoadingAuth(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de redefinição enviado!');
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
    setContratos([]);
    navigate('/');
  };

  const handleError = (error) => {
    console.error(error);
    let msg = 'Ops, algo deu errado!';
    if (error.code === 'auth/user-not-found') msg = 'Usuário não encontrado!';
    if (error.code === 'auth/wrong-password') msg = 'Senha incorreta!';
    toast.error(msg);
  };

  // 🔁 Função para carregar contratos do usuário
  const loadUserContracts = async (uid) => {
    if (!uid) return;
    try {
      const contratosRef = collection(db, 'contratos');
      const q = query(contratosRef, where('userId', '==', uid));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContratos(lista);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
    }
  };

  // ➕ Criar contrato
  const criarContrato = async (dados) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'contratos'), {
        ...dados,
        userId: user.uid,
        created: serverTimestamp(),
      });
      loadUserContracts(user.uid);
      toast.success('Contrato salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar contrato.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        contratos,
        signIn,
        signUp,
        updateUserPassword,
        resetPassword,
        logout,
        criarContrato,
        setUser,
        setContratos,
        loadingAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
