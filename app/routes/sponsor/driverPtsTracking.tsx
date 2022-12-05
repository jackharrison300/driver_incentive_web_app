import { PtChangeDto, DriverDto, SponsorDto, UserDto } from "~/models/dto";
import { PointChange, Driver, Sponsor, User } from "@prisma/client";
import { UserWithDriverWithCompany, UserWithSponsorWithCompany } from '../../models/shared_prisma';
import { LoaderFunction } from "@remix-run/server-runtime";
import { prisma } from '../../../server';
import { useLoaderData } from '@remix-run/react';
import React from 'react'

type dtoData = { ptChangeDtos: PtChangeDto[], sponsorDtos: SponsorDto[], userDtos: UserDto[] }

export const loader: LoaderFunction = async (): Promise<dtoData> => {
    const myPtChange: PointChange[] = (await prisma.pointChange.findMany())
    const mySponsors: Sponsor[] = (await prisma.sponsor.findMany())
    const myUsers: User[] = (await prisma.user.findMany())
    const ptChangeDtos = myPtChange.map((change: PointChange) => PtChangeDto.fromPtChange(change))
    const sponsorDtos = mySponsors.map((sponsor: Sponsor) => new SponsorDto(sponsor))
    const userDtos = myUsers.map((user: User) => new UserDto(user))
    return {ptChangeDtos, sponsorDtos, userDtos}
}

class tableItem {
    name: string[]
    pointChanges: number[][]
    pointTotal: number[]
    changeDate: string[][]
    sponsor: string[][]
    reason: string[][]

    constructor(data: dtoData) {
        const sponsorNames: string[] = data.sponsorDtos.map((sponsor) => sponsor.companyName)
        this.name = data.userDtos.map((user) => user.name);
        this.pointChanges = data.ptChangeDtos.map((ptChange) = ptChange.pointValue
        this.pointTotal = data.ptChangeDtos.map((ptChange) = ptChange.
        this.changeDate = data.ptChangeDtos.map((ptChange) = ptChange.
        this.sponsor = data.ptChangeDtos.map((ptChange) = ptChange.
        this.reason = data.ptChangeDtos.map((ptChange) = ptChange.
        data.ptChangeDtos.map((ptChange, index) => {
            this.pointChanges[ptChange.driverId].push(ptChange.pointValue)
            this.pointTotal[ptChange.driverId] += ptChange.pointValue
            this.changeDate[ptChange.driverId].push(ptChange.createdAt)
            this.sponsor[ptChange.driverId].push(sponsorNames[ptChange.companyId])
            this.reason[ptChange.driverId].push(ptChange.pointChangeReason)
        })
    }
}

export default function ptsTracking(){
    const data: dtoData = useLoaderData()

    const tableData: tableItem = new tableItem(data)

    return (
        <main className="dark:bg-dark dark:text-lightgray darl:norder-lightgray">
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                        <div className="overflow-hidden border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left  uppercase "
                                        >
                                            Driver
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left uppercase "
                                        >
                                            Total Points
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left uppercase "
                                        >
                                            Point Change
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-right uppercase "
                                        >
                                            Date of Change
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-right uppercase "
                                        >
                                            Sponsor
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-right uppercase "
                                        >
                                            Reason
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tableData.name.map((name, index) =>{
                                        return(
                                            <tr>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                    { name }
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    { tableData.pointTotal[index] }
                                                </td>
                                            {tableData.pointChanges[index].map((pointChange, i) =>{
                                                return(
                                                    <tr>
                                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                            { pointChange }
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                            { tableData.sponsor[index][i] }
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                            { tableData.reason[index][i] }
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
 }