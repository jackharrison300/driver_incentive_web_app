import { PtChangeDto, DriverDto, CompanyDto } from "~/models/dto";
import { PointChange } from "@prisma/client";
import { LoaderFunction } from "@remix-run/server-runtime";
import { prisma } from '../../server';
import { useTable, Column } from "react-table";
import { useLoaderData } from '@remix-run/react';
import React from 'react'

export const loader: LoaderFunction = async ({
}): Promise<PtChangeDto[]> => {
    const myPtChange: PointChange[] = (await prisma.pointChange.findMany({ where: { driverId: 0  }}));
    return myPtChange.map((change: PointChange) => PtChangeDto.fromPtChange(change))
}

export default function ptsTracking(){
    const myPtChange: PtChangeDto[] = useLoaderData()

    const ptChangeColumns: Column[] = React.useMemo(() => [
        { Header: 'Name', accessor: 'name'},
        { Header: 'Total Points', accessor: 'total points'},
        { Header: 'Points', accessor: 'points'},
      ],
      []
    )

    function getTableOptionsFromInput(){
        return {data: myPtChange, columns: ptChangeColumns}
    }

    const myTable = useTable(getTableOptionsFromInput())
 }