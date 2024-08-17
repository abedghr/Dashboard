import { ENUM_SETTING_DATA_TYPE } from '../../services/settings/enums'
import CustomBooleanForm from './CustomBooleanForm'
import CustomArrayStringForm from './CustomArrayStringForm'
import CustomNumberForm from './CustomNumberForm'
import CustomStringForm from './CustomDateForm'
import CustomPercentageForm from './CustomPercentageForm'
import CustomArrayMapForm from './CustomArrayMapForm'
import { useGetOneSetting } from '../../hooks/settings'
import LoadingPage from '../../components/Loading'
import { Setting } from '../../services/settings/types'

type CustomValuesProps = {
    settingId: string
    close: () => void
}

type TypeCaseProps = {
    type: ENUM_SETTING_DATA_TYPE
    setting: Setting
    close: () => void
}

function TypeCase({ type, setting, close }: TypeCaseProps): JSX.Element | null {
    switch (type) {
        case ENUM_SETTING_DATA_TYPE.BOOLEAN:
            return <CustomBooleanForm setting={setting} close={close} />
        case ENUM_SETTING_DATA_TYPE.DATE:
            return <CustomStringForm setting={setting} close={close} />
        case ENUM_SETTING_DATA_TYPE.NUMBER:
            return <CustomNumberForm setting={setting} close={close} />
        case ENUM_SETTING_DATA_TYPE.ARRAY_OF_STRING:
            return <CustomArrayStringForm setting={setting} close={close} />
        case ENUM_SETTING_DATA_TYPE.PERCENTAGE:
            return <CustomPercentageForm setting={setting} close={close} />
        case ENUM_SETTING_DATA_TYPE.ARRAY_OF_MAP:
            return <CustomArrayMapForm setting={setting} close={close} />
        default:
            return null
    }
}

function Main({ settingId, close }: CustomValuesProps) {
    const { data, isFetching } = useGetOneSetting(settingId)
    console.log("SETTING ONE " , data?.data)
    return isFetching ? (
        <LoadingPage />
    ) : (
        <TypeCase type={data!.data.type} setting={data!.data} close={close} />
    )
}

export default Main
