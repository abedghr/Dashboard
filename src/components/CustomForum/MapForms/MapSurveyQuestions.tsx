import React from 'react'
import { toast } from 'react-toastify'
import {
    Setting,
    SurveyQuestion,
    TSurveyQuestion,
} from '../../../services/settings/types'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useUpdateSetting } from '../../../hooks/settings'
import { SETTINGS_MUTATION_KEY } from '../../../services/settings'
import { ENUM_SETTING_DATA_TYPE } from '../../../services/settings/enums'
import Button from '../../../base-components/Button'
import {
    FormInput,
    FormSwitch,
    FormTextarea,
} from '../../../base-components/Form'
import Table from '../../../base-components/Table'
import Lucide from '../../../base-components/Lucide'
import { Dialog } from '../../../base-components/Headless'
import _ from 'lodash'

type CustomValuesProps = {
    setting: Setting
    close: () => void
}

function Main({ setting, close }: CustomValuesProps) {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<any>({
        mode: 'onChange',
    })

    const [questionsList, setQuestionsList] = React.useState<SurveyQuestion[]>(
        setting.value.surveyQuestions
    )

    const [showConfirm, setShowConfirm] = React.useState(false)

    const queryClient = useQueryClient()
    const mutation = useUpdateSetting()

    const handleAddingQuestion = () => {
        const newQuestion = {
            short: '',
            long: '',
            isActive: false,
        }
        setQuestionsList([...questionsList, newQuestion])
    }

    const handleRemoveQuestion = (index: number) => {
        const newQuestionList = [...questionsList]
        newQuestionList.splice(index, 1)
        setQuestionsList(newQuestionList)
    }

    const onSubmit = (data: any) => {
        const surveyQuestions: TSurveyQuestion = {
            type: 'surveyQuestions',
            surveyQuestions: questionsList.map(
                (item: SurveyQuestion, index: number) => ({
                    short: data[`short${index}`],
                    long: data[`long${index}`],
                    isActive: data[`isActive${index}`],
                })
            ),
        }
        mutation.mutate(
            {
                value: JSON.stringify(surveyQuestions),
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

    return (
        <>
            <Button
                className="w-48"
                variant="primary"
                onClick={handleAddingQuestion}
            >
                New Survey Question
            </Button>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="min-h-fit overflow-x-auto w-full col-span-12"
            >
                <div className="my-2 overflow-x-auto overflow-y-auto h-80">
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
                                <Table.Th className="whitespace-nowrap text-center">
                                    Actions
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {questionsList?.map(
                                (
                                    surveyQuestion: SurveyQuestion,
                                    index: number
                                ) => (
                                    <Table.Tr>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`short${index}`}
                                                control={control}
                                                defaultValue={
                                                    surveyQuestion.short
                                                }
                                                rules={{
                                                    required:
                                                        'Short text is required',
                                                }}
                                                render={({ field }) => (
                                                    <FormInput
                                                        type="text"
                                                        {...field}
                                                        className="w-48"
                                                    />
                                                )}
                                            />
                                            {errors[`short${index}`]
                                                ?.message && (
                                                <div className="mt-2 text-danger">
                                                    {errors[
                                                        `short${index}`
                                                    ]?.message?.toString()}
                                                </div>
                                            )}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`long${index}`}
                                                control={control}
                                                defaultValue={
                                                    surveyQuestion.long
                                                }
                                                rules={{
                                                    required:
                                                        'Long text is required',
                                                }}
                                                render={({ field }) => (
                                                    <FormTextarea
                                                        {...field}
                                                        className="w-60"
                                                    />
                                                )}
                                            />
                                            {errors[`long${index}`]
                                                ?.message && (
                                                <div className="mt-2 text-danger">
                                                    {errors[
                                                        `long${index}`
                                                    ]?.message?.toString()}
                                                </div>
                                            )}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`isActive${index}`}
                                                control={control}
                                                defaultValue={
                                                    surveyQuestion.isActive
                                                }
                                                render={({ field }) => (
                                                    <FormSwitch {...field}>
                                                        <FormSwitch.Input
                                                            defaultChecked={
                                                                !!surveyQuestion.isActive
                                                            }
                                                            type="checkbox"
                                                        />
                                                    </FormSwitch>
                                                )}
                                            />
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Button
                                                onClick={() => {
                                                    handleRemoveQuestion(index)
                                                }}
                                                variant="danger"
                                            >
                                                <Lucide
                                                    icon="Trash"
                                                    className="w-4 h-4"
                                                />
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            )}
                        </Table.Tbody>
                    </Table>
                </div>
                <Button
                    type="button"
                    onClick={() => {
                        if (_.isEmpty(errors)) setShowConfirm(true)
                    }}
                    variant="primary"
                    className="w-20"
                >
                    Update
                </Button>
            </form>
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
                            onClick={() => handleSubmit(onSubmit)()}
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
