import React from 'react'
import _ from 'lodash'
import LoadingPage from '../Loading'
import Table from '../../base-components/Table'
import { useGetServiceCatalogueList } from '../../hooks/service-catalogue'
import { ServiceCatalogue } from '../../services/serviceCatalgue/types'

function Main() {
    const { data, isFetching } = useGetServiceCatalogueList();
    return isFetching ? (
        <LoadingPage />
    ) : (
        <div className="my-2 overflow-x-auto overflow-y-auto h-80">
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th className="whitespace-nowrap text-center">
                            Title
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-center">
                            Title Arabic
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-center">
                            Target Audience
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-center">
                            Active
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data?.data.map((serviceCatalogue: ServiceCatalogue) => (
                        <Table.Tr>
                            <Table.Td className="whitespace-nowrap">
                                {serviceCatalogue.title}
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap text-center">
                                {serviceCatalogue.titleAr}
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap text-center">
                                {serviceCatalogue.targetAudience}
                            </Table.Td>
                            <Table.Td className="whitespace-nowrap text-center">
                                {serviceCatalogue.isActive ? 'Yes' : 'No'}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    )
}

export default Main
