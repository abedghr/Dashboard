import React from 'react'
import {
    BookingType,
    PredefinedPosts,
    Rating,
    Setting,
    SurveyQuestion,
} from '../../services/settings/types'
import { ENUM_SETTING_DATA_TYPE } from '../../services/settings/enums'
import clsx from 'clsx'
import Lucide from '../../base-components/Lucide'
import Button from '../../base-components/Button'
import { Dialog } from '../../base-components/Headless'
import Table from '../../base-components/Table'
import SortableTree from '@nosferatu500/react-sortable-tree'
import MapServiceCataloguesValues from './MapServiceCataloguesValues'
import _ from 'lodash'

type CustomValuesProps = {
    setting: Setting
}

type TreeData = {
    title: string
    isActive: boolean
    subtitle?: string
    children: TreeData[]
}

const mapper = (treeData: TreeData): any => {
    return {
        title: treeData.title,
        subtitle: treeData.isActive ? 'Active' : 'Inactive',
        expanded: true,
        isActive: treeData.isActive,
        children:
            Array.isArray(treeData.children) && treeData.children.length >= 1
                ? treeData.children.map((child) => mapper(child))
                : [],
    }
}

function Map({ setting }: CustomValuesProps) {
    const [show, setShow] = React.useState(false)
    const [treeData, setTreeData] = React.useState([])

    React.useEffect(() => {
        if (setting.value.type === 'serviceCatalogues') {
            const list = setting.value.serviceCatalogues.map(
                (serviceCatalogue: TreeData) => mapper(serviceCatalogue)
            )

            setTreeData(list)
        }
    }, [setting.value])

    return (
        <>
            <Button as="a" onClick={() => setShow(true)}>
                Show
            </Button>
            {/* BEGIN: Add Modal */}
            <Dialog
                size="lg"
                open={show}
                onClose={() => {
                    setShow(false)
                }}
            >
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">
                            Setting : {setting.name}
                        </h2>
                    </Dialog.Title>
                    <Dialog.Description className="grid grid-cols-full gap-4 gap-y-3">
                        {setting.value.type === 'bookingTypes' ? (
                            <div className="overflow-x-auto overflow-y-auto h-80">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Name
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Allowed Payment Methods
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Charge if cancelled after
                                                allowed time
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Charge if amend after allowed
                                                time
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Price Increase
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {setting.value.bookingTypes?.map(
                                            (bookingType: BookingType) => (
                                                <Table.Tr>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.name}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.allowedPaymentMethod.join(
                                                            ', '
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.chargeIfAfterAllowedTime
                                                            ? 'Yes'
                                                            : 'No'}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.chargeIfAmendAfterAllowedTime
                                                            ? 'Yes'
                                                            : 'No'}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.priceIncrease
                                                            ? 'Yes'
                                                            : 'No'}
                                                    </Table.Td>
                                                </Table.Tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ) : setting.value.type === 'serviceCatalogues' ? (
                            <div className="col-span-12 h-96 overflow-x-auto overflow-y-auto">
                                <MapServiceCataloguesValues />
                            </div>
                        ) : setting.value.type === 'surveyQuestions' ? (
                            <div className="overflow-x-auto overflow-y-auto h-80">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Short Text
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Long Text
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Is Active ?
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {setting.value.surveyQuestions?.map(
                                            (bookingType: SurveyQuestion) => (
                                                <Table.Tr>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.short}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-normal w-72 text-center">
                                                        {bookingType.long}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.isActive
                                                            ? 'Yes'
                                                            : 'No'}
                                                    </Table.Td>
                                                </Table.Tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ) : setting.value.type === 'predefinedPosts' ? (
                            <div className="overflow-x-auto overflow-y-auto h-80">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Predefined Post
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Is Active ?
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {setting.value.predefinedPosts?.map(
                                            (bookingType: PredefinedPosts) => (
                                                <Table.Tr>
                                                    <Table.Td className="whitespace-normal w-72 text-center">
                                                        {bookingType.post}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {bookingType.isActive
                                                            ? 'Yes'
                                                            : 'No'}
                                                    </Table.Td>
                                                </Table.Tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ) : setting.value.type === 'ratings' ? (
                            <div className="overflow-x-auto overflow-y-auto h-80">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Star
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Minimum Points
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap text-center">
                                                Maximum Points
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {setting.value.ratings?.map(
                                            (rating: Rating) => (
                                                <Table.Tr>
                                                    <Table.Td className="whitespace-nowrap">
                                                        <div className="flex flex-row justify-center">
                                                            {_.range(
                                                                rating.star
                                                            ).map(() => (
                                                                <div>
                                                                    <Lucide
                                                                        icon="Star"
                                                                        className="w-5 h-5"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {rating.min}
                                                    </Table.Td>
                                                    <Table.Td className="whitespace-nowrap text-center">
                                                        {rating.max}
                                                    </Table.Td>
                                                </Table.Tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ) : null}
                    </Dialog.Description>
                </Dialog.Panel>
            </Dialog>
            {/* END: Add Modal */}
        </>
    )
}

function Main({ setting }: CustomValuesProps) {
    return setting.type === ENUM_SETTING_DATA_TYPE.BOOLEAN ? (
        <div
            className={clsx([
                'flex items-center justify-center',
                { 'text-success': setting.value },
                { 'text-danger': !setting.value },
            ])}
        >
            <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
            {setting.value ? 'Active' : 'Inactive'}
        </div>
    ) : setting.type === ENUM_SETTING_DATA_TYPE.NUMBER ||
      setting.type === ENUM_SETTING_DATA_TYPE.PERCENTAGE ? (
        <div className="mt-2 text-slate-500">{setting.value as number}</div>
    ) : setting.type === ENUM_SETTING_DATA_TYPE.DATE ? (
        <div className="mt-2 text-slate-500">
            {new Date(setting.value.toString()).toDateString()}
        </div>
    ) : setting.type === ENUM_SETTING_DATA_TYPE.ARRAY_OF_STRING ? (
        <div className="mt-2 text-slate-500">
            {(setting.value as string[]).join(', ')}
        </div>
    ) : setting.type === ENUM_SETTING_DATA_TYPE.ARRAY_OF_MAP ? (
        <div className="mt-2 text-slate-500">
            <Map setting={setting} />
        </div>
    ) : null
}

export default Main
