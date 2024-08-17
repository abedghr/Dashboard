import React from 'react'
import { FormInput, FormLabel, FormSelect } from '../../base-components/Form'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog } from '../../base-components/Headless'
import Button from '../../base-components/Button'
import { useCreateAdmin } from '../../hooks/admins'
import { useGetRolesList } from '../../hooks/roles'
import Loading from '../../components/Loading'
import PasswordInput from '../../components/PasswordInput'
import CustomPhoneInput from '../../components/CustomPhoneInput'
import * as yup from 'yup'
import 'yup-phone'
import { paginationDefaultValueForAdmin as rolePagination } from '../../services/roles/types'
import { paginationDefaultValue as countriesPagination } from '../../services/countries/types'
import { CreateAdminBody } from '../../services/admins/types'
import { useGetCountriesList } from '../../hooks/countries'
import { ENUM_USER_GENDER } from '../../services/generic'

type Props = {
    onClose: () => void
}

const phoneRegExp = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/

const getCharacterValidationError = (str: string): string => {
    return `The password must have at least 1 ${str} character`
}

const schema = yup
    .object<CreateAdminBody>({
        username: yup.string().required('Username is required').max(20,"Username can't be more than 20 characters"),
        email: yup
            .string()
            .email('Please enter a valid email')
            .max(40,"Email can't be more than 40 characters")
            .required('Email is required'),
        firstName: yup.string().required('First Name is required').max(40,"First Name can't be more than 40 characters"),
        lastName: yup.string().required('Last Name is required').max(40,"Last Name can't be more than 40 characters"),
        mobileNumber: yup
            .string()
            .required('Mobile is required')
            .matches(phoneRegExp, 'Phone number is not valid'),
        country: yup.string().required(),
        gender: yup.string().oneOf(Object.values(ENUM_USER_GENDER)).required(),
        password: yup
            .string()
            .min(8, 'Password must have at least 8 characters')
            .max(20, 'Password must have at most 20 characters')
            .matches(/[0-9]/, getCharacterValidationError('digit'))
            .matches(/[A-Z]/, getCharacterValidationError('uppercase'))
            .matches(/[a-z]/, getCharacterValidationError('lowercase'))
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                getCharacterValidationError('special')
            )
            .required('Password is required'),
    })
    .required()

function Main({ onClose }: Props) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateAdminBody>({
        resolver: yupResolver(schema),
    })
    const { data: rolesData, isLoading: rolesIsLoading } =
        useGetRolesList(rolePagination)
    const { data: countriesData, isLoading: countriesIsLoading } =
        useGetCountriesList(countriesPagination)

    const mutation = useCreateAdmin()

    const onSubmit = (data: CreateAdminBody) => {
        const mobileNumberWithoutPlus = data.mobileNumber?.replace('+', '')
        data.mobileNumber = mobileNumberWithoutPlus
        data.role = rolesData?.data[0]._id
        mutation.mutate(data, { onSuccess: () => onClose() })
    }

    // useEffect(() => {
    //     if (
    //         countriesData?.data.length !== undefined &&
    //         countriesData?.data.length > 0
    //     ) {
    //         setValue('country', countriesData.data[0]._id)
    //     }
    // }, [countriesData?.data, setValue])

    return rolesIsLoading && countriesIsLoading ? (
        <Loading />
    ) : (
        <Dialog.Description className="grid grid-cols-full gap-4 gap-y-3">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-12 gap-4 gap-y-2"
            >
                <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="username" className="mt-2">
                        Username
                    </FormLabel>
                    <FormInput
                        id="username"
                        type="text"
                        {...register('username', { required: true })}
                    />
                    {errors.username?.message && (
                        <div className="mt-2 text-danger">
                            {errors.username?.message}
                        </div>
                    )}
                </div>
                <div className="grid-cols-6 col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="email" className="mt-2">
                        Email
                    </FormLabel>
                    <FormInput
                        id="email"
                        type="text"
                        {...register('email', { required: true })}
                    />
                    {errors.email?.message && (
                        <div className="mt-2 text-danger">
                            {errors.email?.message}
                        </div>
                    )}
                </div>
                <div className="col-span-6">
                    <FormLabel htmlFor="firstname" className="mt-2">
                        First Name
                    </FormLabel>
                    <FormInput
                        id="firstname"
                        type="text"
                        {...register('firstName', { required: true })}
                    />
                    {errors.firstName?.message && (
                        <div className="mt-2 text-danger">
                            {errors.firstName?.message}
                        </div>
                    )}
                </div>
                <div className="col-span-6">
                    <FormLabel htmlFor="lastName" className="mt-2">
                        Last Name
                    </FormLabel>
                    <FormInput
                        id="lastName"
                        type="text"
                        {...register('lastName', { required: true })}
                    />
                    {errors.lastName?.message && (
                        <div className="mt-2 text-danger">
                            {errors.lastName?.message}
                        </div>
                    )}
                </div>
                <div className="col-span-6">
                    <FormLabel htmlFor="mobileNumber" className="mt-2">
                        Mobile Number
                    </FormLabel>
                    <Controller
                        name="mobileNumber"
                        control={control}
                        render={({ field }) => <CustomPhoneInput {...field} />}
                    />
                    {errors.mobileNumber?.message && (
                        <div className="mt-2 text-danger">
                            {errors.mobileNumber?.message}
                        </div>
                    )}
                </div>
                <div className="col-span-6">
                    <FormLabel htmlFor="gender" className="mt-2">
                        Gender
                    </FormLabel>
                    <Controller
                        name="gender"
                        control={control}
                        defaultValue={ENUM_USER_GENDER.MALE}
                        render={({ field }) => (
                            <FormSelect id="gender" {...field}>
                                {Object.entries(ENUM_USER_GENDER).map(
                                    ([key, value]) => (
                                        <option key={key} value={value}>
                                            {key}
                                        </option>
                                    )
                                )}
                            </FormSelect>
                        )}
                    />
                </div>
                <div className="col-span-12">
                    <FormLabel htmlFor="password" className="mt-2">
                        Password
                    </FormLabel>
                    <PasswordInput register={register} />
                    {errors.password?.message && (
                        <div className="mt-2 text-danger">
                            {errors.password?.message}
                        </div>
                    )}
                </div>
                <div className="col-span-12">
                    <FormLabel htmlFor="country" className="mt-2">
                        Country
                    </FormLabel>
                    <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <FormSelect id="country" {...field}>
                                <option value="">Choose Country</option>
                                {countriesData?.data.map((country) => (
                                    <option
                                        key={country._id}
                                        value={country._id}
                                    >
                                        {country.name}
                                    </option>
                                ))}
                            </FormSelect>
                        )}
                    />
                    {errors.country?.message && (
                        <div className="mt-2 text-danger">
                            {errors.country?.message}
                        </div>
                    )}
                </div>
                <Button
                    variant="primary"
                    type="submit"
                    className="w-20 col-span-12"
                >
                    Add
                </Button>
            </form>
        </Dialog.Description>
    )
}

export default Main
