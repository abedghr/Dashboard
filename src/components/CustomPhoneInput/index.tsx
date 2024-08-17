import React from 'react'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { FormInput } from '../../base-components/Form'

interface Props {
    value: string
    onChange: (value: string) => void
    name: string
}

function Main({ value, onChange, name }: Props) {
    return (
        <PhoneInput
            id={name}
            placeholder="Enter phone number"
            international
            countryCallingCodeEditable={false}
            inputComponent={FormInput}
            value={value}
            onChange={onChange}
        />
    )
}

export default Main
