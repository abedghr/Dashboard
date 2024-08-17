import React from 'react'
import {
    ServiceCatalogue,
    Setting,
    TServiceCatalogue,
} from '../../../services/settings/types'
import _ from 'lodash'
import { useQueryClient } from 'react-query'
import { useUpdateSetting } from '../../../hooks/settings'
import Button from '../../../base-components/Button'
import Lucide from '../../../base-components/Lucide'
import { Dialog } from '../../../base-components/Headless'
import SortableTree, {
    addNodeUnderParent,
    removeNodeAtPath,
    changeNodeAtPath,
    TreeItem,
    GetNodeKeyFunction,
} from '@nosferatu500/react-sortable-tree'
import { FormInput, FormSelect, FormSwitch } from '../../../base-components/Form'
import { ENUM_SETTING_DATA_TYPE } from '../../../services/settings/enums'
import { SETTINGS_MUTATION_KEY } from '../../../services/settings'
import { toast } from 'react-toastify'

type CustomValuesProps = {
    setting: Setting
    close: () => void
}

type GenerateNodePropsParams = {
    node: any
    path: number[]
    treeIndex: number
    lowerSiblingCounts: number[]
    isSearchMatch: boolean
    isSearchFocus: boolean
}

const mapper = (treeData: ServiceCatalogue): TreeItem => {
    return {
        title: treeData.title,
        expanded: true,
        isActive: treeData.isActive,
        children:
            Array.isArray(treeData.children) && treeData.children.length >= 1
                ? treeData.children.map((child) => mapper(child))
                : [],
    }
}

const unMapper = (treeData: TreeItem): ServiceCatalogue => {
    return {
        title: treeData.title?.toString() || '',
        isActive: treeData.isActive,
        children:
            Array.isArray(treeData.children) && treeData.children.length >= 1
                ? treeData.children.map((child) => unMapper(child))
                : [],
    }
}

function Main({ setting, close }: CustomValuesProps) {
    const queryClient = useQueryClient()
    const mutation = useUpdateSetting()

    const [treeData, setTreeData] = React.useState<TreeItem[]>([])
    const [showConfirm, setShowConfirm] = React.useState(false)

    React.useEffect(() => {
        const list: TreeItem[] = setting.value.serviceCatalogues.map(
            (serviceCatalogue: ServiceCatalogue) => mapper(serviceCatalogue)
        )

        setTreeData(list)
    }, [setting.value])

    const onSubmit = (data: any) => {
        setShowConfirm(false)
        const serviceCatalogue: TServiceCatalogue = {
            type: 'serviceCatalogues',
            serviceCatalogues: treeData.map((item: TreeItem) => unMapper(item))
        }
        console.log(serviceCatalogue)
        mutation.mutate(
            {
                value: JSON.stringify(serviceCatalogue),
                id: setting._id,
                type: ENUM_SETTING_DATA_TYPE.ARRAY_OF_MAP,
                description: setting.description,
            },
            {
                onSuccess: () => {
                    toast.success('Successfully updated')
                    close()
                    queryClient.invalidateQueries(SETTINGS_MUTATION_KEY)
                },
            }
        )
    }

    const inputElEn = React.useRef<any>()
    const inputElAr = React.useRef<any>()

    function createNode() {
        const value = inputElEn.current?.value

        if (value === '') {
            inputElEn.current?.focus()
            return
        }

        let newTree = addNodeUnderParent({
            treeData: treeData,
            parentKey: null,
            expandParent: true,
            getNodeKey,
            newNode: {
                id: '123',
                title: value,
            },
        })
        if (newTree.treeData !== undefined) setTreeData(newTree.treeData)
        inputElEn.current.value = ''
    }

    function removeNode(rowInfo: GenerateNodePropsParams) {
        const { path } = rowInfo
        setTreeData(
            removeNodeAtPath({
                treeData,
                path,
                getNodeKey,
            })
        )
    }

    const getNodeKey: GetNodeKeyFunction = ({ treeIndex }) => treeIndex

    return (
        <>
            <div className="col-span-12 flex flex-row gap-3">
                <FormInput
                    ref={inputElEn}
                    type="text"
                    placeholder="Service Catalogue Name"
                />
                <FormInput
                    ref={inputElAr}
                    type="text"
                    placeholder="Service Catalogue Name in Arabic"
                />
                <FormSelect id="audience">
                    <option value={undefined}>All Countries</option>
                </FormSelect>
            </div>
            <Button className="w-32" variant="primary" onClick={createNode}>
                Add Catalogue
            </Button>
            <div className="col-span-12 h-96 overflow-x-auto overflow-y-auto relative">
                <SortableTree
                    treeData={treeData}
                    onChange={(treeData) => setTreeData(treeData)}
                    canDrag={({ node }) => !node.dragDisabled}
                    generateNodeProps={(rowInfo) => ({
                        title: (
                            <div className="flex flex-row gap-2">
                                <FormInput
                                    name="title"
                                    className="my-0"
                                    type="text" formInputSize="sm"
                                    required
                                    value={rowInfo.node.title}
                                    onChange={(e) => {
                                        const title = e.target.value
                                        setTreeData((prev) =>
                                            changeNodeAtPath({
                                                treeData: prev,
                                                path: rowInfo.path,
                                                getNodeKey,
                                                newNode: {
                                                    ...rowInfo.node,
                                                    title,
                                                },
                                            })
                                        )
                                    }}
                                />
                                <FormSwitch>
                                    <FormSwitch.Input
                                        name="isActive"
                                        type='checkbox'
                                        checked={rowInfo.node.isActive}
                                        onChange={(e) => {
                                            const isActive = e.target.checked
                                            setTreeData((prev) => changeNodeAtPath({
                                                treeData: prev,
                                                path: rowInfo.path,
                                                getNodeKey,
                                                newNode: { ...rowInfo.node, isActive }
                                            }))
                                        }}
                                    />
                                </FormSwitch>
                            </div>
                        ),
                        buttons: [
                            <div className="flex flex-row gap-2">
                                <button
                                    onClick={(event) => removeNode(rowInfo)}
                                >
                                    <Lucide icon="Trash" className="text-red-700" />
                                </button>
                            </div>,
                        ],
                        style: {
                            height: '60px',
                        },
                    })}
                />
            </div>
            <Button
                type="button"
                onClick={() => {
                    setShowConfirm(true)
                }}
                variant="primary"
                className="w-20"
            >
                Update
            </Button>
            {/* BEGIN: Overlapping Modal Content */}
            <Dialog
                open={showConfirm}
                onClose={() => {
                    setShowConfirm(false)
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
                                setShowConfirm(false)
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="success"
                            className="w-24"
                            onClick={onSubmit}
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
