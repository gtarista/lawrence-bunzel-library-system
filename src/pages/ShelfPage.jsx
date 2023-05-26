import { useState, useEffect } from 'react';
import { ProfileModal } from '../components/modals/ProfileModal';
import { DropDown } from '../components/DropDown';
import { onSnapshot, query, where } from "firebase/firestore"; 
import { usersRef } from '../firebase-config';
import { Book } from '../components/Book';
import { auth } from '../firebase-config'; 

export const ShelfPage = () => {
    const [borrowedBooks, setBorrowedBooks] = useState();
    const [selection, setSelection] = useState('all');
    const handleSelection = (selection) => {
        setSelection(selection);
    };
    useEffect(() => {
        const userID = auth.currentUser?.uid|| localStorage.getItem('userID');
        const unsubscribe = onSnapshot(query(usersRef, where('ID', '==', userID)), (snapshot) => {
            const userData = snapshot.docs[0].data();
            if(selection === 'all')
                setBorrowedBooks(userData.currentBooks);
            else {
                const filteredBooks = userData.currentBooks.filter((book) => {
                    if(book.genre === selection) return 1;
                });
                setBorrowedBooks(filteredBooks);
            };
        });
        return () => unsubscribe();
    }, [selection]);
    return (
        <>
            {/* <Header /> */}
            <ProfileModal />  
              <div id = "main">
                <div class="panel"> </div>  
                    <div class="quote">
                        <p class="quote-text">User's personal <b>collection</b></p>
                        <hr class="divider" />
                    </div>
                <DropDown handleSelection = {handleSelection}/>
                <div class="books-grid">
                    {borrowedBooks && borrowedBooks.map((book) => {
                        return (
                            <Book 
                                handleExit = {(exitState) => setShowDeletionModal(exitState)}
                                imgURL = {book.imageURL}
                                author = {book.author}
                                title = {book.title}
                                bookID = {book.id}
                                description = {book.description}
                                isShelfBook= {true}
                            />
                        );  
                    })}
                </div>
            </div>
        </>
    );
};

    