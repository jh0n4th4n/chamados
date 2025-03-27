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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storageUser = localStorage.getItem('@ticketsPRO');
      if (storageUser) {
        const parsedUser = JSON.parse(storageUser);
        console.log("UID carregado:", parsedUser.uid);
        setUser(parsedUser);
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
      const userDoc = await getDoc(doc(db, "users", uid));

      const data = {
        uid,
        nome: userDoc.data().nome,
        email: firebaseUser.email,
        telefone: userDoc.data().telefone,
        avatarUrl: userDoc.data().avatarUrl,
        role: userDoc.data().role,
      };

      setUser(data);
      storageUser(data);
      toast.success(`Bem-vindo(a) de volta!`);
      navigate("/dashboard");
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

      // ✅ Atualiza o displayName no Auth
      await updateProfile(firebaseUser, {
        displayName: name,
      });

      const uid = firebaseUser.uid;

      await setDoc(doc(db, "users", uid), {
        nome: name,
        telefone,
        avatarUrl: null,
        email,
        setor,
        role,
        lastActive: serverTimestamp(),
      });

      const data = {
        uid,
        nome: name,
        telefone,
        email: firebaseUser.email,
        avatarUrl: null,
        role,
      };

      setUser(data);
      storageUser(data);
      toast.success("Seja bem-vindo ao sistema!");
      navigate("/dashboard");
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const updateUserPassword = async (newPassword) => {
    if (!user) {
      toast.error("Usuário não autenticado!");
      return;
    }

    console.log("UID antes da atualização:", user.uid);
    setLoadingAuth(true);

    try {
      const userAuth = auth.currentUser;
      await updatePassword(userAuth, newPassword);

      await setDoc(doc(db, "users", user.uid), {
        ...user,
        senha: newPassword,
      }, { merge: true });

      console.log("UID após a atualização:", user.uid);
      toast.success("Senha atualizada com sucesso!");
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
      toast.success("E-mail de redefinição de senha enviado com sucesso!");
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const storageUser = (data) => {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data));
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
    navigate("/");
  };

  const handleError = (error) => {
    console.error(error);
    let errorMessage = "Ops, algo deu errado!";
    if (error.code === 'auth/user-not-found') {
      errorMessage = "Usuário não encontrado!";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Senha incorreta!";
    }
    toast.error(errorMessage);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        updateUserPassword,
        resetPassword,
        logout,
        loadingAuth,
        loading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
