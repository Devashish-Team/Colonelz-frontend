import React, { useEffect, useState } from 'react'
import { FolderItem,fetchLeadData} from './data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Dialog, Dropdown, Notification, Pagination, Select, Skeleton, Tooltip, toast } from '@/components/ui';
import type { MouseEvent } from 'react'
import YourFormComponent from './LeadForm';
import { FaFolder, FaRegFolder } from 'react-icons/fa';
import { useTheme } from '@emotion/react';
import { AuthorityCheck, ConfirmDialog, StickyFooter } from '@/components/shared';
import { apiDeleteFileManagerFolders, apiGetCrmFileManagerLeads } from '@/services/CrmService';
import Indexe from './Folders';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiTrash } from 'react-icons/hi';
import { format, isValid, parse, parseISO } from 'date-fns';
import { CgDanger } from 'react-icons/cg';


import { useMemo} from 'react'
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
import { MdDeleteOutline } from 'react-icons/md';
import NoData from '@/views/pages/NoData';
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton';
import { useRoleContext } from '@/views/crm/Roles/RolesContext';
import formateDate from '@/store/dateformate';

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
                    {...props}
                    value={value}
                    size='sm'
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

type Option = {
  value: number
  label: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    let itemValue:any = row.getValue(columnId);

    
    if (columnId === 'updated_date') {
        itemValue = formateDate(itemValue);
    }

    const itemRank = rankItem(itemValue, value);
    addMeta({
        itemRank,
    });

    return itemRank.passed;
};

const Index = () => {
    const [leadData, setLeadData] = useState<FolderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const leadId = queryParams.get('lead_id');
    const leadName = queryParams.get('lead_name');
    const role=localStorage.getItem('role')
    const {roleData} = useRoleContext();
    const uploadAccess = roleData?.data?.file?.create?.includes(`${localStorage.getItem('role')}`)
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchLeadData(leadId);
            setLeadData(data);
            setLoading(false);
        };
        fetchData();
    }, [leadId]);

    console.log(leadData);
    

    const [dialogIsOpen2, setIsOpen2] = useState(false)
    const [folderName, setFolderName] = useState<string>('')

    const openDialog2 = (folder_name:string) => {
        setIsOpen2(true)
        setFolderName(folder_name)
    }

    const onDialogClose2 = () => {
        setIsOpen2(false)
    }

    const deleteFolders = async (folder_name:string) => {
      function warn(text:string) {
        toast.push(
            <Notification closable type="warning" duration={2000}>
                {text}
            </Notification>,{placement:'top-center'}
        )
    }
      if (folder_name.length === 0) {
        warn('No files selected for deletion.')
        return;
      }   
      const postData = {
        lead_id:leadId,
        folder_name: folder_name,
        type:"",
        project_id:""
      };
      
       const response= await apiDeleteFileManagerFolders(postData);
       const data = await response.json();
         if (response.status === 200){
        toast.push(
          <Notification closable type="success" duration={2000}>
            Folder deleted successfully
          </Notification>,{placement:'top-center'}
        )
        window.location.reload()
    }
    else{
        toast.push(
          <Notification closable type="danger" duration={2000}>
            {data.errorMessage}
          </Notification>,{placement:'top-center'}
        )
    }
    }
    
    const navigate=useNavigate()

    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
         setIsOpen(true)
     }
 
     const onDialogClose = (e: MouseEvent) => {
         console.log('onDialogClose', e)
         setIsOpen(false)
     }
     const theme=useTheme
     console.log(leadData);



const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [globalFilter, setGlobalFilter] = useState('')


const columns = useMemo<ColumnDef<FolderItem>[]>(
    () => [
        { header: 'Name', accessorKey: 'folder_name'
        , cell: ({row}) => {
            return(
                <div>
                <div className="flex items-center gap-2">
                  <FaFolder/>
                  <a className="font-medium cursor-pointer" onClick={()=> navigate(
                              `/app/crm/fileManager/leads/folder?lead_id=${leadId}&lead_name=${leadName}&folder_name=${row.original.folder_name}`,
                          )}>
                    {row.original.folder_name}
                  </a>
                </div>
              </div>
            )
          }},
         
        { header: 'Type', cell: ({row}) => {
            return(
                <div>Folder</div>
            )
        }},
        { header: 'Files', accessorKey: 'total_files' },
        { header: 'Modified', accessorKey: 'updated_date', cell: ({row}) => {
            const date=row.original.updated_date
            return(
                <div>{formateDate(date)}</div>
            )
        }
        },

        {
            header: 'Actions',
            id: 'actions',
            cell: ({row}) => {
                const {roleData} = useRoleContext();
                return(
                    <AuthorityCheck
                    userAuthority={[`${localStorage.getItem('role')}`]}
                    authority={roleData?.data?.file?.delete??[]}
                    >
                    <div className=' ml-3 cursor-pointer' onClick={()=>openDialog2(row.original.folder_name)}>
                          <Tooltip title="Delete">
                          <span className="cursor-pointer">
                  <MdDeleteOutline className=' text-xl text-center hover:text-red-500'/>
                  </span>
                  </Tooltip>
                  </div>
                  </AuthorityCheck>
                )
            }
        },
    ],
    []
)

const totalData = leadData.length

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const onPaginationChange = (page: number) => {
  table.setPageIndex(page - 1)
}

const onSelectChange = (value = 0) => {
  table.setPageSize(Number(value))
}

const filteredProjectData = useMemo(() => {
   if (!roleData?.data?.quotation?.read?.includes(`${role}`)) {
    return leadData.filter(item => 
      item.folder_name.toLowerCase() !== 'quotation' && 
      item.folder_name.toLowerCase() !== 'procurement data'
    );}
    else if (!roleData?.data?.contract?.read?.includes(`${role}`)) {
        return leadData.filter(item => 
          item.folder_name.toLowerCase() !== 'contract'
        )
  }
  return leadData;
}, [leadData, role]);
console.log(filteredProjectData);


const table = useReactTable({
    data:filteredProjectData,
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
      <div>
          <div className="flex justify-between mb-5">
              <h3 className="">Lead-{leadName}</h3>
              {uploadAccess &&
              <Button variant="solid" size="sm" onClick={() => openDialog()}>
                  Upload
              </Button>
              }
          </div>
    
    <>
    <div className=' flex justify-between'>
    <div className="flex items-center mb-4">
  <nav className="flex">
    <ol className="flex items-center space-x-2">
      <li>
      <Link to={`/app/crm/fileManager`} className="text-blue-600 dark:text-blue-400 hover:underline">FileManager</Link>
      </li>
      <li>
        <span className="mx-2">/</span>
      </li>
      <li className="text-gray-500">Leads</li>
    
    </ol>
  </nav>
</div>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search..."
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
                                        {header.isPlaceholder  || header.id === 'actions' ? null : (
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
                 <TableRowSkeleton  rows={10}
                 avatarInColumns= {[0]}
                 columns={columns.length}
                 avatarProps={{ width: 14, height: 14 }}
             />
                :filteredProjectData.length===0?<TBody><Tr className='mx-auto'><Td colSpan={columns.length}><NoData/></Td></Tr></TBody>:
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
        </>
              <StickyFooter
                  className="-mx-8 px-8 flex items-center justify-between py-4 mt-7"
                  stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                  <div className="md:flex items-center">

                      <Button
                          size="sm"
                          className="ltr:mr-3 rtl:ml-3"
                          type="button"
                          onClick={() => {
                              navigate('/app/crm/fileManager')
                          }}
                      >
                          Back
                      </Button>
                  </div>
              </StickyFooter>
          <Dialog
              isOpen={dialogIsOpen}
              onClose={onDialogClose}
              onRequestClose={onDialogClose}
          >
              <YourFormComponent data={leadData} />
          </Dialog>
          <ConfirmDialog
          isOpen={dialogIsOpen2}
          type="danger"
          onClose={onDialogClose2}
          confirmButtonColor="red-600"
          onCancel={onDialogClose2}
          onConfirm={() => deleteFolders(folderName)}
          title="Delete Folder"
          onRequestClose={onDialogClose2}>
            <p> Are you sure you want to delete this folder? </p>            
        </ConfirmDialog>
          
      </div>
  )
}

export default Index