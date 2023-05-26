import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, usersRef } from '../firebase-config.js';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc} from 'firebase/firestore';
import { LANDINGPAGE } from '../lib/routes.js';
export const useAuth = () => {
    const navigate = useNavigate();
    const login = async (username, password, path) => {
        try {   
            await signInWithEmailAndPassword(auth,`${username}@gmail.com`, password);
            const userDocRef = doc(usersRef, auth.currentUser?.uid);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data();
            localStorage.setItem('accountType', `${data.accountType}`);
            localStorage.setItem('userID', auth.currentUser?.uid);
            navigate(path);
        } catch(error) {
            console.log(error.message);
        }
    };
    const registerUser = async (fullName, username, password, path) => {
        try {
            await createUserWithEmailAndPassword(auth, `${username}@gmail.com`, password);
            await signInWithEmailAndPassword(auth,`${username}@gmail.com`, password);
            const userDoc = doc(usersRef, auth.currentUser.uid);
            await setDoc(userDoc, {
                ID: auth.currentUser.uid,
                username: username,
                fullName: fullName,
                email: `${username}@gmail.com`,
                currentBooks: [],
                accountType: 'user', 
            });
            localStorage.setItem('accountType', 'user');
            localStorage.setItem('userID', auth.currentUser?.uid);
            navigate(path);
        } catch(error) {
            console.log(error.message);
        }
    };
    const logout = async () => {
        try {
            localStorage.clear();
            await signOut(auth);
            navigate(LANDINGPAGE);
        } catch(error) {
            console.log(error.message);
        }
    };
    return {login, registerUser, logout};
};