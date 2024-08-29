
import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
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
import { LeadDataItem } from './type'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeadData } from './data'
import { Select } from '@/components/ui'    
import { useData } from '../FileManagerContext/FIleContext'
import { Loading } from '@/components/shared'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import NoData from '@/views/pages/NoData'
import formateDate from '@/store/dateformate'

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
        <div className="flex justify-between ">

            <div className="flex items-center mb-4">
                <Input
                    {...props}
                    value={value}
                    size='sm'
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
       
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    let itemValue:any = row.getValue(columnId);

    
    if (columnId === 'lead_date') {
        itemValue = formateDate(itemValue);
    }

    const itemRank = rankItem(itemValue, value);
    addMeta({
        itemRank,
    });

    return itemRank.passed;
};
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

console.log(getLeadData);

const Filtering = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate=useNavigate()

    const columns = useMemo<ColumnDef<LeadDataItem>[]>(
        () => [
           
            {
                header: 'Lead name',
                accessorKey: 'lead_name',
                cell: (props) => {
                    const row = props.row.original;
                    return (
                        <div className=' cursor-pointer'>
                            {row.lead_name}
                        </div>
                    )
                  }},
                  {
                    header: 'Lead Status',
                    accessorKey: 'lead_status',
                    cell: (props) => {
                        const row = props.row.original;
                        return (
                            <div>
                                {row.lead_status}
                            </div>
                        )
                      }
                  },
                  {
                    header: 'Email',
                    accessorKey: 'lead_email',
                    cell: (props) => {
                        const row = props.row.original;
                        return (
                            <div>
                                {row.lead_email}
                            </div>
                        )
                      }
                  }
                  ,
                  {
                    header: 'Created Date',
                    accessorKey: 'lead_date',
                    cell: ({row}) => {
                        const date = row.original.lead_date;
                        const [year, month, day] = new Date(date).toISOString().split('T')[0].split('-');
                return `${day}-${month}-${year}`;
                       
                      }
                  }
            
        ],

        []
    )
    const { leadData,loading } = useData();
    

    const totalData = leadData.length
    
    
    
    const table = useReactTable({
        data:leadData,
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
   const pagingData = {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    }
    const { pageSize, pageIndex, total } = pagingData



    return (
        <>
        {/* <Loading loading={ loading} type="cover"> */}
        <div className='flex justify-between'>
            <div></div>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search ..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            </div>
            
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
                                                            : 'pointer-events-none',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                {loading  ? (
                    <TableRowSkeleton
                      
                        rows={pagingData.pageSize}
                        avatarInColumns= {[0]}
                        columns={columns.length}
                        avatarProps={{ width: 14, height: 14 }}
                    />
                ):leadData.length===0?<Tr><Td colSpan={columns.length}><NoData/></Td></Tr>: (
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id} className=' capitalize cursor-pointer' onClick={()=>navigate(`/app/crm/fileManager/leads?lead_id=${row.original.lead_id}&lead_name=${row.original.lead_name}`)}>
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
                </TBody>)}
            </Table>
          
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={totalData}
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
            {/* </Loading> */}
        </>
    )
}

export default Filtering

