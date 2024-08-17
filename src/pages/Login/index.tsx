import DarkModeSwitcher from '../../components/DarkModeSwitcher'
import MainColorSwitcher from '../../components/MainColorSwitcher'
import logoUrl from '../../assets/images/logo.svg'
import illustrationUrl from '../../assets/images/illustration.svg'
import { FormInput } from '../../base-components/Form'
import PasswordInput from '../../components/PasswordInput'
import Button from '../../base-components/Button'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { UserLogin } from './types'
import { useLoginUser } from '../../hooks/auth'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../stores/hooks'
import { RootState } from '../../stores/store'
import { useEffect } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'


const schema = yup
    .object<UserLogin>({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required'),
    })
    .required()

function Main() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
        resolver: yupResolver(schema),
    })

    const isAuthenticated = useAppSelector(
        (state: RootState) => state.auth.isAuthenticated
    )

    const navigate = useNavigate()

    const mutation = useLoginUser()

    const submitForm = async (data: UserLogin) => {
        mutation.mutate(data)
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app', { replace: true })
        }
    }, [isAuthenticated, navigate])

    return (
        <>
            <div
                className={clsx([
                    '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
                    "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
                    "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
                ])}
            >
                <DarkModeSwitcher />
                <MainColorSwitcher />
                <div className="container relative z-10 sm:px-10">
                    <div className="block grid-cols-2 gap-4 xl:grid">
                        {/* BEGIN: Login Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <img
                                alt="Midone Tailwind HTML Admin Template"
                                className="w-6"
                                src={logoUrl}
                            />
                            <div className="my-auto">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-1/2 -mt-16 -intro-x"
                                    src={illustrationUrl}
                                />
                                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                                    Welcome To Latahati Dashboard
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                            <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Sign In
                                </h2>
                                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                                    Welcome to OvO application
                                </div>
                                <form onSubmit={handleSubmit(submitForm)}>
                                    <div className="flex flex-col gap-3 mt-3">
                                        <FormInput
                                            type="text"
                                            className="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                                            placeholder="Username"
                                            {...register('username', {
                                                required: true,
                                            })}
                                        />
                                        {errors.username?.message && (
                                            <div className="mt-2 text-danger">
                                                {errors.username?.message}
                                            </div>
                                        )}
                                        <PasswordInput
                                            className="block px-4 py-3 intro-x login__input xl:min-w-[350px]"
                                            placeholder="Password"
                                            register={register}
                                        />
                                        {errors.password?.message && (
                                            <div className="mt-2 text-danger">
                                                {errors.password?.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                        <Button
                                            variant="primary"
                                            className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                            type="submit"
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* END: Login Form */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main
