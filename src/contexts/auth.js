import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
        avatarUrl: docSnap.data().avatarUrl,
      };

      setUser(data);
      storageUser(data);
      toast.success("Bem-vindo(a) de volta!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Ops, algo deu errado!");
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signUp(email, password, name, setor) {
    setLoadingAuth(true);
    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      await setDoc(doc(db, "users", uid), {
        nome: name,
        avatarUrl: null,
        email: email,
        setor: setor,
      });

      const data = {
        uid: uid,
        nome: name,
        email: value.user.email,
        avatarUrl: null,
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

  function storageUser(data) {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
    navigate("/"); // Navegar para a página inicial após logout
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
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
