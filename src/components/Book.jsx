import { useEffect, useState } from "react";
import { useBook } from "../hooks/useBook";
import { useNavigate } from "react-router-dom";
import { ABOUTBOOK } from "../lib/routes";
import './Book.css';

export const Book = ({imgURL, author, title, bookID, description, handleExit, isShelfBook}) => {
    const [accountType, setAccountType] = useState('user');
    const { returnBook} = useBook();
    const navigate = useNavigate();

    const handleReturn = async () => {
        try {
            await returnBook(bookID);
            
        } catch(error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        const fetchedAccountType = localStorage.getItem('accountType');
        setAccountType(fetchedAccountType); 
    }, []);
    
    return (
        <>
            <div className="book">
                <div className="cover">
                    <a href="link">
                        <img className="cover-img" src= {imgURL}/> 
                    </a>   
                </div>
                <div className="info">
                    <a href="#">
                        <p className="title-text">{title}</p> 
                    </a>
                    <p className="author-text">{author}</p> 
                </div>
                <div className="borrow">
                    {accountType === 'admin'? (
                        <button className="delete-modal" onClick = {() => {
                            localStorage.setItem('queriedBOOKID', bookID);
                            navigate(ABOUTBOOK);
                        }}>Delete</button>
                    )
                    :
                    (
                        <>
                            {!isShelfBook && (
                                <button className="borrow-button" onClick = {() => {
                                    localStorage.setItem('queriedBOOKID', bookID);
                                    navigate(ABOUTBOOK);
                                }}>Borrow</button>
                            )}
                        </>
                    )}
                    {isShelfBook === true && (
                        <button className="return-button" onClick = {() => {
                            localStorage.setItem('queriedBOOKID', bookID);
                            navigate(ABOUTBOOK);
                        }}>Return</button>
                    )}
                </div>
            </div>
        </>
    );
};