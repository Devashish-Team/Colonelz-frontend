
import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
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
import type { Product } from '../store/productListSlice'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { apiGetCrmLeads } from '@/services/CrmService'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Pagination, Select } from '@/components/ui'
import { HiOutlineEye, HiPlusCircle } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useRoleContext } from '../../Roles/RolesContext'
import { AuthorityCheck } from '@/components/shared'
import formateDate from '@/store/dateformate'

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}
const data=await apiGetCrmLeads()
const responseData=data.data.leads
console.log(responseData);

const { Tr, Th, Td, THead, TBody, Sorter } = Table
const totalData = responseData.length


const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]
const ActionColumn = ({ row }: { row: Product}) => {
    const navigate = useNavigate()
    const { textTheme } = useThemeClass()
    const onEdit = () => {
        navigate(`/app/crm/lead/?id=${row.lead_id}`)
    }
    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onEdit}
            >
                <HiOutlineEye />
            </span>
        </div>
    )
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)
    const role=localStorage.getItem('role')

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    const {roleData}=useRoleContext()
    console.log(roleData.data.lead?.read);
    
    
    
    

    return (
        <div className="flex justify-between md:flex-col lg:flex-row">
            <h3>Leads</h3>
            <div className="flex items-center mb-4 gap-3">
                <Input
                size='sm'
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                  <Link
                className="block lg:inline-block md:mb-0 mb-4"
                to="/app/crm/lead-new"
            >
               <AuthorityCheck
                userAuthority={[`${role}`]}
               authority={roleData?.data?.lead?.create??[]}
               >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Add Lead
                </Button>
                </AuthorityCheck>
            </Link>
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    let itemValue:any = row.getValue(columnId);

    
    if (columnId === 'date') {
        itemValue = formateDate(itemValue);
    }

    const itemRank = rankItem(itemValue, value);
    addMeta({
        itemRank,
    });

    return itemRank.passed;
};
const statusColors: { [key: string]: string } = {
    'Follow Up': 'bg-green-200 text-green-700',
    'Interested': 'bg-blue-200 text-blue-700',
    'No Response': 'bg-red-200 text-red-700',
    'Not Contacted': 'bg-red-200 text-red-700',
    'Inactive': 'bg-yellow-200 text-yellow-700',
};

const Filtering = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            { header: 'Lead Name', accessorKey: 'name',
        cell: ({row}) => {
            const name=row.original.name
            return <Link to={`/app/crm/lead/?id=${row.original.lead_id}`} className=' capitalize'>{name}</Link>
        }},
        { header: 'Lead Status', accessorKey: 'status',
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <span
                        className={`px-2 py-1 rounded-sm text-xs font-semibold ${statusColors[status]}`}
                    >
                        {status}
                    </span>
                )
            }
         },
        {header:'Location',accessorKey:'location'},
        
            { header: 'Email', accessorKey: 'email' },
            { header: 'Phone', accessorKey: 'phone' },
            { header: 'Created date', accessorKey: 'date',
            cell: ({row}) => {
                const date = row.original.date;
                const [year, month, day] = new Date(date).toISOString().split('T')[0].split('-');
                return `${day}-${month}-${year}`;
            }},
            
           
        ],
        []
    )


    const table = useReactTable({
        data:responseData,
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
    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }
    return (
        <>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
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
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id} onClick={()=>navigate(`/app/crm/lead/?id=${row.original.lead_id}`)} className=' cursor-pointer'>
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
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
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
    )
}

export default Filtering

