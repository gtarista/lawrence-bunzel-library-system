import { usersRef, booksRef, auth, storage } from "../firebase-config";
import { doc, updateDoc, deleteDoc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref, deleteObject } from "firebase/storage";    
export const useBook = () => {
    const borrowBook = async (bookID) => {
        try {
            /*
            Logic:
                Using the bookID (the document ID of the book), we should be able to 
                locate the book id under the books collection using this:
                export const booksRef = collection(db, 'books');

                then we neeed to see the quantity of the book to see if we can let them borrow it...
                If all is well, then let's go ahead and push this into their array of borrow, and update the 
                boolean accordingly if availablQuantity is 0 now. 
            Firebase Example of Book:
            Book Document ID: 3487238472834asd34
                Book Stuff:
                    ID: 3487238472834asd34
                    isAvailable: true
                    availableQuantity: 3
                    title: 
                    author: 
                    imgURL: 
                    description:

            Firebase Example of User
            USER DOCUMENT: ID: 823jjsdf8342kdf
             *           USER DATA:
              *              ID: 823jjsdf8342kdf
               *             username: notjoosh
                *            email: notjoosh@gmail.com
               *            currentBooks[]
             *             accountType: 'user'
            */
            if(!auth.currentUser.email) return;
            const currentDate = new Date();
            const borrowedTimestamp = currentDate.toString();

            const bookDoc = doc(booksRef, bookID);
            const bookSnapshot = await getDoc(bookDoc);
            const bookData = bookSnapshot.data();
            if(!bookData.isAvailable || bookData.availableQuantity < 1) 
                throw new Error('Book is no available');
            
            const book = {
                title: bookData.title,
                author: bookData.author,
                genre: bookData.genre,
                description: bookData.description,
                imageURL: bookData.imageURL,
                id: bookID,
                borrowedTimestamp: borrowedTimestamp,
                imgName: bookData.imgName
            };
            
            const userDoc = doc(usersRef, auth.currentUser?.uid);
            const userSnapshot = await getDoc(userDoc);
            const userData = userSnapshot.data();
            const updatedCurrentBooks = [...userData.currentBooks, book];

            await updateDoc(userDoc, {
                currentBooks: updatedCurrentBooks,
            });

            await updateDoc(bookDoc, {
                isAvailable: bookData.availableQuantity - 1 > 0,
                availableQuantity: bookData.availableQuantity - 1,
            }); 
        } catch(error) {
            console.log(error.message)
        }
    }; 

    const returnBook = async (bookID) => {
        try {
            console.log('REACHED THIS FUNCTON')
            
            const userDoc = doc(usersRef, auth.currentUser?.uid);
            const userDocSnap = await getDoc(userDoc);
            const userData = userDocSnap.data();

            const updatedCurrentBooks = userData.currentBooks.filter((book) => book.id !== bookID);

            await updateDoc(userDoc, {
                currentBooks: updatedCurrentBooks
            });

            const bookDoc = doc(booksRef, bookID);
            if(!bookDoc.exists()) return;
            const bookDocSnap = await getDoc(bookDoc);
            const bookData = bookDocSnap.data();
            await updateDoc(bookDoc, {
                availableQuantity: bookData.availableQuantity + 1,
                isAvailable: true,
            });
            
            
            
        } catch(error) {
            console.log(error.message)
        }
    }; 

    const addBook = async (title, availableQuantity, genre, author, description, imgFileList) => {
        try {
            /*
                Book ID: 23487283478234
                    ID: 23487283478234
                    genre: 'Fiction'
                    title: 'Moby Dick'
                    author: 'Joosh'
                    description: 'I think this is cute'
                    availableQuantity: 5
                    isAvailable: true
                    imageURL: thisIsAnImageLink.com

                I think what we can do is this:
                export const storage = getStorage(app); <-- this is defined and we just import it? 
            */
            const filteredImage = getImageFromList(imgFileList);
            
            const imageRef = ref(storage, `book_images/${filteredImage.name}`);
            const snapshot = await uploadBytes(imageRef, filteredImage);
            const imageURL = await getDownloadURL(imageRef);
            const newBookRef = await addDoc(booksRef, {
                genre,
                title,
                author,
                description,
                availableQuantity,
                isAvailable: true,
                imageURL,
                imgName: filteredImage.name,
            });

            await setDoc(doc(booksRef, newBookRef.id), {id: newBookRef.id}, {merge: true});

            console.log('SUCCESS!');
        } catch(error) {
            console.log(error.message);
        }
    };
    const deleteBook = async (bookID) => {
        try {
            const bookDocRef = doc(booksRef, bookID);
            const bookSnapShotRef = await getDoc(bookDocRef);
            const bookData = bookSnapShotRef.data();
            await deleteDoc(bookDocRef);
            const imageRef = ref(storage, `book_images/${bookData.imgName}`);
            deleteObject(imageRef);
            console.log(`Book wih ID ${bookID} has been deletted successfully`);
        } catch(error) {
            console.log(error.message);
        }
    }; 
    return { borrowBook, returnBook, addBook, deleteBook };
};

const getImageFromList = (fileList) => {
    if(fileList.length === 0) throw new Error('FileList Empty');
    return fileList[0];
};

export const hasSevenDaysPassed = (borrowedTimestamp) => {
    const currentDate = new Date();
    const borrowedDate = new Date(borrowedTimestamp);
    const timeDfference = currentDate.getTime() - borrowedDate.getTime();
    const daysDifference = Math.ceil(timeDfference / (1000 * 3600 * 24));
    return daysDifference >= 7;
};

export const getDueDate = (borrowedTimestamp) => {
    // 
    console.log(borrowedTimestamp);
    const borrowedDate = new Date(borrowedTimestamp);
    console.log(borrowedDate.toDateString())
    const dueDate = new Date(borrowedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const options = { 
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };
    const dueDateString = dueDate.toLocaleDateString(undefined, options);
    return dueDateString;
};
