
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
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { apiGetCrmLeads, apiGetCrmProjectsSubTaskData, apiGetCrmProjectsSubTaskDelete, apiGetCrmProjectsTaskData, apiGetCrmProjectsTaskDelete } from '@/services/CrmService'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Notification, Pagination, Select, toast } from '@/components/ui'
import { HiOutlineEye, HiOutlinePencil, HiPlusCircle } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { MdDeleteOutline } from 'react-icons/md'
import SubTaskDetails from './SubTaskDetailsDrawer'
import EditSubTask from './EditSubTask'
import { ConfirmDialog } from '@/components/shared'


interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table
type SubTask = {
    project_id: string;
    task_id: string;
    sub_task_id: string;
    sub_task_name: string;
    sub_task_description: string;
    actual_sub_task_start_date: string;
    actual_sub_task_end_date: string;
    estimated_sub_task_start_date: string;
    estimated_sub_task_end_date: string;
    sub_task_status: string;
    sub_task_priority: string;
    sub_task_createdOn: string;
    sub_task_reporter: string;
    sub_task_createdBy: string;
    sub_task_assignee: string;
    remark:Remarks[]
};
type Remarks={
    remark:string;
    remark_by:string;
    remark_date:string;}
type Data={
    Data:SubTask
  }


const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]
const ActionColumn = ({ row,users }: { row: SubTask,users:string[]}) => {
    const navigate = useNavigate()
    const { textTheme } = useThemeClass()
    const location=useLocation()
    const queryParams = new URLSearchParams(location.search);
    const projectId=queryParams.get('project_id') || '';
    const data={user_id:localStorage.getItem('userId'),
    project_id:projectId,
    task_id:row.task_id,
    sub_task_id:row.sub_task_id}

    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)  
    }
    const onDialogClose = () => {
        setIsOpen(false)
    }
    
    const onDelete = async () => {
        const response = await apiGetCrmProjectsSubTaskDelete(data)
        console.log('response',response)
        
        if(response.code===200){
            toast.push(
                <Notification type='success' duration={2000} closable>Subtask Deleted Successfully</Notification>
            )
            window.location.reload()
        }
        else{
            toast.push(
                <Notification type='danger' duration={2000} closable>{response.errorMessage}</Notification>
            )
        
        }
        
       
    }
    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2  hover:${textTheme}`}
                
            >
                <EditSubTask Data={row} users={users}/>
                
            </span>
            <span
                className={`cursor-pointer py-2  hover:${textTheme}`}
                
            >
                <MdDeleteOutline onClick={()=>openDialog()}/>
                
            </span>

            <ConfirmDialog
          isOpen={dialogIsOpen}
          type="danger"
          onClose={onDialogClose}
          confirmButtonColor="red-600"
          onCancel={onDialogClose}
          onConfirm={() => onDelete()}
          title="Delete Subtask"
          onRequestClose={onDialogClose}>
            <p> Are you sure you want to delete this Subtask? </p>            
        </ConfirmDialog>
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
                {(role==='ADMIN' || role==='Senior Architect' || role==='Project Architect') && 
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Add Lead
                </Button>}
            </Link>
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
const statusColors: { [key: string]: string } = {
    'Follow Up': 'bg-green-200 text-green-700',
    'Interested': 'bg-blue-200 text-blue-700',
    'No Response': 'bg-red-200 text-red-700',
    'Not Interested': 'bg-red-200 text-red-700',
};

const Subtasks = ({task,users}:any) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()


    const location=useLocation()
    const queryParams = new URLSearchParams(location.search);
    const projectId=queryParams.get('project_id') || '';
    const [taskData,setTaskData]=useState<any>(null)
    console.log(projectId,task);
    
  
    useEffect(() => {
        const TaskData=async()=>{
            const response = await apiGetCrmProjectsSubTaskData(projectId,task);
            setTaskData(response.data)
            console.log('response',response);
        }
        TaskData();
  
    }, [])
    console.log('taskData',taskData);
    const formateDate = (dateString:string) => {
        const date = new Date(dateString);
        const day=date.getDate().toString().padStart(2, '0');
        const month=(date.getMonth() + 1).toString().padStart(2, '0');
        const year=date.getFullYear();
        return `${day}-${month}-${year}`;
        }

    const columns = useMemo<ColumnDef<SubTask>[]>(
        () => [
         {
            header:'Subtask',
            accessorKey:'sub_task_name',
           cell:({row})=>{

            return <SubTaskDetails data={row.original}/>
           }
         },
         {
            header:'Priority',
            accessorKey:'sub_task_priority',
         },
         {
            header:'Status',
            accessorKey:'sub_task_status'
         },
            {
                header:'Start Date',
                accessorKey:'estimated_sub_task_start_date',
                cell:({row})=>{
                    return <div>{formateDate(row.original.estimated_sub_task_start_date)}</div>
                }
            },
            {
                header:'End Date',
                accessorKey:'estimated_sub_task_end_date',
                cell:({row})=>{
                    return <div>{formateDate(row.original.estimated_sub_task_end_date)}</div>
                }
            },
            {
                header:'Action',
                id: 'action',
                accessorKey:'action',
                cell: ({row}) => <ActionColumn row={row.original} users={users} />,
            }
           
        ],
        []
    )


    const table = useReactTable({
        data:taskData?taskData:[],
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
                                        {header.isPlaceholder || header.id==='action' ? null : (
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
                            <Tr key={row.id} className=''>
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
                    total={taskData?taskData.length:0}
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

export default Subtasks

