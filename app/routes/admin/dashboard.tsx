import { useLoaderData, Form, useLocation } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTable, Column, TableOptions } from 'react-table';
import React, { Fragment, useState } from 'react';
import { User, Role, Company, Sponsor } from '@prisma/client';
import { prisma } from '../../../server';
import { CompanyDto, DriverDto, SponsorDto, UserDto } from '../../models/dto';
import { UserWithDriverWithCompany, UserWithSponsorWithCompany } from '../../models/shared_prisma';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

type DashboardData = {adminDtos: UserDto[], sponsorDtos: SponsorDto[], driverDtos: DriverDto[], companyDtos: CompanyDto[]};
type DashboardUserDto = UserDto | SponsorDto | DriverDto;
type DashboardDto = DashboardUserDto | CompanyDto;

export const loader: LoaderFunction = async (): Promise<DashboardData> => {
  // TODO AUTH

  // doing the filter concurrently in-db seems simplest and likely fastest at low scale where a connection
  // limit >= 3 per lambda instance is doable. at high scale in which a connection limit of 1 may be required
  // to not exhaust the db connection limit, this would be serialized instead of concurrent, in which case
  // it may be faster to pull the whole table in one query and filter using something like lodash's groupby()
  const [
    adminUsers,
    sponsorUsers,
    driverUsers,
    companies
  ]: [User[], UserWithSponsorWithCompany[], UserWithDriverWithCompany[], Company[]] =
  await Promise.all([
    prisma.user.findMany({ where: { isActive: true, role: Role.ADMIN }}),
    prisma.user.findMany({ where: { isActive: true, role: Role.SPONSOR }, include: { sponsor: { include: { company: true }}}}),
    prisma.user.findMany({ where: { isActive: true, role: Role.DRIVER }, include: { driver: { include: { company: true }}}}),
    prisma.company.findMany({ where: { isActive: true }}),
  ]);
  const adminDtos: UserDto[] = adminUsers.map((user: User) => new UserDto(user));
  const sponsorDtos: SponsorDto[] = sponsorUsers.map((user: UserWithSponsorWithCompany) => SponsorDto.fromUserWithSponsorWithCompany(user));
  const driverDtos: DriverDto[] = driverUsers.map((user: UserWithDriverWithCompany) => DriverDto.fromUserWithDriverWithCompany(user));
  const companyDtos: CompanyDto[] = companies.map((company: Company) => CompanyDto.fromCompany(company));
  return {adminDtos, sponsorDtos, driverDtos, companyDtos};
}

export default function Dashboard() {
    const data: DashboardData = useLoaderData();    

    const roleDisplays = React.useMemo(() => [
      { name: 'Admin',   lowercaseName: 'admin'   },
      { name: 'Sponsor', lowercaseName: 'sponsor' },
      { name: 'Driver',  lowercaseName: 'driver'  },
      { name: 'Company', lowercaseName: 'company' }
    ], []);

    const { search } = useLocation();
    const defaultView = roleDisplays.filter((rd) => rd.lowercaseName === React.useMemo(() => new URLSearchParams(search), [search]).get('view'))[0] ?? roleDisplays[0];

    const [selected, setSelected] = useState(defaultView);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<Partial<DashboardDto> | null>(null);

    function openEditModal(rowDto: Partial<DashboardDto>) {
      setSelectedEdit(rowDto);
      setIsEditOpen(true);
    }

    function setSelectEditCompany() {
      if (['Sponsor', 'Driver'].includes(selected.name)) {
        const companyIdx: number = data.companyDtos.findIndex(co => co.name === (selectedEdit as SponsorDto | DriverDto)?.companyName);
        const companyElement = document.getElementById('edit-user-company') as HTMLSelectElement;
        companyElement.options[companyIdx].selected = true;
      }
    }

    const userColumns: Column[] = React.useMemo(() => [
        { Header: 'Name', accessor: 'name'},
        { Header: 'Email', accessor: 'email'},
      ],
      []
    );

    const sponsorColumns: Column[] = React.useMemo(() => [
      ...userColumns,
      { Header: 'Company', accessor: 'companyName'},
      { Header: '', accessor: 'companyId'},
      ],
      []
    );

    const driverColumns: Column[] = React.useMemo(() => [
      ...userColumns,
      { Header: 'Company', accessor: 'companyName'},
      { Header: 'Enrollment Status', accessor: 'enrollmentStatus'},
      { Header: '', accessor: 'companyId'},
      ],
      []
    );

    const companyColumns: Column[] = React.useMemo(() => [
      { Header: 'Name', accessor: 'name'},
      { Header: 'Point Value ($)', accessor: 'pointDollarValue'},
      { Header: '', accessor: 'id'},
      ],
      []
    );

    function getTableOptionsFromRoleName(roleName: string): TableOptions<{}> {
      if ('Admin'=== roleName) return {data: data.adminDtos, columns: userColumns};
      if ('Sponsor'=== roleName) return {data: data.sponsorDtos, columns: sponsorColumns, initialState: { hiddenColumns: ['companyId'] }};
      if ('Driver'=== roleName) return {data: data.driverDtos, columns: driverColumns, initialState: { hiddenColumns: ['companyId'] }};
      return {data: data.companyDtos, columns: companyColumns, initialState: { hiddenColumns: ['id'] }};
    }

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(getTableOptionsFromRoleName(selected.name));

    // enforces clean form input for money
    function limitDecimalPlaces(e: any) {
      if (['insertText', 'deleteContentBackward', 'deleteContentForward'].includes(e.nativeEvent.inputType)) {
        const dotIdx = e.target.value.indexOf('.');
        if (dotIdx !== -1 || (e.target.value.length - dotIdx) > 3) {
          e.target.value = e.target.value.substring(0, dotIdx + 3);
        }
      }
      else {
        e.target.value = parseFloat(e.target.value).toFixed(2);
      }
    }

    return (
      <main className="dark:text-light">
      <div className='flex justify-center mt-2'><h1 className='text-xl font-bold'>Dashboard</h1></div>
      <div className='flex justify-center'>
        <div className='block w-[40rem] mt-2'>
          <Listbox value={selected} onChange={setSelected}>
            <Listbox.Button className='w-32 border-2 relative bg-light py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-light focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-dark dark:text-dark'>
              <span className='block truncate'>{selected.name}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronDownIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
            <Listbox.Options className='w-32 absolute mt-1 max-h-60 overflow-auto bg-light py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:text-dark'>
              {roleDisplays.map((roleDisplay: {name: string, lowercaseName: string}, roleIdx: number) => (
                <Listbox.Option
                  key={roleIdx}
                  className={({ active }) =>
                    `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                      active ? 'bg-gray-100' : ''
                    }`
                  }
                  value={roleDisplay}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate dark:text-dark ${
                          selected ? 'font-medium': 'font-normal'
                        }`}
                      >
                        {roleDisplay.name}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
          </Listbox>
            <button
              type='button'
              onClick={() => setIsCreateOpen(true)}
              className='relative border-2 ml-2 w-44 bg-light p-2 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-light focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-dark dark:text-dark'
            >
              Create new {selected.lowercaseName}
            </button>
          <table {...getTableProps()} className='text-xl mt-2 shadow-xl'>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} className={'border-2 p-2 font-bold'}>
                      {column.render('Header')}
                    </th>
                  ))}
                  {/* empty header cell for edit column */}
                  <th className='border-2 p-2 font-bold w-14'></th>
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
                          className='border-2 p-2'
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                    {/* extra cell for edit button */}
                    <td className='border-2 p-2'>
                      <button onClick={() => {openEditModal(row.values as Partial<DashboardDto>)}}>
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* create modal */}
      <Transition appear show={isCreateOpen} as={Fragment}>
        <Dialog as='div'className='relative z-10'onClose={() => setIsCreateOpen(false)}>
          <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-dark bg-opacity-75'/>
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
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden bg-light p-6 text-left align-middle shadow-xl transition-all border-2'>
                <Dialog.Title
                  as='h3'
                  className='text-center text-lg font-medium leading-6'
                >
                  New {selected.name}
                </Dialog.Title>
                <div className='mt-2'>
                <Form method='post' action={'/api/create-' + selected.lowercaseName} onSubmit={() => setIsCreateOpen(false)} className='w-full max-w-lg'>
                  {['Sponsor', 'Driver', 'Admin'].includes(selected.name) &&
                  <div className='flex flex-wrap -mx-3 mb-2'>
                    <div className='w-full md:w-1/2 px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-first-name'>
                        Name
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='name' id='grid-first-name' type='text' placeholder='John Doe' required/>
                    </div>
                    <div className='w-full md:w-1/2 px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-last-name'>
                        Email
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='email' id='grid-last-name' type='text' placeholder='johndoe@gmail.com' required/>
                    </div>
                  </div>
                  }
                  {['Sponsor', 'Driver'].includes(selected.name) &&
                  <div className='flex flex-wrap -mx-3 mb-2'>
                    <div className='w-full px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-state'>
                        Company
                      </label>
                      <div className='relative'>
                        <select className='block appearance-none w-full bg-gray-200 border border-lightgray text-gray-700 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-light focus:border-lightgray' name='companyId' id='grid-state' required>
                          {data.companyDtos.map((company) =>
                            <option key={company.id} value={company.id.toString()}>{company.name}</option>
                          )}
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                          <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                        </div>
                      </div>
                    </div>
                  </div>
                  }
                  {'Company' === selected.name &&
                  <div className='flex flex-wrap -mx-3 mb-2'>
                    <div className='w-full md:w-1/2 px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-first-name'>
                        Name
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='name' id='grid-first-name' type='text' placeholder='Acme, Inc.' required/>
                    </div>
                    <div className='w-full md:w-1/2 px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-last-name'>
                        Point Value ($)
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='pointDollarValue' id='grid-last-name' type='number' defaultValue='1.00' step='0.01' onInput={limitDecimalPlaces} required/>
                    </div>
                  </div>
                  }
                  <input type='hidden' name='redirectUri' value={'/admin/dashboard?view=' + selected.lowercaseName}/>
                <div className='mt-4 flex justify-center'>
                  <button
                    type='submit'
                    className='inline-flex justify-center border px-4 py-2 text-sm text-center font-medium'
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </div>
            </Dialog.Panel>
          </Transition.Child>
          </div>
          </div>
        </Dialog>
      </Transition>
      {/* edit modal */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as='div'className='relative z-10' onClose={() => setIsEditOpen(false)}>
          <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-dark bg-opacity-75'/>
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
              beforeEnter={setSelectEditCompany}
            >
              <Dialog.Panel className='transform overflow-hidden bg-light p-6 text-left align-middle shadow-xl transition-all border-2'>
                <Dialog.Title
                  as='h3'
                  className='text-center text-lg font-medium leading-6'
                >
                  Edit {selected.name}
                </Dialog.Title>
                <div className='mt-2'>
                <Form method='post' action={'/api/edit-' + selected.lowercaseName} onSubmit={() => setIsEditOpen(false)} className='w-full max-w-lg'>
                  {['Sponsor', 'Driver', 'Admin'].includes(selected.name) &&
                  <div className='flex flex-wrap -mx-3 mb-2'>
                    <div className='w-full px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='edit-name'>
                        Name
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='name' id='edit-name' type='text' defaultValue={selectedEdit?.name} required/>
                    </div>
                    <input type='hidden' name='email' value={(selectedEdit as DashboardUserDto | null)?.email}/>
                  </div>
                  }
                  {['Sponsor', 'Driver'].includes(selected.name) &&
                  <div className='flex flex-wrap -mx-3 mb-2'>
                    <div className='w-full px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='edit-user-company'>
                        Company
                      </label>
                      <div className='relative'>
                        <select className='block appearance-none w-full bg-gray-200 border border-lightgray text-gray-700 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-light focus:border-lightgray' name='newCompanyId' id='edit-user-company' required>
                          {data.companyDtos.map((company) =>
                            <option key={company.id} value={company.id.toString()}>{company.name}</option>
                          )}
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                          <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                        </div>
                      </div>
                    </div>
                    <input type='hidden' name='oldCompanyId' value={(selectedEdit as SponsorDto | DriverDto | null)?.companyId}/>
                  </div>
                  }
                  {'Company' === selected.name &&
                  <>
                  <div className='flex flex-wrap -mx-3 mb-2'>
                    <div className='w-full md:w-1/2 px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='edit-company-name'>
                        Name
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='name' id='edit-company-name' type='text' defaultValue={selectedEdit?.name} required/>
                    </div>
                    <div className='w-full md:w-1/2 px-3'>
                      <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='edit-point-value'>
                        Point Value ($)
                      </label>
                      <input className='appearance-none block w-full bg-gray-200 text-gray-700 border border-lightgray py-3 px-4 leading-tight focus:outline-none focus:bg-light' name='pointDollarValue' id='edit-point-value' type='number' defaultValue={(selectedEdit as CompanyDto)?.pointDollarValue} step='0.01' onInput={limitDecimalPlaces} required/>
                    </div>
                  </div>
                  <input type='hidden' name='companyId' value={(selectedEdit as CompanyDto | null)?.id}/>
                  </>
                  }
                  <input type='hidden' name='redirectUri' value={'/admin/dashboard?view=' + selected.lowercaseName}/>
                <div className='mt-4 flex justify-center'>
                  <button
                    type='submit'
                    className='inline-flex justify-center border px-4 py-2 text-sm text-center font-medium'
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </div>
            </Dialog.Panel>
          </Transition.Child>
          </div>
          </div>
        </Dialog>
      </Transition>
      </main>
    )
}