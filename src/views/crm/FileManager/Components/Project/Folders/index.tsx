import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileItem, fetchProjectData } from '../data'
import {
    Button,
    Checkbox,
    Dialog,
    FormItem,
    Input,
    Notification,
    Pagination,
    Segment,
    Select,
    Skeleton,
    Upload,
    toast,
} from '@/components/ui'
import { AuthorityCheck, ConfirmDialog, RichTextEditor, StickyFooter } from '@/components/shared'
import CreatableSelect from 'react-select/creatable'
import { CiFileOn, CiImageOn } from 'react-icons/ci'
import {
    apiDeleteFileManagerFiles,
    apiGetAllUsersList,
    apiGetCrmFileManagerCreateProjectFolder,
    apiGetCrmFileManagerShareFiles,
    apiGetCrmProjectShareQuotation,
} from '@/services/CrmService'
import { apiGetUsers } from '@/services/CommonService'
import { HiShare, HiTrash } from 'react-icons/hi'
import { FolderItem } from '../../type'
import { format, parseISO } from 'date-fns'
import { Field, Form, Formik } from 'formik'
import NoData from '@/views/pages/NoData'
import { AiOutlineDelete } from 'react-icons/ai'

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
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { FaFile } from 'react-icons/fa';
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton';
import { MdDeleteOutline } from 'react-icons/md';
import { useRoleContext } from '@/views/crm/Roles/RolesContext'
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

    
    if (columnId === 'date') {
        itemValue = formateDate(itemValue)
    }

    const itemRank = rankItem(itemValue, value);
    addMeta({
        itemRank,
    });

    return itemRank.passed;
};

const Index = () => {
    const [leadData, setLeadData] = useState<FileItem[]>([])
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [selectedEmails, setSelectedEmails] = useState<string[]>([])
    const [selectedEmailsCc, setSelectedEmailsCc] = useState<string[]>([])
    const [selectedEmailsBcc, setSelectedEmailsBcc] = useState<string[]>([])
    const [selectedType, setSelectedType] = useState('Internal')
    const [selectedUsername, setSelectedUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [clientNameError, setClientNameError] = useState('')
    const [clientEmailError, setClientEmailError] = useState('')
    const [approvalLoading, setApprovalLoading] = useState(false)
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const leadId = queryParams.get('project_id')
    const ProjectName = queryParams.get('project_name')
    const folderName = queryParams.get('folder_name') // Assuming folder_name is in the query params
    const navigate = useNavigate()
    const [usernames, setUsernames] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [shareLoading, setShareLoading] = useState(false)
    const [selectedFileId, setSelectedFileId] = React.useState<string | null>(
        null,
    )
    const {roleData} = useRoleContext()
    const uploadAccess = roleData?.data?.file?.create?.includes(`${localStorage.getItem('role')}`)

    interface User {
        role: string
        username: string
    }
    
type Option = {
    value: number
    label: string
  }

    useEffect(() => {
        const response = async () => {
            const data = await apiGetAllUsersList()
            const userdata = data.data
            console.log(userdata)

            const usernames = userdata
                .filter((user: User) => (user.role === 'Senior Architect') || (user.role === 'ADMIN'))
                .map((user: User) => user.username)
            if (usernames) {
                console.log(usernames)

                setUsernames(usernames)
            }
        }
        response()
    }, [])

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(e.target.value)
    }

    const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBody(e.target.value)
    }

    const [dialogIsOpen, setIsOpen] = useState(false)
    const [dialogIsOpen1, setIsOpen1] = useState(false)
    const [dialogIsOpen2, setIsOpen2] = useState(false)
    const [dialogIsOpen3, setIsOpen3] = useState(false)
    const [fileId, setFileId] = useState<string>('')


    const openDialog = (fileId: string) => {
        setIsOpen(true)
        setSelectedFiles([fileId])
        console.log(fileId)
    }
    const onDialogClose = () => {
        setIsOpen(false)
    }
    const openDialog1 = () => {
        setIsOpen1(true)
    }
    const onDialogClose1 = () => {
        setIsOpen1(false)
    }
    const openDialog2 = () => {
        setIsOpen2(true)
    }
    const onDialogClose2 = () => {
        setIsOpen2(false)
    }

    const openDialog3 = (file_id: string) => {
        setIsOpen3(true)
        setFileId(file_id)
    }

    const onDialogClose3 = () => {
        setIsOpen3(false)
    }

    useEffect(() => {
        const fetchDataAndLog = async () => {
            try {
                const leadData = await fetchProjectData(leadId)
                console.log(leadData)

                  setLoading(false)
                const folderData = leadData
                console.log(folderData)

                const selectedFolder = folderData.find(
                    (folder: any) => folder.folder_name === folderName,
                )

                if (selectedFolder) {
                    setLeadData(selectedFolder.files)
                    console.log(selectedFolder.files)
                }
            } catch (error) {
                console.error('Error fetching lead data', error)
            }
        }

        fetchDataAndLog()
    }, [leadId, folderName])
    console.log(leadData)

    const deleteFiles = async (fileId: string) => {
        selectedFiles.push(fileId)
        function warn(text: string) {
            toast.push(
                <Notification closable type="warning" duration={2000}>
                    {text}
                </Notification>,
                { placement: 'top-center' },
            )
        }
        if (selectedFiles.length === 0) {
            warn('No files selected for deletion.')
            return
        }

        const postData = {
            file_id: selectedFiles,
            folder_name: folderName,
            project_id: leadId,
        }
        try {
            const response = await apiDeleteFileManagerFiles(postData)
            const responseJson = await response.json()
            console.log(responseJson)

            if (response.ok) {
                toast.push(
                    <Notification closable type="success" duration={2000}>
                        Files deleted successfully
                    </Notification>,
                    { placement: 'top-center' },
                )
                window.location.reload()
            } else {
                toast.push(
                    <Notification closable type="danger" duration={2000}>
                        {responseJson.errorMessage}
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        } catch (error) {
            console.error('Error deleting files:', error)
        }
    }

    const handleFileChange = (selectedFileId: string) => {
        setSelectedFileId(selectedFileId)
    }

    const handleShareFileForApproval = async () => {
       
        if (selectedFileId === null) {
            toast.push(
                <Notification closable type="warning" duration={2000}>
                    Please select a file to share
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setApprovalLoading(true)

        const postData = {
            user_name: selectedUsername,
            type: 'Internal',
            file_id: selectedFileId,
            folder_name: folderName,
            project_id: leadId,
            user_id: localStorage.getItem('userId'),
        }

        const response = await apiGetCrmProjectShareQuotation(postData)
        const responseJson = await response.json()
        setApprovalLoading(false)
        if (responseJson.code === 200) {
            toast.push(
                <Notification closable type="success" duration={2000}>
                    File shared successfully
                </Notification>,
                { placement: 'top-center' },
            )
            setIsOpen1(false)
        } else {
            toast.push(
                <Notification closable type="danger" duration={2000}>
                    {responseJson.errorMessage}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }
    const handleShareFiles = async () => {
        if (selectedFiles.length === 0 || selectedEmails.length === 0) {
            warn('No files or email addresses selected for sharing.')
            return
        }
        setShareLoading(true)

        const postData = {
            file_id: selectedFiles,
            lead_id: '',
            project_id: leadId,
            email: selectedEmails,
            cc: selectedEmailsCc,
            bcc: selectedEmailsBcc,
            subject: subject,
            body: body,
            user_id: localStorage.getItem('userId'),
        }

        

        function warn(text: string) {
            toast.push(
                <Notification closable type="warning" duration={2000}>
                    {text}
                </Notification>,
                { placement: 'top-center' },
            )
        }

        
            const response = await apiGetCrmFileManagerShareFiles(postData)
            setShareLoading(false)
            if(response.code===200){
                toast.push(
                    <Notification closable type="success" duration={2000}>
                        Files shared successfully
                    </Notification>,
                    { placement: 'top-center' },
                )}
                else{
                    toast.push(
                        <Notification closable type="danger" duration={2000}>
                            {response.errorMessage}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                }

            setSelectedFiles([])
            setSelectedEmails([])
            setSubject('')
            setBody('')
            onDialogClose()
            const updatedLeadData = leadData.map((file) => ({
                ...file,
                active: false,
            }))
            setLeadData(updatedLeadData)
        
    }
    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()
        const imageExtensions = [
            'png',
            'jpg',
            'jpeg',
            'gif',
            'bmp',
            'tiff',
            'ico',
        ]
        if (imageExtensions.includes(extension as string)) {
            return <CiImageOn className="text-xl" />
        }
        switch (extension) {
            case 'docx':
                return <CiFileOn className="text-xl" />
            case 'png':
                return <CiImageOn className="text-xl" />
            case 'pptx':
                return <CiFileOn className="text-xl" />
            default:
                return <CiFileOn className="text-xl" />
        }
    }
    const getFileType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase() || ''
        const imageExtensions = [
            'png',
            'jpg',
            'jpeg',
            'gif',
            'bmp',
            'tiff',
            'ico',
        ]
        const documentExtensions = ['docx', 'doc', 'txt', 'pdf']
        const presentationExtensions = ['pptx', 'ppt']
        const spreadsheetExtensions = ['xlsx', 'xls', 'csv']
        const audioExtensions = ['mp3', 'wav', 'ogg']
        const videoExtensions = ['mp4', 'avi', 'mov']

        if (imageExtensions.includes(extension)) {
            return 'Image'
        } else if (documentExtensions.includes(extension)) {
            return 'Document'
        } else if (presentationExtensions.includes(extension)) {
            return 'Presentation'
        } else if (spreadsheetExtensions.includes(extension)) {
            return 'Spreadsheet'
        } else if (audioExtensions.includes(extension)) {
            return 'Audio'
        } else if (videoExtensions.includes(extension)) {
            return 'Video'
        } else {
            return 'File'
        }
    }

    function formatFileSize(fileSizeInKB: string | undefined): string {
        if (!fileSizeInKB) {
            return '-'
        }

        const size = Number(fileSizeInKB.split(' ')[0])
        if (size < 1024) {
            return `${size.toFixed(2)} KB`
        } else {
            return `${(size / 1024).toFixed(2)} MB`
        }
    }

    

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [globalFilter, setGlobalFilter] = useState('')
const totalData = leadData.length

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const columns = useMemo<ColumnDef<FileItem>[]>(
    () => [
        { header: 'Name', accessorKey: 'fileName',
          cell:({row})=>{
              const file=row.original
              const fileName=file.fileName
              const fileurl=file.fileUrl
              return <Link to={fileurl} target='_blank'><div className='flex items-center gap-2'>{getFileIcon(row.original.fileName)}{fileName}</div></Link>
          }
         },

        { header: 'Type',cell:({row})=>{
         return <div>{getFileType(row.original.fileName)}</div>
        } },


        { header: 'Size', accessorKey: 'fileSize',
          cell:({row})=>{
            return <div>{formatFileSize(row.original.fileSize)}</div>
          }
         },


        { header: 'Created', accessorKey: 'date',cell:({row})=>{
          return <div>{formateDate(row.original.date)}</div>
        } },
        { header: 'Actions', accessorKey: 'actions',
        cell:({row})=>{
            const {roleData}=useRoleContext()
            const deleteAccess = roleData?.data?.file?.delete?.includes(`${localStorage.getItem('role')}`)
          return <div className='flex items-center gap-2'>
            {deleteAccess &&
              <MdDeleteOutline className='text-xl cursor-pointer hover:text-red-500' onClick={()=>openDialog3(row.original.fileId)} />}
                  <HiShare className='text-xl cursor-pointer'  onClick={() => openDialog(row.original.fileId)}/> 
          </div>
        }
         },
    ],
    []
)

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

   const role=localStorage.getItem('role');

    return (
        <div>
            <div className="flex justify-between">
                <h3 className="mb-5 capitalize">Project-{ProjectName}</h3>
                {uploadAccess &&
                <Button
                    className=""
                    size="sm"
                    variant="solid"
                    onClick={() => openDialog2()}
                >
                    Upload Files
                </Button>}
            </div>
        
             
             
                <div className="w-full">
                    <div className="flex-1 p-4">
                        <div className='flex justify-between'>
                        <div className="flex items-center mb-4">
                            <nav className="flex">
                                <ol className="flex items-center space-x-2">
                                    <li>
                                        <Link
                                            to={`/app/crm/fileManager`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            FileManager
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="mx-2">/</span>
                                    </li>
                                    <li>
                                        <Link
                                            to={`/app/crm/fileManager`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Projects
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="mx-2">/</span>
                                    </li>
                                    <li>
                                        <Link
                                            to={`/app/crm/fileManager/project?project_id=${leadId}&project_name=${ProjectName}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {ProjectName}
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="mx-2">/</span>
                                    </li>

                                    <li className="text-gray-500">
                                        {folderName}
                                    </li>
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
                                        {header.isPlaceholder || header.id==='actions' ? null : (
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
                {loading?<TableRowSkeleton
                      avatarInColumns= {[0]}
                      columns={columns.length}
                      avatarProps={{ width: 14, height: 14 }}
                  />:leadData.length===0?<Td colSpan={columns.length}><NoData/></Td>:
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
                    </div>
                </div>
            
            
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
                            navigate(
                                `/app/crm/fileManager/project?project_id=${leadId}&project_name=${ProjectName}`,
                            )
                        }}
                    >
                        Back
                    </Button>
                    {(folderName?.toUpperCase() === 'QUOTATION' ) ? (
                        <Button
                            size="sm"
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="solid"
                            onClick={() => openDialog1()}
                        >
                            Share for Approval
                        </Button>
                    ) : null}
                </div>
            </StickyFooter>

            {/* Sharefiles Dialogbox */}
            <Dialog
                isOpen={dialogIsOpen}
                style={{}}
                className="max-h-[300px]"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h3 className="mb-5">Share Files</h3>
                <Formik initialValues={{ lead_id: leadId, folder_name: folderName, file_id: '', email: '', cc: '', bcc: '', subject: '', body: '' }}
              onSubmit={async(values) => {
                console.log(values);
                
              }

              }>
    <div className='max-h-96 overflow-y-auto'>
             <FormItem label='To'>
              <Field>
                {({ field, form }: any) => (
          <Select
          className='mt-1'
    isMulti
    value={selectedEmails.map((email) => ({ label: email, value: email }))}
    componentAs={CreatableSelect}
    placeholder="Add email addresses..."
    onChange={(newValues) => {
      const emails = newValues ? newValues.map((option) => option.value) : [];
      setSelectedEmails(emails);
    }}
    onCreateOption={(inputValue) => {
      const newEmails = [...selectedEmails, inputValue];
      setSelectedEmails(newEmails);
    }}
  />)}
  </Field></FormItem>
    
  <FormItem label='Cc'>
              <Field>
                {({ field, form }: any) => (
          <Select
          className='mt-1'
    isMulti
    value={selectedEmailsCc.map((email) => ({ label: email, value: email }))}
    componentAs={CreatableSelect}
    placeholder="Add email addresses..."
    onChange={(newValues) => {
      const emails = newValues ? newValues.map((option) => option.value) : [];
      setSelectedEmailsCc(emails);
    }}
    onCreateOption={(inputValue) => {
      const newEmails = [...selectedEmailsCc, inputValue];
      setSelectedEmailsCc(newEmails);
    }}
  />)}
  </Field></FormItem>
    
  <FormItem label='Bcc'>
              <Field>
                {({ field, form }: any) => (
          <Select
          className='mt-1'
    isMulti
    value={selectedEmailsBcc.map((email) => ({ label: email, value: email }))}
    componentAs={CreatableSelect}
    placeholder="Add email addresses..."
    onChange={(newValues) => {
      const emails = newValues ? newValues.map((option) => option.value) : [];
      setSelectedEmailsBcc(emails);
    }}
    onCreateOption={(inputValue) => {
      const newEmails = [...selectedEmailsBcc, inputValue];
      setSelectedEmailsBcc(newEmails);
    }}
  />
)}
  </Field></FormItem>


<div className=''>
<FormItem label='Subject'>
              <Field>
                {({ field, form }: any) => (
          <Input
          required
            type='text'
            className='mt-1 p-2 w-full border rounded-md'
            value={subject}
            placeholder='Enter subject...'
            onChange={handleSubjectChange}
          />
        )}
  </Field></FormItem>
        </div>
        <div className=''>
          <FormItem label='Body'>
              <Field>
                {({ field, form }: any) => (
             <RichTextEditor value={body} onChange={setBody} />
        )}
        </Field></FormItem>
        </div>
  
         <div className='flex justify-end'>
         <Button size="sm" variant="solid" type="submit" className='mt-5 ' onClick={handleShareFiles} loading={shareLoading} block>
            {shareLoading ? 'Sharing...' : 'Share'}
          </Button>
          </div>
          </div>
          </Formik>
               
            </Dialog>

            {/* ShareFiles For Approval */}
            <Dialog
                isOpen={dialogIsOpen1}
                style={{}}
                className="max-h-[300px]"
                onClose={onDialogClose1}
                onRequestClose={onDialogClose1}
            >
                <h3 className="mb-5">Share Files For Approval</h3>
                <div className=" ">
                    <FormItem label="Username" className="mt-4">
                        <Select
                            componentAs={CreatableSelect}
                            options={usernames.map((username) => ({
                                label: username,
                                value: username,
                            }))}
                            value={
                                selectedUsername
                                    ? {
                                          label: selectedUsername,
                                          value: selectedUsername,
                                      }
                                    : null
                            }
                            placeholder="Add a username..."
                            onChange={(newValue) => {
                                const username = newValue ? newValue.value : ''
                                setSelectedUsername(username)
                                if (
                                    selectedType === 'Internal' &&
                                    username === ''
                                ) {
                                    setUsernameError(
                                        'Username is mandatory for internal type',
                                    )
                                } else {
                                    setUsernameError('')
                                }
                            }}
                            onCreateOption={(inputValue) => {
                                const newUsernames = [...usernames, inputValue]
                                setUsernames(newUsernames)
                                setSelectedUsername(inputValue)
                            }}
                        />
                    </FormItem>
                    {usernameError && (
                        <div className=" text-red-600">{usernameError}</div>
                    )}
                    {clientEmailError && (
                        <div className=" text-red-600">{clientEmailError}</div>
                    )}
                    <FormItem label="File" className="">
                        <Select
                            className=""
                            options={leadData.map((file) => ({
                                value: file.fileId,
                                label: file.fileName,
                            }))}
                            onChange={(option: any) =>
                                handleFileChange(option ? option.value : '')
                            }
                            value={
                                leadData.find(
                                    (file) => file.fileId === selectedFileId,
                                )
                                    ? {
                                          value: selectedFileId,
                                          label: selectedFileId,
                                      }
                                    : null
                            }
                        />
                    </FormItem>
                </div>

                <div className="flex justify-end">
                    <Button
                        size="sm"
                        variant="solid"
                        type="submit"
                        className="mt-5 "
                        block
                        loading={approvalLoading}

                        onClick={handleShareFileForApproval}
                    >
                        {approvalLoading? 'Sharing...':'Share'}
                    </Button>
                </div>
            </Dialog>

            {/* UploadFiles */}

            <Dialog
                isOpen={dialogIsOpen2}
                onClose={onDialogClose2}
                onRequestClose={onDialogClose2}
            >
                <h3>Upload Files</h3>
                <Formik
                    initialValues={{
                        project_id: leadId,
                        folder_name: folderName,
                        files: [],
                    }}
                    onSubmit={async (values,{setSubmitting}) => {
                        if (values.files.length === 0) {
                            toast.push(
                                <Notification
                                    closable
                                    type="warning"
                                    duration={2000}
                                >
                                    No files selected for upload
                                </Notification>,
                                { placement: 'top-center' },
                            )
                        } else {
                            console.log(values)
                            let formData = new FormData()
                            formData.append(
                                'project_id',
                                values.project_id || '',
                            )
                            formData.append(
                                'folder_name',
                                values.folder_name || '',
                            )
                            for (let i = 0; i < values.files.length; i++) {
                                formData.append('files', values.files[i])
                            }
                            const response =
                                await apiGetCrmFileManagerCreateProjectFolder(
                                    formData,
                                )
                            const responseData = await response.json()
                            console.log(responseData)

                            if (responseData.code === 200) {
                                toast.push(
                                    <Notification
                                        closable
                                        type="success"
                                        duration={2000}
                                    >
                                        Files uploaded successfully
                                    </Notification>,
                                    { placement: 'top-center' },
                                )
                                window.location.reload()
                            } else {
                                toast.push(
                                    <Notification
                                        closable
                                        type="danger"
                                        duration={2000}
                                    >
                                        {responseData.errorMessage}
                                    </Notification>,
                                    { placement: 'top-center' },
                                )
                            }
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                    <Form
                        className=" overflow-y-auto max-h-[400px] mt-4"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        <FormItem label="Files" className="mt-4">
                            <Field name="files">
                                {({ field, form }: any) => (
                                    <Upload
                                    draggable
                                    multiple
                                        onChange={(
                                            files: File[],
                                            fileList: File[],
                                        ) => {
                                            form.setFieldValue('files', files)
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <Button variant="solid" type="submit" loading={isSubmitting} block>
                            {isSubmitting ? 'Uploading...' : 'Upload'}
                        </Button>
                    </Form>)}
                </Formik>
            </Dialog>

            <ConfirmDialog
                isOpen={dialogIsOpen3}
                type="danger"
                onClose={onDialogClose3}
                confirmButtonColor="red-600"
                onCancel={onDialogClose3}
                onConfirm={() => deleteFiles(fileId)}
                title="Delete Folder"
                onRequestClose={onDialogClose3}
            >
                <p> Are you sure you want to delete this file? </p>
            </ConfirmDialog>
        </div>
    )
}

export default Index
