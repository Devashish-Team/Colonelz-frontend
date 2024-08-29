import React, { useContext, useEffect, useState } from 'react';
import { FolderItem, fetchProjectData } from './data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, Notification, Pagination, Select, Skeleton, toast } from '@/components/ui';
import type { MouseEvent } from 'react';
import YourFormComponent from './ProjectForm';
import { FaFolder } from 'react-icons/fa';
import { AuthorityCheck, ConfirmDialog, StickyFooter } from '@/components/shared';
import { HiTrash } from 'react-icons/hi';
import { apiDeleteFileManagerFolders } from '@/services/CrmService';
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
import NoData from '@/views/pages/NoData';
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { RoleContext, useRoleContext } from '@/views/crm/Roles/RolesContext';
import formateDate from '@/store/dateformate';

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table
type Option={
  value:number;
  label:string;
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
  const [projectData, setProjectData] = useState<FolderItem[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('project_id');
  const projectName = queryParams.get('project_name');
  const role=localStorage.getItem('role')
  
const {roleData} = useContext(RoleContext);
const uploadAccess = roleData?.data?.file?.create?.includes(`${localStorage.getItem('role')}`)

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [dialogIsOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = (e: MouseEvent) => {
    console.log('onDialogClose', e);
    setIsOpen(false);
  };

const [dialogIsOpen2, setIsOpen2] = useState(false)
const [folderName, setFolderName] = useState<string>('')

const openDialog2 = (folder_name:string) => {
    setIsOpen2(true)
    setFolderName(folder_name)
}

const onDialogClose2 = () => {
    setIsOpen2(false)
}


  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        setIsLoading(true);
        const projectData = await fetchProjectData(projectId);
        console.log(projectData);
        setProjectData(projectData);
      } catch (error) {
        console.error('Error fetching lead data', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDataAndLog();
  }, [projectId]);




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
    lead_id:"",
    folder_name: folder_name,
    type:"",
    project_id:projectId
  };
  try {
    await apiDeleteFileManagerFolders(postData);
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
                              `/app/crm/fileManager/project/folder?project_id=${projectId}&project_name=${projectName}&folder_name=${row.original.folder_name}`,
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
                  <MdOutlineDelete className=' text-xl text-center hover:text-red-500'/>
                  </div>
                  </AuthorityCheck>
                )
            }
        },
    ],
    []
)

const totalData = projectData.length

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



// const filteredProjectData = useMemo(() => {
//   const role=localStorage.getItem('role')
//   console.log(roleData,role);
  
//   if (!roleData?.data?.quotation?.read?.includes(`${role}`)) {
//     return projectData.filter(item => 
//       item.folder_name.toLowerCase() !== 'quotation' && 
//       item.folder_name.toLowerCase() !== 'procurement data'
//     );
//   }
//   else if (!roleData?.data?.contract?.read?.includes(`${role}`)) {
//     return projectData.filter(item => 
//       item.folder_name.toLowerCase() !== 'contract'
//     );
//   }
//   return projectData;
// }, [projectData, role]);

const table = useReactTable({
    data:projectData,
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
          <div className=" mb-5 flex justify-between">
              <h3 className=" capitalize">Project-{projectName}</h3>
              
             {uploadAccess && <Button variant="solid" size="sm" onClick={() => openDialog()}>
                  Upload
              </Button>}
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
      <li className="text-gray-500">Projects</li>
    
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
                {isLoading?<TableRowSkeleton
                      avatarInColumns= {[0]}
                      columns={columns.length}
                      avatarProps={{ width: 14, height: 14 }}
                  />:projectData.length === 0?<Td colSpan={columns.length}><NoData/></Td>:
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
              className={`h-300px`}
          >
              <YourFormComponent data={projectData} />
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
};

export default Index;
