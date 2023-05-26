import { homeButtonIcon, shelfButtonIcon, accountButtonIcon, headerIcon, searchButtonIcon  } from '../assets/config';
import { useModal } from '../hooks/useModal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksRef } from '../firebase-config';
import { SHELF, HOME, ABOUTBOOK } from '../lib/routes';
import { onSnapshot } from "firebase/firestore"; 
import { useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [books, setBooks] = useState(null);
    const [query, setQuery] = useState(null);
    const {openAccountModal, closeAccountModal} = useModal();
    const navigate = useNavigate();
    const location = useLocation();
    function handleAccountClick() { //
        try {
            let navState = isOpen; // False 
            setIsOpen(!navState); // set Opposite, so we have to open...
            if(navState) {openAccountModal()}
            else closeAccountModal();
        } catch(error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if(!query || query.length < 1) {setBooks([]); return;}
        const unsubscribe = onSnapshot(booksRef, (snapshot) => {
            const fetchedBooks = [];
            snapshot.docs.map((doc) => {
                fetchedBooks.push(doc.data());
            });
            const filteredFetchedBooks = fetchedBooks.filter((book) => {
                if(book.title.toLowerCase().startsWith(query.toLowerCase())) return 1;
            });
            if(!(filteredFetchedBooks.length === snapshot.docs.length))
                setBooks(filteredFetchedBooks);
            else setBooks([]);
        }); 
        return () => unsubscribe();
    }, [query]);
    
    return (
        <>
         <div className="header">
            <div className="left-section">
                <img className="header-logo" src={headerIcon}/>
            </div>
            <div className="right-section">
                    <div className="search">
                        <div>
                            <input className="search-box" type="text" placeholder={'Search :'} value = {query && query} onChange = {(e) => {setQuery(e.target.value)}}/>
                            <div className = 'query-grid'>
                                { books && books.map((book) => { 
                                        return (
                                            <>  
                                                <div className = 'QueryBox'>
                                                    <div className = 'QueryResult' style = {{cursor: 'pointer'}} onClick = {() => {
                                                        if(location.pathname != ABOUTBOOK) {
                                                            localStorage.setItem('queriedBOOKID', book.id);
                                                            setQuery(null);
                                                            navigate(ABOUTBOOK);
                                                        } else {
                                                            localStorage.setItem('queriedBOOKID', book.id);
                                                            setQuery(null);
                                                        }
                                                    }}>{book.title}</div>
                                                    <br />
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div>
                            <button className="search-button">
                                <img className="search-logo" src={searchButtonIcon}/>
                            </button>
                        </div>
                        
                    </div>
                
                <button className="home-button">
                    <img className="home-logo" onClick={()=>{navigate(HOME)}} src={homeButtonIcon}/>
                </button>
                <button className="shelf-button">
                    <img className="shelf-logo" onClick={()=>navigate(SHELF)} src={shelfButtonIcon}/>
                </button>
                <button className="account-button">
                    <img className="account-logo" src={accountButtonIcon} onClick = {() => handleAccountClick()}/>
                </button>
                </div>
            </div>
        </>
    );
};