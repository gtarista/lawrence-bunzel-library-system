import { useEffect, useState } from 'react';
import { DropDown } from "../components/DropDown";
import { booksRef, usersRef } from '../firebase-config';
import { onSnapshot, query, where } from "firebase/firestore"; 
import { useBook, getDueDate } from '../hooks/useBook';
import { SHELF, HOME } from '../lib/routes';
import { useNavigate } from 'react-router-dom';
import { ProfileModal } from '../components/modals/ProfileModal';
import './AboutBookPage.css'
import '../css/defPanels.css';
import { headerIcon, backButtonIcon, addButtonIcon } from '../assets/config';

export const AboutBookPage = () => {
    const [book, setBook] = useState();
    const [dueDate, setDueDate] = useState();
    const [ownsBook, setOwnsBook] = useState();
    const [accountType, setAccountType] = useState('user');
    const {borrowBook, deleteBook, returnBook} = useBook();
    const navigate = useNavigate();
    const handleBorrow = async () => {
        try {
            await borrowBook(book.id);
            navigate(SHELF);
        } catch(error) {
            console.log(error.message);
        }
    };
    const handleDelete = async () => {
        try {
            await deleteBook(book.id);
            navigate(HOME);
        } catch(error) {
            console.log(error.message);
        }
    };
    const handleReturn = async () => {
        try {
            await returnBook(book.id);
            navigate(HOME);
        } catch(error) {
            console.log(error.message);
        }
    }
    const handleSelection = (selection) => {
        setSelection(selection);
    };
    
    useEffect(() => {
        const querriedBook = localStorage.getItem('queriedBOOKID');
        if(!querriedBook) return;
        const unsubscribe = onSnapshot(query(booksRef, where('id', '==', querriedBook)), (snapshot) => {
            if(!(snapshot.docs[0])) {returnBook(querriedBook); navigate(HOME)};
            const selectedBookData = snapshot.docs[0].data();
            setBook(selectedBookData);
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        const userID = localStorage.getItem('userID');
        const querriedBook = localStorage.getItem('queriedBOOKID');
        if(!userID) return;
        if(!querriedBook) return;
        
        const unsubscribe = onSnapshot(query(usersRef, where('ID', '==', userID)), (snapshot) => {
            const selectedUserBookData = snapshot.docs[0].data();
            if(selectedUserBookData.length == 0) return;
            let isMatched = false;
            selectedUserBookData.currentBooks.map((book) => {
                if(querriedBook === book.id) {
                    isMatched = true;
                    setDueDate(book.borrowedTimestamp);
                }
            });
            console.log(isMatched);
            setOwnsBook(isMatched);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const accountType = localStorage.getItem('accountType');
        if(!accountType) navigate(LANDINGPAGE);
        setAccountType(accountType);
    }, []);
    return (
        <>
        <ProfileModal />
        <div id = "main">   
        {book && (  
            <>
            <div className="about-book">
                <div className="about-body-top">
                    <div className="about-back-div">
                        <a href="#" className="logo-div">
                            <img className="about-back-logo" src={backButtonIcon} onClick = {() => {navigate(HOME)}}/>
                        </a>
                    </div>
                    <div className="about">
                        <p><b>ABOUT THE BOOK</b></p>
                    </div>
                    <DropDown handleSelection = {handleSelection}/>
                </div>  
                <div className="about-border">
                    <div className="about-image">
                        <img className="about-cover" src = {book.imageURL && book.imageURL} />
                    </div>
                    <div className="about-details-interact">
                            
                        <div className="about-details">
                            <p className="about-title-text">
                                {book.title && book.title}
                            </p>
                            <p className="about-author-text">
                                {book.author && book.author}
                            </p>
                            <p className="about-desc-text">
                                {book.description && book.description}
                            </p>
                        </div>
                            
                        <div className="about-interact">
                            <div className="status">
                                
                                    {ownsBook? (
                                        <div>Due Date:  <u>{getDueDate(dueDate)}</u></div>
                                    )
                                :
                                (
                                    <>
                                    {book.isAvailable? (
                                        <p>Status: <u>Available</u></p>
                                    )
                                :
                                (
                                    <p>Status: <u>Available</u></p>
                                )
                                }
                                    </>
                                )}
                        
        
                            </div>
                            {accountType === 'admin'? (
                                    <div className="about-button">
                                        <button className="about-delete-button" onClick = {handleDelete}> Delete </button>
                                    </div> 
                                )
                                :
                                (
                                    <>
                                        {ownsBook? (
                                            <div className="about-button">
                                                <button className="about-return-button" onClick = {handleReturn}> Return </button>
                                            </div> 
                                        )
                                        :
                                        (
                                            <div className="about-button">
                                                <button className="about-borrow-button" onClick = {handleBorrow}> Borrow </button>
                                            </div>
                                        )}
                                    </> 
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel"> </div>

            </>
            )}
            </div>
        </>
    );
};