import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBook } from '../hooks/useBook';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME } from '../lib/routes';
import { headerIcon, backButtonIcon, addButtonIcon } from '../assets/config';
import './CreateBook.css';
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
*/
const schema = yup.object().shape({
    title: yup.string().required('Title is required...'),
    author: yup.string().required('Author is required...'),
    quantity: yup.number().positive().required('Amount is required...'),
    description: yup.string().required('Description is required...'),
    genre: yup.string().oneOf(['fiction', 'nonfiction']).required('Genre is required...'),
    image: yup
        .mixed()
        .test('fileSize', 'Fil size is too large', (value) => {
            return value && value[0].size <= 2000000;
        })
        .test('fileType', 'Only image files are allowed', (value) => {
            return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
        })
        .required('Image is required...'),
}); 

export const CreateBook = () => {
    const navigate = useNavigate();
    const {addBook} = useBook();
    const {handleSubmit, register, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async ({title, quantity, genre, author, description, image}) => {
        try {
            await addBook(title, quantity, genre, author, description, image);
            navigate(HOME);
        } catch(error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const fetchedAccountType = localStorage.getItem('accountType');
        if(fetchedAccountType === 'user') navigate(HOME);
    }, []);

    return (
        <>
            <div class="header">
                <div class="left-section">
                    <img className="header-logo" src={headerIcon}/>
                </div>
            </div>

            
            <div class="add-body-top">
                <div class="back">
                    <a href="#">
                        <img class="back-logo" src={backButtonIcon} onClick = {() => {navigate(HOME)}}/>
                    </a>
                </div>

                <div class="add-title">
                    <p class="add-book">
                        <b>ADD BOOK</b>
                    </p>
                </div>
            </div>
            
            <div class="add-base">

                <div class="add-left-base">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="add-title">
                            <input id='title' type="text" class="add-title-field" placeholder="Enter book title" {...register('title')}/>
                            {errors.title && <p style = {{color: 'red'}}>{errors.title.message}</p>}
                            
                        </div>
                        
                        <div class="add-author">
                            <input  id='author' type="text" class="add-author-field" placeholder="Enter author" {...register('author')}/>
                            {errors.author && <p style = {{color: 'red'}}>{errors.author.message}</p>}
                            
                        </div>

                        <div class="add-description">
                            <input id='description' type="text" class="add-description-field" placeholder="Enter description" {...register('description')}/>
                            {errors.description && <p style = {{color: 'red'}}>{errors.description.message}</p>}
                        </div>

                        
                        <div class="add-quantity">
                            
                            <input id='quantity' type="number" class="add-quantity-field" placeholder="Enter quantity"{...register('quantity')}/>
                            {errors.quantity && <p styl e = {{color: 'red'}}>{errors.quantity.message}</p>}
                        </div>

                        <div class="genre">
                            <select class = "genre-select" name="genre-select" id="genre-select" {...register('genre')}>
                                <option value="User" selected>Select Genre</option>
                                <option value="fiction">Fiction</option>
                                <option value="nonfiction">Non-fiction</option>
                            </select>
                            {errors.genre && <p style = {{color: 'red'}}>{errors.genre.message}</p>}
                        </div>

                        <div class="add-upload">
                         
                            <input class = "add-image" id='image' type="file" {...register('image')}/>
                        </div>

                        <div class="add-create">
                            <input type = 'submit' class="add-create-button" value =  'ADD BOOK' />
                        </div>
                    </form>
                </div>

                <div class="add-right-base">
                    <img class="add-logo" src={addButtonIcon}/>
                </div>
            </div>
            <div class="panel"> </div>
        </> 
    );
};