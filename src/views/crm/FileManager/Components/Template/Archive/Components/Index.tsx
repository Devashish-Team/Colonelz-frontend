/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useMemo, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    getFacetedRowModel,
    getSortedRowModel,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef,FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { DataItem } from '../Store/ArchiveSlice'
import { apiGetCrmFileManagerArchive, apiGetCrmFileManagerArchiveRestore, apiGetCrmFileManagerDeleteArchiveFiles } from '@/services/CrmService'
import { FiDelete } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Input, Notification, Skeleton, Tooltip, toast } from '@/components/ui'
import { LiaTrashRestoreSolid } from "react-icons/lia";
import { AiOutlineFile, AiOutlineFolder } from 'react-icons/ai'
import { AuthorityCheck, ConfirmDialog, StickyFooter } from '@/components/shared'
import NoData from '@/views/pages/NoData'
import { useRoleContext } from '@/views/crm/Roles/RolesContext'
import formateDate from '@/store/dateformate'
import { role } from '@/utils/hooks/useAuth'

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}



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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <Input
                    {...props}
                    size='sm'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    let itemValue:any = row.getValue(columnId);

    
    if (columnId === 'created_at') {
        itemValue = formateDate(itemValue);
    }

    const itemRank = rankItem(itemValue, value);
    addMeta({
        itemRank,
    });

    return itemRank.passed;
};

type Person = {
    firstName: string
    lastName: string
    age: number
}

type Option = {
    value: number
    label: string
}

type ArchiveData={
    delete_type:string
    file_id:string
    lead_id:string
    project_id:string
    type:string
    folder_name:string
    sub_folder_name_first:string
    sub_folder_name_second:string
}
type Restore={
    file_id:string
    lead_id:string
    project_id:string
    type:string
    folder_name:string
    sub_folder_name_first:string
    sub_folder_name_second:string
}

const { Tr, Th, Td, THead, TBody,Sorter } = Table




const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const PaginationTable = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { roleData } = useRoleContext()
    console.log('RoleData:', roleData);
    
      const [deleteData,setDeleteData]=useState<ArchiveData>()
      const [restoreData,setRestoreData]=useState<Restore>()
      const [dialogIsOpen2, setIsOpen2] = useState(false)
      const [dialogIsOpen3, setIsOpen3] = useState(false)
      const [folderName, setFolderName] = useState<string>('')
      
  
      const openDialog2 = (file_id:string,lead_id:string,project_id:string,type:string,folder_name:string,sub_folder_name_first:string,sub_folder_name_second:string,delete_type:string) => {
          setIsOpen2(true)
          setDeleteData({file_id,lead_id,project_id,type,folder_name,sub_folder_name_first,sub_folder_name_second,delete_type})
      }
  
      const onDialogClose2 = () => {
          setIsOpen2(false)
      }
  
      const openDialog3 = (file_id:string,lead_id:string,project_id:string,type:string,folder_name:string,sub_folder_name_first:string,sub_folder_name_second:string) => {
          setIsOpen3(true)
          setRestoreData({file_id,lead_id,project_id,type,folder_name,sub_folder_name_first,sub_folder_name_second})
      }
  
      const onDialogClose3 = () => {
          setIsOpen3(false)
      }

      const deleteArchive = async (deleteData:any) => {
       
        
        function warn(text:string) {
          toast.push(
              <Notification closable type="warning" duration={2000}>
                  {text}
              </Notification>,{placement:'top-center'}
          )
      }
         
        const postData = {
         user_id:localStorage.getItem('userId'),
         file_id:deleteData.file_id,
         lead_id:deleteData.lead_id,
         project_id:deleteData.project_id,
         type:deleteData.type,
         folder_name:deleteData.folder_name,
         sub_folder_name_first:deleteData.sub_folder_name_first,
         sub_folder_name_second:deleteData.sub_folder_name_second,
         delete_type:deleteData.delete_type,
        };
        console.log(postData);
        
        try {
          await apiGetCrmFileManagerDeleteArchiveFiles(postData);

          toast.push(
            <Notification closable type="success" duration={2000}>
              Folder deleted successfully
            </Notification>,{placement:'top-center'}
          )
          window.location.reload()
        } catch (error) {
          toast.push(
            <Notification closable type="danger" duration={2000}>
              Error deleting folder
            </Notification>,{placement:'top-center'}
          )
        }
        
      }

      const Restore=async()=>{
        const postData = {
            user_id:localStorage.getItem('userId'),
            file_id:restoreData?.file_id,
            lead_id:restoreData?.lead_id,
            project_id:restoreData?.project_id,
            type:restoreData?.type,
            folder_name:restoreData?.folder_name,
            sub_folder_name_first:restoreData?.sub_folder_name_first,
            sub_folder_name_second:restoreData?.sub_folder_name_second,
            restore_type:restoreData?.file_id?'file':'folder'
           }
           console.log('postData',postData);
           
        try {
           const respone= await apiGetCrmFileManagerArchiveRestore(postData);
           if(respone.code===200){
            toast.push(
                <Notification closable type="success" duration={2000}>
                  {respone.message}
                </Notification>,{placement:'top-center'}
              )
              window.location.reload()
           }
           else{
            toast.push(
                <Notification closable type="danger" duration={2000}>
                  {respone.errorMessage}
                </Notification>,{placement:'top-center'}
              )
           }
            // window.location.reload()
          } catch (error) {
            toast.push(
              <Notification closable type="danger" duration={2000}>
                Internal Server error
              </Notification>,{placement:'top-center'}
            )
          }
      }

      
      console.log(roleData);
      
    const columns = useMemo<ColumnDef<DataItem>[]>(
        () => [
            {
                header: 'Name',
                accessorKey: 'deleted_name',
                cell: ({row}) => {
                    const file = row.original.files && row.original.files[0];
                    const project_name = row.original.project_name;
                    const lead_name = row.original.lead_name;
                    const fileName = file && file.fileName;
                    const folderName = file && file.folder_name;
                    const subfolderName = file && file.sub_folder_name_second;
                    const navigate=useNavigate()
                    return(
                        <div>
                        {
                            fileName 
                            ? <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className=' cursor-pointer text-md flex items-center gap-2'>{<AiOutlineFile/>}{fileName}</a>
                            : <div className='  flex items-center gap-2' >{<AiOutlineFolder/>}{folderName || subfolderName}</div>
                        }
                    </div>
                    )
                }

            },
            {header:"Location",
                id: 'location',
            cell:({row})=>{
                return(
                    <div className="flex items-center gap-2">
                        {row.original.lead_name.length>0?`FileManager/Lead/${row.original.lead_name}/${row.original.folder_name}`:row.original.project_name.length>0?`FileManager/Project/${row.original.project_name}/${row.original.folder_name}`:
                        `FileManager/Company Data/${row.original.folder_name}/${row.original.sub_folder_name_first}/${row.original.sub_folder_name_second}`}
                    </div>
                )
            }
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: ({row}) => {
                    const file = row.original.files && row.original.files[0];
                    const fileName = file && file.fileName;
                    return(
                        <div>{fileName ? 'file' : 'folder'}</div>
                    )
                }
            },
            {
                header: 'Date Deleted',
                accessorKey: 'created_at',
                cell: ({row}) => {
                    const date=row.original.created_at
                    return(
                        <div>{formateDate(date)}</div>
                    )
                }
            },
            
            {
                header: 'Actions',
                accessorKey: 'action',
                id: 'action',
                cell: ({row}) => {
                    const fileId=row.original.files[0].fileId
                    const leadId=row.original.lead_id
                    const projectId=row.original.project_id
                    const type=row.original.type
                    const folder_name=row.original.folder_name
                    const sub_folder_name_first = row.original.sub_folder_name_first || '';
                    const sub_folder_name_second = row.original.sub_folder_name_second || '';
                    const delete_type = row.original.files[0].folder_name ? 'folder' : 'file';
                    const role = localStorage.getItem('role') || '';
                    const {roleData} = useRoleContext();
                    const restoreAccess = roleData?.data?.archive?.restore?.includes(role); 
                    const deleteAccess = roleData?.data?.archive?.delete?.includes(role);

                    
                  
                        return (<div className='flex gap-3  '>
                            {restoreAccess &&
                                <Tooltip title="Restore">
                                <span className="cursor-pointer">
                            <LiaTrashRestoreSolid className='text-xl cursor-pointer hover:text-blue-500' onClick={()=>openDialog3(
                                fileId,
                                leadId,
                                projectId,
                                type,
                                folder_name,
                                sub_folder_name_first,
                                sub_folder_name_second,
                            )}/>
                            </span>
                            </Tooltip>
                }
                
                            {deleteAccess &&
                             <Tooltip title="Delete">
                <span className="cursor-pointer">
                <MdDeleteOutline
                                className=' text-xl cursor-pointer hover:text-red-500'
                                onClick={() =>
                                    openDialog2(
                                        fileId,
                                        leadId,
                                        projectId,
                                        type,
                                        folder_name,
                                        sub_folder_name_first,
                                        sub_folder_name_second,
                                        delete_type
                                    )
                                }
                            />
                </span>
            </Tooltip>
                }
                            </div>
                        );
                   
                }
            },
        ],
        []
    )

    const [filesData,setFilesData] = useState([])
    const [loading,setLoading] = useState(true)
    const userId=localStorage.getItem('userId')
    const navigate=useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            const response = await apiGetCrmFileManagerArchive(userId)
                setLoading(false)
            setFilesData(response.data)
            console.log(response);
            console.log(filesData)
        }
        fetchData()
    }
    , [])

    const table = useReactTable({
        data:filesData,
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
        <div className=''>
            <div className='flex justify-between mb-5'>
            <h3 className='mb-5'>Archive</h3>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            </div>
            <div className='h-screen'>

            {
                !loading ?filesData.length === 0 ?(<NoData/>) :(
                    <Table >
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder || header.id==='action' ?   null : (
                                                <div
                                                    {...{
                                                        className:
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                        onClick:
                                                         header.column.getToggleSortingHandler()
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {
                                                       header.column.id !== 'age' && header.column.id !== 'location' && <Sorter
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
                    </TBody>
                </Table>
                ):(
                    <Skeleton height={300}/>
                )
            }
           
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={filesData.length}
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
            </div>
           
            <ConfirmDialog
          isOpen={dialogIsOpen2}
          type="danger"
          onClose={onDialogClose2}
          confirmButtonColor="red-600"
          onCancel={onDialogClose2}
          onConfirm={() =>  deleteArchive(
            deleteData
        )}
          title={`Delete ${deleteData?.delete_type}`}
          onRequestClose={onDialogClose2}>
            <p> Are you sure, delete this {deleteData?.delete_type} permanently? </p>            
        </ConfirmDialog>
            <ConfirmDialog
          isOpen={dialogIsOpen3}
          type="success"
          onClose={onDialogClose3}
          confirmButtonColor="green-600"
          onCancel={onDialogClose3}
          onConfirm={() => Restore(
            
        )}
          title={`Restore `}
          onRequestClose={onDialogClose3}>
            <p> Are you sure, restore this file/folder? </p>            
        </ConfirmDialog>
        <StickyFooter
        className="-mx-8 px-8 flex items-center justify-between py-4 mt-7"
        stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
                <div className="md:flex items-center">
                    <Button size="sm" className="ltr:mr-3 rtl:ml-3" onClick={()=>navigate('/app/crm/fileManager')}>
                        Back
                    </Button>
                </div>
            </StickyFooter>
        </div>
    )
}

export default PaginationTable

