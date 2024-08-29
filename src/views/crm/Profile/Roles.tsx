
import { useState, useEffect,useMemo, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import axios from 'axios'
import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable'
import { apiDeleteRole, apiGetRoleDetails } from '@/services/CommonService'
import { BiPencil } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import formateDate from '@/store/dateformate'
import { Link } from 'react-router-dom'
import { AuthorityCheck, ConfirmDialog } from '@/components/shared'
import { Notification, Pagination, Select, toast, Tooltip } from '@/components/ui'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type {  FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { useRoleContext } from '../Roles/RolesContext'

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <Input
                size='sm'
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
}

interface Access {
    file?: string[];
    lead?: string[];
    project?: string[];
    task?: string[];
    mom?: string[];
    quotation?: string[];
    contract?: string[];
    archive?: string[];
    user?: string[];
    addMember?: string[];
    role?: string[];
  }
  
  interface Role {
    _id: string;
    role: string;
    access: Access;
    createdAt: string;
    __v: number;
  }
  type Option = {
    value: number
    label: string
}

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const Roles = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [id,setId]=useState<string>('')
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const {roleData}=useRoleContext()
   

    const [open, setOpen] = useState(false)

    

    const handleOpen = (id:string) => {
        setId(id)
        setOpen(true)
    }
    const handleClose = () => {
        console.log('Close')
        setOpen(false)
    }

    const handleConfirm = (id:string) => {
        console.log('Confirm')
        setOpen(false)
    }




   

    const deleteRole=async(id:string)=>{
        const response=await apiDeleteRole(id)
        if(response.code===200){
            toast.push(
                <Notification type='success' duration={2000} closable>
                    {response.message}
                </Notification>
            )
            window.location.reload()
            
        }
        else{
            toast.push(
                <Notification type='danger' duration={2000} closable>
                    {response.errorMessage}
                </Notification>
            )
        }
    }


    const columns = useMemo<ColumnDef<Role>[]>(
        () => [
        {
            header: 'Role',
            accessorKey: 'role',
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: ({ row }) => {
                return <span>{formateDate(row.original.createdAt)}</span>
            }
        },
        {
            header: 'Access Level',
            accessorKey: 'access',
            cell: ({ row }) => {
                const access = row.original.access
                const accessLevels = Object.entries(access).map(([key, value]:any) => {
                    return `${key}: ${value.join(', ')}`
                }).join(' | ')
                return <span>{accessLevels}</span>
            }
        },
        {
            header: '',
            id: 'action',
            cell: (props) => {
                const { row } = props
                const role= row.original.role
                const id= row.original._id
                const {roleData}=useRoleContext()
                const editAccess = roleData?.data?.role?.update?.includes(`${localStorage.getItem('role')}`)
                const deleteAccess = roleData?.data?.role?.delete?.includes(`${localStorage.getItem('role')}`)
                return(
                <span className='flex items-center text-lg gap-2'>
                    {editAccess&&
                    <Tooltip title='Edit'>
                <span className='hover:text-blue-500 text-lg'>
                    <Link to={`/app/crm/roles/edit?role=${role}&id=${id}`}>
                <BiPencil/>
                </Link>
                </span>
                </Tooltip>}
                {deleteAccess&&
                <Tooltip title='Delete'>
                <span onClick={()=>handleOpen(id)} className=' cursor-pointer hover:text-red-500 text-lg'><MdDeleteOutline/></span></Tooltip>}
                </span>)
            },
        },
    ],[])

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await apiGetRoleDetails()
            if (response) {
                setData(response.data)
                setLoading(false)
                console.log(response.data);
        }
    }
    fetchData()
    }, [])
    const table = useReactTable({
        data:data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    
    return (
        <>
            <div className="flex gap-3 justify-end">
            <AuthorityCheck
                    userAuthority={[`${localStorage.getItem('role')}`]}
                    authority={roleData?.data?.role?.create??[]}
                    >
                <Link to={`/app/crm/roles/create`}>
                <Button size="sm" className="ml-2" variant='solid'>
                    Create Role
                </Button>
                </Link>
                </AuthorityCheck>
                <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            </div>
            <>
           
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                }
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                {loading?
                     <TableRowSkeleton
                     avatarInColumns={[0]}
                     columns={columns.length}
                     rows={10}
                 />:
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>}
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={data.length}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) =>
                                option.value ===
                                table.getState().pagination.pageSize
                        )}
                        options={pageSizeOption}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </>
           
             <ConfirmDialog
                isOpen={open}
                type={'danger'}
                title={`Delete Role`}
                confirmButtonColor={'red-600'}
                onClose={handleClose}
                children={<p>Are you sure you want to delete this role?</p>}
                onRequestClose={handleClose}
                onCancel={handleClose}
                onConfirm={()=>deleteRole(id)}
            >
                
            </ConfirmDialog>
        </>
    )
}

export default Roles

