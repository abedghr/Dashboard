import React from 'react'
import 'react-phone-number-input/style.css'
import { FormInput, InputGroup } from '../../base-components/Form'
import { UseFormRegister } from 'react-hook-form'
import Lucide from '../../base-components/Lucide'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    register: UseFormRegister<any>
}

function Main(props: Props) {
    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev)
    }

    return (
        <InputGroup>
            <FormInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...props}
                {...props.register('password', { required: true })}
            />
            <InputGroup.Text
                id="eye"
                onClick={toggleShowPassword}
                className="cursor-pointer"
            >
                <Lucide
                    icon={showPassword ? 'Eye' : 'EyeOff'}
                    className="py-0"
                    width={20}
                    height={20}
                />
            </InputGroup.Text>
        </InputGroup>
    )
}

export default Main
