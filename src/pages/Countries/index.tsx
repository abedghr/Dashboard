import Button from '../../base-components/Button'
import Lucide from '../../base-components/Lucide'
import LoadingPage from '../../components/Loading'
import { Dialog } from '../../base-components/Headless'
import { paginationDefaultValue } from '../../services/countries/types'
import { useState } from 'react'
import { useCreateCountry, useGetCountriesList, useUpdateCountry } from '../../hooks/countries'
import { FormLabel, FormSelect } from '../../base-components/Form'
import countriesList from '../../assets/json/countries.json'
import { Controller, useForm } from 'react-hook-form'
import { getCountryCallingCode } from 'react-phone-number-input'

function Main() {
    const [showAddCountryModal, setShowAddCountryModal] =
        useState<boolean>(false)

    const [showUpdateCountryModal, setShowUpdateCountryModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<{ id: string, isActive: boolean }>({ id: "", isActive: false });

    const { data, isFetching, refetch } = useGetCountriesList(
        paginationDefaultValue
    )

    const mutation = useCreateCountry()
    const updateMuation = useUpdateCountry()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm()

    const showAddCountryModalHandler = () => {
        setShowAddCountryModal(true)
    }

    const closeAddCountryModalHandler = () => {
        setShowAddCountryModal(false)
        refetch()
    }

    const onSubmit = (data: any) => {
        const [code, name] = data.country.split('-')
        const countryCode = getCountryCallingCode(code)
        const country = {
            name,
            code,
            countryCode,
        }
        mutation.mutate(country, {
            onSuccess: () => {
                closeAddCountryModalHandler()
            },
        })
    }

    const submitUpdateCountry = () => {
        const { id, isActive } = selectedCountry;
        updateMuation.mutate({ id, isActive }, {
            onSuccess: () => {
                setShowUpdateCountryModal(false);
                setSelectedCountry({ id: "", isActive: false });
                refetch();
            }
        })
    }

    const handleUpdateCountry = (id: string, isActive: boolean) => {
        setSelectedCountry({ id, isActive })
        setShowUpdateCountryModal(true)
    }

    return isFetching ? (
        <LoadingPage />
    ) : (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">
                Countries in the system
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {/* <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button
                        onClick={showAddCountryModalHandler}
                        variant="primary"
                        className="mr-2 shadow-md"
                    >
                        Add New Country
                    </Button>
                </div> */}
                {/* BEGIN: Country Layout */}
                {data?.data.map((country) => (
                    <div
                        key={country._id}
                        className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box">
                            <div className="p-5">
                                <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                    <img
                                        alt="Midone - HTML Admin Template"
                                        className="rounded-md"
                                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`}
                                    />
                                    <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                                        <a
                                            href=""
                                            className="block text-base font-medium"
                                        >
                                            {country.name}
                                        </a>
                                        <span className="mt-3 text-xs text-white/90">
                                            {country.code}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center">
                                        <Lucide
                                            icon="Link"
                                            className="w-4 h-4 mr-2"
                                        />{' '}
                                        Name: {country.name}
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Lucide
                                            icon="Layers"
                                            className="w-4 h-4 mr-2"
                                        />{' '}
                                        Code:
                                        {country.code}
                                    </div>
                                </div>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center justify-between mt-2">
                                        {country.isActive
                                            ? 'Active'
                                            : 'Inactive'}
                                        {country.isActive ? (
                                            <Button
                                                variant="danger"
                                                className="w-1/4 shadow-md"
                                                onClick={() => handleUpdateCountry(country._id, false)}
                                            >
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="success"
                                                className="w-1/4 shadow-md"
                                                onClick={() => handleUpdateCountry(country._id, true)}
                                            >
                                                Activate
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* END: Country Layout */}
                {/* BEGIN: Add Modal */}
                <Dialog
                    size="md"
                    open={showAddCountryModal}
                    onClose={() => {
                        setShowAddCountryModal(false)
                    }}
                >
                    <Dialog.Panel>
                        <Dialog.Title>
                            <h2 className="mr-auto text-base font-medium">
                                Choose a country from the list
                            </h2>
                        </Dialog.Title>
                        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="col-span-12"
                            >
                                <div className="col-span-12 sm:col-span-6 my-2">
                                    <FormLabel htmlFor="name" className="mt-2">
                                        Country
                                    </FormLabel>
                                    <Controller
                                        name="country"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            validate: (value) => value !== '',
                                        }}
                                        render={({ field }) => (
                                            <FormSelect id="country" {...field}>
                                                <option value="">
                                                    Choose Country
                                                </option>
                                                {countriesList?.map(
                                                    (country) => (
                                                        <option
                                                            key={country.code}
                                                            value={`${country.code}-${country.name}`}
                                                        >
                                                            {country.name}
                                                        </option>
                                                    )
                                                )}
                                            </FormSelect>
                                        )}
                                    />
                                    {errors.country?.type === 'validate' && (
                                        <div className="mt-2 text-danger">
                                            Please choose a country
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-20"
                                >
                                    Save
                                </Button>
                            </form>
                        </Dialog.Description>
                    </Dialog.Panel>
                </Dialog>
                {/* END: Add Modal */}
            </div>
            {/* BEGIN: Overlapping Modal Content */}
            <Dialog
                open={showUpdateCountryModal}
                onClose={() => {
                    setShowUpdateCountryModal(false)
                }}
            >
                <Dialog.Panel className="p-5 text-center">
                    <div className="p-5 text-center">
                        <Lucide
                            icon="HelpCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Are you sure you want to apply this change?
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                                setShowUpdateCountryModal(false)
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="success"
                            className="w-24"
                            onClick={() => submitUpdateCountry()}
                        >
                            Update
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Overlapping Modal Content */}
        </>
    )
}

export default Main
