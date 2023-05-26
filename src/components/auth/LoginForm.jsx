import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { headerLogo, libVert, personStudent  } from '../../assets/config';
import { useAuth } from '../../hooks/useAuth';
import { HOME } from '../../lib/routes';
import { useNavigate } from 'react-router-dom';
import { REGISTER } from '../../lib/routes';
import './LoginForm.css';
import '../../css/defPanels.css';

const LoginSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

export const LoginForm = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(LoginSchema),
    })

    const tryLogin = async ({username, password}) => {
        try { 
            await login(username, password, HOME);
        } catch(error) {
            console.log(error.message);
        }
    };
    return (
        <>
            <div className ="header">
                <div className ="left-section">
                    <img className ="header-logo" src={headerLogo}/>
                </div>       
            </div>
            <div className ="base-login">
                <div className ="body-left">
                    <div className ="logo">
                        <img className ="libvert" src={libVert}/>
                    </div>
                    <div className ="spiel">
                        <p className ="reg-text">Haven't registered yet? Create an account now!</p>
                    </div>
                    <div className ="registration">
                        <button style = {{cursor: 'pointer'}} className ="registration-button" onClick = {() => {navigate(REGISTER)}}>Register</button>
                    </div>
                </div>
                <div className ="body-right">
                    <div className ="student-logo">
                        <img className ="person-student" src={personStudent}/>
                    </div>
                    <div className ="right-panel">
                        <form onSubmit={handleSubmit(tryLogin)}>
                            <div className ="login-text">
                                <p className ="student-login">LOGIN</p>
                            </div>
                            <div className ="input">
                                <div className ="username">
                                    <input type="text" className ="un-textfield" placeholder="Enter username" {...register('username')}/>
                                    {errors.username && <p style={{color: 'red'}}>{errors.username.message}</p>}
                                </div>
                                <div className ="password">
                                    <input type="password" className ="pass-textfield" placeholder="Enter passsword" {...register('password')}/>
                                    {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
                                </div>
                            </div>
                            <div className ="login">
                                <input type = 'submit' className ="login-button" value = 'Login'/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className ="panel"></div>
        </>
    );
};