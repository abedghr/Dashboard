import { Dialog } from '../../base-components/Headless'
import { Setting } from '../../services/settings/types'
import MapBookingType from './MapForms/MapBookingType'
import MapPredefinedPosts from './MapForms/MapPredefinedPosts'
import MapSurveyQuestions from './MapForms/MapSurveyQuestions'
import MapRating from './MapForms/MapRating'
import MapServiceCatalogues from './MapForms/MapServiceCatalogues3'

type CustomValuesProps = {
    setting: Setting
    close: () => void
}

function Main({ setting, close }: CustomValuesProps) {
    return (
        <>
            <Dialog.Title>
                <h2 className="mr-auto text-base font-medium">
                    Update {setting.name}
                </h2>
            </Dialog.Title>
            <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                {setting.value.type === 'bookingTypes' ? (
                    <MapBookingType setting={setting} close={close} />
                ) : setting.value.type === 'predefinedPosts' ? (
                    <MapPredefinedPosts setting={setting} close={close} />
                ) : setting.value.type === 'surveyQuestions' ? (
                    <MapSurveyQuestions setting={setting} close={close} />
                ) : setting.value.type === 'ratings' ? (
                    <MapRating setting={setting} close={close} />
                ) : setting.value.type === 'serviceCatalogues' ? (
                    <MapServiceCatalogues setting={setting} close={close} />
                ) : null}
            </Dialog.Description>
        </>
    )
}

export default Main
