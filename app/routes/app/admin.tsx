import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTable, Column, TableOptions } from 'react-table';
import React, { Fragment, useState } from 'react';
import { User, Role, Admin } from '@prisma/client';
import { prisma } from '../../../server';
import { DriverDto, SponsorDto, UserDto } from '../../models/dto';
import { UserWithDriverWithCompany, UserWithSponsorWithCompany } from '~/models/shared_prisma';
import { Dialog, Disclosure, Listbox, Transition } from '@headlessui/react';

type AllUserData = {adminDtos: UserDto[], sponsorDtos: SponsorDto[], driverDtos: DriverDto[]};

export const loader: LoaderFunction = async ({
  }): Promise<AllUserData> => {
    // TODO AUTH

    // doing the filter concurrently in-db seems simplest and likely fastest at low scale where a connection
    // limit of 3 per lambda instance is doable. at high scale in which a connection limit of 1 may be required
    // to not exhaust the db connection limit, this would be serialized instead of concurrent, in which case
    // it may be faster to pull the whole table in one query and filter using something like lodash's groupby()
    const [
      adminUsers,
      sponsorUsers,
      driverUsers
    ]: [User[], UserWithSponsorWithCompany[], UserWithDriverWithCompany[]] =
    await Promise.all([
      prisma.user.findMany({ where: { isActive: true, role: Role.ADMIN }}),
      prisma.user.findMany({ where: { isActive: true, role: Role.SPONSOR }, include: { sponsor: { include: { company: true }}}}),
      prisma.user.findMany({ where: { isActive: true, role: Role.DRIVER }, include: { driver: { include: { company: true }}}},
      )
    ]);
    const adminDtos: UserDto[] = adminUsers.map((user: User) => new UserDto(user));
    const sponsorDtos: SponsorDto[] = sponsorUsers.map((user: UserWithSponsorWithCompany) => SponsorDto.fromUserWithSponsorWithCompany(user));
    const driverDtos: DriverDto[] = driverUsers.map((user: UserWithDriverWithCompany) => DriverDto.fromUserWithDriverWithCompany(user));
    return {adminDtos, sponsorDtos, driverDtos};
  }

export default function Admin() {
    const backEndData: AllUserData = useLoaderData();
    const allData: AllUserData = React.useMemo(
      () => backEndData,
      []
    );

    const roleDisplays = [
      { id: 1, name: 'Admin', lowercaseName: 'admin' },
      { id: 2, name: 'Sponsor', lowercaseName: 'sponsor' },
      { id: 3, name: 'Driver', lowercaseName: 'driver' } 
    ]

    const [selectedRole, setSelectedRole] = useState(roleDisplays[0]);

    const userColumns: Column[] = React.useMemo(() => [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
      ],
      []
    );

    const sponsorColumns: Column[] = React.useMemo(() => [
      ...userColumns,
      { Header: 'Company', accessor: 'companyName' },
      ],
      []
    );

    const driverColumns: Column[] = React.useMemo(() => [
      ...userColumns,
      { Header: 'Company', accessor: 'companyName' },
      { Header: 'Enrollment Status', accessor: 'enrollmentStatus' },
      ],
      []
    );

    function getTableOptionsFromRoleName(roleName: string): TableOptions<{}> {
      if ('Admin' === roleName) return {data: allData.adminDtos, columns: userColumns};
      if ('Sponsor' === roleName) return {data: allData.sponsorDtos, columns: sponsorColumns}
      return {data: allData.driverDtos, columns: driverColumns}
    }

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(getTableOptionsFromRoleName(selectedRole.name));

    const [isOpen, setIsOpen] = useState(false);

    function openModal() {
      setIsOpen(true);
    }

    function closeModal() {
      setIsOpen(false);
    }

    return (
      <>
      <div className='flex justify-center mt-2'><h1 className='text-xl font-bold'>Users</h1></div>
      <div className='flex justify-center'>
      <div className='block w-[40rem]'>
        <div className='flex justify-between mt-2'>
        <div className='inline-block'>
        <Listbox value={selectedRole} onChange={setSelectedRole}>
          <Listbox.Button className='border-solid border-black border-2 p-2'>{selectedRole.name}</Listbox.Button>
          <Listbox.Options className='pl-2'>
            {roleDisplays.map((roleDisplay: {id: number, name: string}) => (
              <Listbox.Option
                key={roleDisplay.id}
                value={roleDisplay}
                className='cursor-pointer'
              >
                {roleDisplay.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
          </Listbox>
          </div>
          <div className='inline-block'>
          <button
            type='button'
            onClick={openModal}
            className='border-solid border-black border-2 p-2'
          >
            Create new {selectedRole.lowercaseName}
          </button>
          </div>
        </div>
        <table {...getTableProps()} className='text-xl mt-2'>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className={'border-solid border-black border-2 p-2 font-bold'}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className='border-solid border-black border-2 p-2'
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={closeModal}>
              <Transition.Child
                 as={Fragment}
                 enter="ease-out duration-300"
                 enterFrom="opacity-0"
                 enterTo="opacity-100"
                 leave="ease-in duration-200"
                 leaveFrom="opacity-100"
                 leaveTo="opacity-0"
              >
                <div className='fixed inset-0 bg-black bg-opacity-75'/>
              </Transition.Child>
              <div className='fixed inset-0 overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-4 text-center'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                  >
                    <Dialog.Panel className='w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all border-solid border-black border-2'>
                      <Dialog.Title
                        as='h3'
                        className='text-lg font-medium leading-6'
                      >
                        New {selectedRole.name}
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm'>
                          New user form here
                        </p>
                      </div>
                      <div className='mt-4'>
                        <button
                          type='button'
                          className='inline-flex justify-center border px-4 py-2 text-sm font-medium'
                          onClick={closeModal}
                        >
                          Submit
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
      </>
    )
}