import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import Textbox from "../components/Textbox.jsx";
import Button from "../components/Button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../redux/actions/UserAction.js";
import ParticlesBackground from "../components/ParticlesBackground.jsx";

const Login = () => {
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth); // поправка под userInfo

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();

    const submitHandler = async (data) => {
        try {
            await dispatch(login(data)).unwrap();
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed: " + err);
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [userInfo, navigate]);

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-[#f3f4f6]">
            <ParticlesBackground/>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full min-h-screen">

                <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
                    <form onSubmit={handleSubmit(submitHandler)}
                          className='form-container w-full md:w-[400px] flex flex-col
                    gap-y-8 bg-white px-10 pt-14 pb-14'>
                        <div className=''>
                            <p className='text-blue-600 text-3xl font-bold text-center'>Welcome back!</p>
                            <p className='text-center text-base text-gray-400'>
                                Keep all your credential safge.
                            </p>
                        </div>
                        <div className='flex flex-col gap-y-5'>
                            <Textbox
                                placeholder='email@example.com'
                                type='email'
                                name='email'
                                label='Email Address'
                                className='w-full rounded-full'
                                register={register('email', {
                                    required: 'Email address is required',
                                })}
                                error={errors.email ? errors.email.message : ""}
                            />

                            <Textbox
                                placeholder='your password'
                                type='password'
                                name='password'
                                label='Password'
                                className='w-full rounded-full'
                                register={register('password', {
                                    required: 'Password is required',
                                })}
                                error={errors.password ? errors.password.message : ""}
                            />

                            <Button
                                type='submit'
                                label='Submit'
                                className='w-full h-10 bg-blue-700 text-white rounded-full'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login
