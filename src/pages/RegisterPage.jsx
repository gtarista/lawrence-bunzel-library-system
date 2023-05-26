import { useAuth } from "../hooks/useAuth";
import { HOME } from "../lib/routes";
import { useState, useEffect } from "react";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TermsAndConditionsModal } from '../components/modals/TermsAndConditionsModal';
import '../css/defPanels.css';
import './RegisterPage.css';
import { headerIcon } from "../assets/config";


const registerSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required...'),
    username: yup.string().required('Username is required...'),
    password: yup.string().min(6, 'Password must be at least 6 characters long...').required('Password is required...'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match...'),
});

export const RegisterPage = () => {
    const {registerUser} = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(registerSchema)
    });

    const tryRegister = async ({fullName, username, password, confirmPassword}) => {
        try {
            if(isChecked) {
                await registerUser(fullName, username, password, HOME);
            } else {
                alert('Please read the terms and conditions...');
            }
        } catch(error) {
            console.log(error.message);
        }
    };
    // I just worked out the logic, you just need
    // to validate the form and get the form working
    // just do what i did earlier, cge kaon boss. Wait
    // I'll leave this form down here for the formate you need to do
    // useEffect(() => {
    //     console.log(errors);
    // });
    return (
        <>
            <div class="header">
                
                <div class="left-section">
                    <img class="header-logo" src={headerIcon}/>
                </div>
            
            </div>

            <div class="base-register">
                <form onSubmit = {handleSubmit(tryRegister)}>
                    <div class="create">
                        <p class="create-text">CREATE AN ACCOUNT</p>
                    </div>

                    <div class="textfields">
                        <div class="fname">
                            <p class="fname-text">
                                Enter Full Name *
                            </p>
                            <input type="text" class="fname-field" placeholder="Enter full name" {...register('fullName')}/>
                            {errors.fullName && <p style ={{color: 'red'}}>{errors.fullName.message}</p>}
                        </div>

                        <div class="uname">
                            <p class="uname-text">
                                Enter Username *
                            </p>
                            <input type="text" class="uname-field" placeholder="Enter username"  {...register('username')}/>
                            {errors.username && <p style ={{color: 'red'}}>{errors.username.message}</p>}
                        </div>

                        <div class="pass">
                            <p class="pass-text">
                                Enter Password *
                            </p>
                            <input type="password" class="pass-field" placeholder="Enter password" {...register('password')}/>
                            {errors.password && <p style ={{color: 'red'}}>{errors.password.message}</p>}
                        </div>

                        <div class="conpass">
                            <p class="conpass-text">
                                Confirm Password *
                            </p>
                            <input type="password" class="conpass-field" placeholder="Confirm password" {...register('confirmPassword')}/>
                            {errors.confirmPassword && <p style ={{color: 'red'}}>{errors.confirmPassword.message}</p>}
                            {errors.isChecked && <p style ={{color: 'red'}}>{errors.isChecked.message}</p>}
                        </div>
                    </div>
                    <div class="consent">
                        <input id="checkbox" type="checkbox" class="consent-check" value = 'isChecked' onClick={() => {setShowModal(true); setIsChecked(!isChecked)}}/>
                        <p class="consent-text">
                            I have read and agree to the Terms of Service and Privacy Policy.
                        </p>
                    </div>
                    {showModal && (
                    <div style = {{zIndex: '99999'}}>
                        <TermsAndConditionsModal handleExit = {(booleanReturned) => setShowModal(booleanReturned)}/>
                    </div>  
                    )}
                    <div class="signup">
                        <input class = "signup-button" type = 'submit' value = 'Sign Up' />
                    </div>
                </form>
            </div>
            <div class="panel"> </div>
        </>
    );
};