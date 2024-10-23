import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem('@ticketsPRO');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // Função para login de usuário
  async function signIn(email, password) {
    setLoadingAuth(true);
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      const data = {
        uid: uid,
        nome: docSnap.data().nome,
        email: value.user.email,
        telefone: docSnap.data().telefone,
        avatarUrl: docSnap.data().avatarUrl,
        role: docSnap.data().role,
      };

      setUser(data);
      storageUser(data);
      toast.success(`Bem-vindo(a) de volta!`);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Ops, algo deu errado!");
    } finally {
      setLoadingAuth(false);
    }
  }

  // Função para cadastro de usuário com campos adicionais
  async function signUp(email, password, name, telefone, setor, role = 'user') {
    setLoadingAuth(true);
    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      await setDoc(doc(db, "users", uid), {
        nome: name,
        telefone: telefone,
        avatarUrl: null,
        email: email,
        setor: setor,
        role: role,
      });

      const data = {
        uid: uid,
        nome: name,
        telefone: telefone,
        email: value.user.email,
        avatarUrl: null,
        role: role,
      };

      setUser(data);
      storageUser(data);
      toast.success("Seja bem-vindo ao sistema!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar conta. Tente novamente!");
    } finally {
      setLoadingAuth(false);
    }
  }

  // Função para atualizar a senha do usuário
  async function updateUserPassword(newPassword) {
    if (!user) {
      toast.error("Usuário não autenticado!");
      return;
    }
    
    setLoadingAuth(true);
    try {
      const userAuth = auth.currentUser;
      await updatePassword(userAuth, newPassword);
      
      // Atualiza a senha no Firestore (opcional)
      await setDoc(doc(db, "users", user.uid), {
        ...user,
        senha: newPassword,
      }, { merge: true });

      toast.success("Senha atualizada com sucesso!");
      logout();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar a senha. Tente novamente!");
    } finally {
      setLoadingAuth(false);
    }
  }

  // Função para redefinir a senha do usuário
  async function resetPassword(email) {
    setLoadingAuth(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("E-mail de redefinição de senha enviado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar o e-mail de redefinição de senha. Tente novamente!");
    } finally {
      setLoadingAuth(false);
    }
  }

  function storageUser(data) {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        updateUserPassword,
        resetPassword, // Adiciona a função de redefinição de senha
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
