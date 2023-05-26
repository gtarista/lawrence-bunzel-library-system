import { DropDown } from "../components/DropDown";
import { useState, useEffect} from 'react';
import { Book } from "../components/Book";
import { onSnapshot, query, where } from "firebase/firestore"; 
import { booksRef, usersRef, auth} from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { ProfileModal } from "../components/modals/ProfileModal";
import { hasSevenDaysPassed, useBook } from '../hooks/useBook';
import '../css/defPanels.css';
import './HomePage.css';


export const HomePage = () => {
    const [selection, setSelection] = useState('all');
    const [filteredBooks, setFilteredBooks] = useState([{}]);
    const [showDeletionModal, setShowDeletionModal] = useState(false);
    const [currentBooks, setCurrentBooks] = useState([]);
    const [accountType, setAccountType] =  useState("");
    const {returnBook} = useBook();
    const navigate = useNavigate();

    const ghostReturn = async(toBeReturnedBookID) => {
        try {
            await returnBook(toBeReturnedBookID);
        } catch(error) {    
            console.log(error.message); 
        }
    };

    const handleSelection = (selection) => {
        setSelection(selection);
    };
    useEffect(() => {
        const fetchAccountInfo = localStorage.getItem("accountType")
        setAccountType(fetchAccountInfo)
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(booksRef, (snapshot) => {
            const filteredBooks = snapshot.docs.filter((doc) => {
                if (selection === 'all') return true;
                return doc.data().genre === selection;
            }).map((doc) => doc.data());
            setFilteredBooks(filteredBooks);
        }); 
        return () => unsubscribe();
    }, [selection]);

    useEffect(() => {
        const userID = auth.currentUser?.uid || localStorage.getItem('userID');
        if(!userID) return;
        console.log(userID);
        const unsubscribe = onSnapshot(query(usersRef, where('ID', '==', userID)), (snapshot) => {
            const filteredIDS = []
            snapshot.docs[0].data().currentBooks.map((book) => {
                if(hasSevenDaysPassed(book.borrowedTimestamp)) ghostReturn(book.id);
                const id = book.id;
                filteredIDS.push(id);
            })
            setCurrentBooks(filteredIDS);
        });
        return () => unsubscribe(); 
    }, []);

    return (
        <>
            {/* <Header /> */}
            <ProfileModal />           
            <div id = "main">
                <div className="quote">
                    <p className="quote-text">Welcome to your <b>Unlimited Learning Experience</b></p>
                    <hr className="divider" />
                </div>
                <div class="body-top">
                    <div class="about-div">
                        { accountType === "admin" &&  <button className = "add-button" onClick = {() => navigate('/CREATEBOOK')}>&#43; ADD BOOK</button> }
                    </div>
                    <DropDown handleSelection = {handleSelection}/>
                </div>
                <div className="books-grid">
                    {filteredBooks.map((book) => {
                        if(!currentBooks.includes(book.id)) {
                            if(book.isAvailable) return (
                                <Book 
                                    imgURL = {book.imageURL}
                                    author = {book.author}
                                    title = {book.title}
                                    bookID = {book.id}
                                    description = {book.description}
                                />
                            );
                        }
                    })}
                </div>
                <div id="panel" className="panel"> </div>
            </div>
            
        </> 
    );
};

// We need to do real time
        // Database fetching from the book collection.
        // There are two types of selections 'fiction' or 'nonfiction'
        // we will real time set the filteredBooks to the books wiht the corresponding genre.
        /*
        This is the book skeleton from firebase firestore.
        we can use the bookRef import <--- this is defined as this in our config file: export const booksRef = collection(db, 'books');
        
                Book ID: 23487283478234
                    ID: 23487283478234
                    genre: 'Fiction'
                    title: 'Moby Dick'
                    author: 'Joosh'
                    description: 'I think this is cute'
                    availableQuantity: 5
                    isAvailable: true
                    imageURL: thisIsAnImageLink.com
        */