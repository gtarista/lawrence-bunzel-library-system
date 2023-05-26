import { accountButtonIcon } from "../../assets/config";
import { useModal } from "../../hooks/useModal";
import { useEffect, useState } from "react";
import { auth, usersRef } from "../../firebase-config";
import { onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { LANDINGPAGE } from "../../lib/routes";
import './ProfileModal.css';

export const ProfileModal = () => {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [email, setEmail] = useState('');
    const {closeAccountModal} = useModal();
    const { logout } = useAuth();

    useEffect(() => {
        const userID = auth.currentUser?.uid|| localStorage.getItem('userID').trim();
        if(!userID) return;
        const unsubscribe = onSnapshot(query(usersRef, where('ID', '==', userID)), (snapshot) => {
            const userData = snapshot.docs[0].data();
            setUserName(userData.username);
            setName(userData.fullName);
            setAccountType(userData.accountType);
            setEmail(userData.email);
        });
        return () => unsubscribe();
    }, []);
    return (
        <div id="mySidebar" class = "sidebar">
            <a href = "javascript:void(0)" class = "close-button" onClick = {() => closeAccountModal()}>×</a>
            <img class = "sidebar-profile" src = {accountButtonIcon}/> 
            <p class = "text-sidebar"> PROFILE INFORMATION </p>
            <p class = "text-sidebar-name"> Name       : {name && name}</p>
            <p class = "text-sidebar-user"> Username   : {userName && userName}</p>
            <p class = "text-sidebar-mail"> Email      : {email && email}</p>
            <p class = "text-sidebar-type"> Account Type : {accountType && accountType}</p>
            <div className = "userLogin-1.html"> <button className = "logout-button" onClick = {async () => await logout(LANDINGPAGE)}>  LOG OUT </button> </div>
        </div>
    );
};
