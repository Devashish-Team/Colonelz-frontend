import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Dialog, FormItem, Input, Notification, Pagination, Select, Upload, toast } from '@/components/ui';
import { AuthorityCheck, ConfirmDialog, RichTextEditor, StickyFooter } from '@/components/shared';
import CreatableSelect from 'react-select/creatable';
import { CiFileOn, CiImageOn } from 'react-icons/ci';
import { getTemplateData } from '../data';
import {  FileItem } from '../type';
import { apiDeleteFileManagerFiles, apiGetCrmFileManagerCreateTemplateFolder, apiGetCrmFileManagerShareFiles } from '@/services/CrmService';
import { HiShare, HiTrash } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import { Field, Form, Formik } from 'formik';


import { useMemo } from 'react'
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
import { AiOutlineDelete, AiOutlineFolder } from 'react-icons/ai'
import { useRoleContext } from '@/views/crm/Roles/RolesContext';
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
    }, [value])
    return (
      <div className="flex justify-end">
          <div className="flex items-center mb-4">
              <span className="mr-2"></span>
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
        itemValue = formateDate(itemValue);
    }

    const itemRank = rankItem(itemValue, value);
    addMeta({
        itemRank,
    });

    return itemRank.passed;
};

const Index = () => {
  const [leadData, setLeadData] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedEmailsCc, setSelectedEmailsCc] = useState<string[]>([]);
  const [selectedEmailsBcc, setSelectedEmailsBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const folderName = queryParams.get('folder');
  const type = queryParams.get('type');
  const subfolder = queryParams.get('subfolder');
  const folderId = queryParams.get('folder_id');
  const [shareLoading, setShareLoading] = useState(false);
  const { roleData } = useRoleContext();
  const uploadAccess = roleData?.data?.file?.create?.includes(`${localStorage.getItem('role')}`)
  
  const navigate=useNavigate()

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };

  const [dialogIsOpen, setIsOpen] = useState(false)
  const [dialogIsOpen2, setIsOpen2] = useState(false)
  const [dialogIsOpen3, setIsOpen3] = useState(false)
  const [fileId, setFileId] = useState<string>('')

  const openDialog = (fileId:string) => {
    setIsOpen(true)
    setSelectedFiles([fileId])
    console.log(fileId);
    
}

  const onDialogClose = () => {
      setIsOpen(false)
  }

  const onDialogClose2 = () => {
    setIsOpen2(false)
}
const openDialog2 = () => {
    setIsOpen2(true)
}

const openDialog3 = (file_id:string) => {
  setIsOpen3(true)
  setFileId(file_id)
}

const onDialogClose3 = () => {
  setIsOpen3(false)
}

  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        const templateData = await getTemplateData();
        console.log(templateData);
        const filteredFolders = templateData.filter((folder) => {
         if(folder.files[0]?.sub_folder_name_second){
          
          return (
            folder.files[0]?.folder_name === type &&
            folder.files[0]?.sub_folder_name_first === folderName &&
            folder.files[0]?.sub_folder_name_second === subfolder
          );}
        });

  
        if (filteredFolders.length > 0) {
          setLeadData(filteredFolders[0].files[0].files);
          
        } else {
          console.warn('No matching folder found.');
        }
  
        console.log(leadData);
        
      } catch (error) {
        console.error('Error fetching lead data', error);
      }
    };
  
    fetchDataAndLog();
  }, [type, folderName, subfolder]);

  const handleFileSelect = (fileId: string) => {
  
    const updatedSelectedFiles = selectedFiles.includes(fileId)
      ? selectedFiles.filter((id) => id !== fileId)
      : [...selectedFiles, fileId];
    setSelectedFiles(updatedSelectedFiles);

  };

  const deleteFiles = async (fileId:string) => {
    selectedFiles.push(fileId)
    function warn(text:string) {
      toast.push(
          <Notification closable type="warning" duration={2000}>
              {text}
          </Notification>,{placement:'top-center'}
      )
  }
    if (selectedFiles.length === 0) {
      warn('No files selected for deletion.')
      return;
    }
    
    const postData = {
      file_id: selectedFiles,
      folder_name: subfolder,
      type:'template',
    };
    try {
      const response=await apiDeleteFileManagerFiles(postData);
      const responseJson=await response.json()
      console.log(responseJson);
      
      if (response.ok) {
        toast.push(
          <Notification closable type="success" duration={2000}>
            Files deleted successfully
          </Notification>,{placement:'top-center'}
        )
        window.location.reload()
      }
      else{
        toast.push(
          <Notification closable type="danger" duration={2000}>
            {responseJson.errorMessage}
          </Notification>,{placement:'top-center'}
        )
      }
    
    } catch (error) {
      console.error('Error deleting files:', error);
    }
    
  }
  const handleShareFiles = async () => {

    if (selectedFiles.length === 0 || selectedEmails.length === 0) {
        warn('No files or email addresses selected for sharing.')
        return
    }
  setShareLoading(true)
    const postData = {
      folder_id:folderId,
        type:'template',
      file_id: selectedFiles,
      email: selectedEmails,
      cc: selectedEmailsCc,
      bcc: selectedEmailsBcc,
      subject: subject,
      body: body,
      user_id:localStorage.getItem('userId')
    };

     

      function warn(text: string) {
          toast.push(
              <Notification closable type="warning" duration={2000}>
                  {text}
              </Notification>,
              { placement: 'top-center' },
          )
      }



    
      const response = await apiGetCrmFileManagerShareFiles(postData);
      setShareLoading(false)
      if(response.code===200){
        toast.push(
          <Notification closable type="success" duration={2000}>
              Files shared successfully
          </Notification>,{placement:'top-center'}
      )
      }
      else{
        toast.push(
          <Notification closable type="danger" duration={2000}>
              {response.errorMessage}
          </Notification>,{placement:'top-center'}
      )
      }
      setSelectedFiles([]);
      setSelectedEmails([]);
      setSelectedEmailsCc([]);
      setSelectedEmailsBcc([]);
      setSubject('')
      setBody('')
      onDialogClose()
     
      
      const updatedLeadData = leadData.map((file) => ({ ...file, active: false }));
      setLeadData(updatedLeadData);
    
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico'];
    if (imageExtensions.includes(extension as string)) {
      return <CiImageOn className='text-xl' />;
    }
    switch (extension) {
      case 'docx':
        return <CiFileOn className='text-xl' />;
      case 'png':
        return <CiImageOn className='text-xl' />;
      case 'pptx':
        return <CiFileOn className='text-xl' />;
      default:
        return <CiFileOn className='text-xl' />;
    }
  };
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico'];
    const documentExtensions = ['docx', 'doc', 'txt', 'pdf'];
    const presentationExtensions = ['pptx', 'ppt'];
    const spreadsheetExtensions = ['xlsx', 'xls', 'csv'];
    const audioExtensions = ['mp3', 'wav', 'ogg'];
    const videoExtensions = ['mp4', 'avi', 'mov'];
  
    if (imageExtensions.includes(extension)) {
      return 'Image';
    } else if (documentExtensions.includes(extension)) {
      return 'Document';
    } else if (presentationExtensions.includes(extension)) {
      return 'Presentation';
    } else if (spreadsheetExtensions.includes(extension)) {
      return 'Spreadsheet';
    } else if (audioExtensions.includes(extension)) {
      return 'Audio';
    } else if (videoExtensions.includes(extension)) {
      return 'Video';
    } else {
      return 'File';
    }
  };

  function formatFileSize(fileSizeInKB: string | undefined): string {
    if (!fileSizeInKB) {
      return '-';
    }
  
    const size = Number(fileSizeInKB.split(' ')[0]);
    if (size < 1024) {
      return `${size.toFixed(2)} KB`;
    } else {
      return `${(size / 1024).toFixed(2)} MB`;
    }
  }



  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
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

  const columns = useMemo<ColumnDef<FileItem>[]>(
      () => [
          { header: 'Name', accessorKey: 'fileName', cell: ({row}) =>
            <div className="flex items-center gap-2">
          {getFileIcon(row.original.fileName)}
            <a className="font-medium cursor-pointer" href={row.original.fileUrl} target='_blank'>
              {row.original.fileName}
            </a>
          </div>} ,
          { header: 'type', accessorKey: 'type', cell:
            ({row})=>{
                return <div> {getFileType(row.original.fileName)}</div>
            }
           },
          { header: 'Size', accessorKey: 'fileSize' ,
            cell:({row})=>{
                return formatFileSize(row.original.fileSize)
            }
          },
          { header: 'modified', accessorKey: 'date',
            cell:({row})=>{
                return formateDate(row.original.date)
            }
           },
           {
            header:'Actions',
            accessorKey:'action',
            id:'actions',
            cell:({row})=>{
              const {roleData}=useRoleContext()
              const deleteAccess = roleData?.data?.file?.delete?.includes(`${localStorage.getItem('role')}`)
                return ( 
                  <div className=' flex justify-center gap-3'> 
                    
                    {deleteAccess &&
                  <AiOutlineDelete className='text-xl cursor-pointer hover:text-red-500' onClick={()=>openDialog3(row.original.fileId)} />
                    }
                    <HiShare className='text-xl cursor-pointer'  onClick={() => openDialog(row.original.fileId)}/>  
                    </div>
                    )
            }
           }
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

  return (
    <div>
        <div className='flex justify-between'>
      <h3 className='mb-5'>Company Data</h3>
      {uploadAccess &&
      <Button className='' size='sm' variant='solid' onClick={()=>openDialog2()}>
        Upload Files
      </Button>}
      
      </div>
      {leadData && leadData.length > 0 ? (
        
        <div className="h-screen w-full">
        <div className="flex-1 p-4">
          <div className='flex justify-between'>
        <div className="flex items-center mb-4">
    <nav className="flex">
      <ol className="flex items-center space-x-2">
      <li>
              <Link to={`/app/crm/fileManager`} className="text-blue-600 dark:text-blue-400 hover:underline">FileManager</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link to={`/app/crm/fileManager`} className="text-blue-600 dark:text-blue-400 hover:underline">Company Data</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            {type !== 'company data' && (
              <>
            <li>
              <Link to={`/app/crm/fileManager/project/templates/${type}`} className="text-blue-600 dark:text-blue-400 hover:underline capitalize">{type}</Link>
            </li>
          
          <li>
            <span className="mx-2">/</span>
          </li></>)}
        <li>
          <Link to={`/app/crm/fileManager/project/templates/${type==="company data"?"miscellaneous":`${type}`}/subfolder?type=${type}&folder=${folderName}`} className="text-blue-600 dark:text-blue-400 hover:underline capitalize">{folderName}</Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
      
        <li className="text-gray-500">{subfolder}</li>
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
          <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={leadData.length}
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
        </div>
      </div>
         ) : (
          <p>No files</p>
        )}
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
            navigate(`/app/crm/fileManager/project/templates/${type==="company data"?"miscellaneous":`${type}`}/subfolder?type=${type}&folder=${folderName}`)
            }}
          >
            Back
          </Button>
          
        </div>
      </StickyFooter>
      <Dialog
                isOpen={dialogIsOpen}
                style={{}}
                className='max-h-[300px]'
                onClose={onDialogClose} 
                onRequestClose={onDialogClose}

            >
              <h3 className='mb-5'>Share Files</h3>
              <Formik initialValues={{ lead_id:'', folder_name: folderName, file_id: '', email: '', cc: '', bcc: '', subject: '', body: '' }}
              onSubmit={async(values) =>
                 {
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

            <Dialog  isOpen={dialogIsOpen2}
                className='max-h-[300px]'
                onClose={onDialogClose2} 
                onRequestClose={onDialogClose2}>
                    <h3 className=''>Upload Files</h3>
                    <Formik
                    initialValues={{
                      type:"template",
                      folder_name:type,
                      sub_folder_name_first:folderName,
                      sub_folder_name_second:subfolder,
                      files:[]}}
                    onSubmit={async(values,{setSubmitting}) => {
                      if(values.files.length===0){
                        toast.push(
                          <Notification closable type="warning" duration={2000}>
                              No files selected for upload
                          </Notification>,{placement:'top-center'}
                      )}
                      else{
                        console.log(values);
                        setSubmitting(true)
                        let formData = new FormData();
                        formData.append('type', values.type || '');
                        formData.append('folder_name', values.folder_name || '');
                        formData.append('sub_folder_name_first', values.sub_folder_name_first || '');
                        formData.append('sub_folder_name_second', values.sub_folder_name_second || '');
                        for (let i = 0; i < values.files.length; i++) {
                          formData.append('files', values.files[i]);
                        }
                        const response=await apiGetCrmFileManagerCreateTemplateFolder(formData)
                        const responseData=await response.json()
                        setSubmitting(false)
                        console.log(responseData);
                        
                        if(responseData.code===200){
                          toast.push(
                            <Notification closable type="success" duration={2000}>
                                Files uploaded successfully
                            </Notification>,{placement:'top-center'}
                        )
                        window.location.reload()
                      }
                    else{
                      toast.push(
                        <Notification closable type="danger" duration={2000}>
                            {responseData.errorMessage}
                        </Notification>,{placement:'top-center'}
                    )
                    }}
                    }}
                    >
                      {({ isSubmitting }) => (
                      <Form className='mt-4'>
                        <FormItem label=''>
                          <Field name='files'>
                            {({ field, form }: any) => (
                              <Upload
                              draggable
                                onChange={(files: File[], fileList: File[]) => {
                                  form.setFieldValue('files', files);
                                }}
                                multiple
                              />
                            )}
                          </Field>
                        </FormItem>
                        <Button variant='solid' type='submit' block loading={isSubmitting} >
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
          onRequestClose={onDialogClose3}>
            <p> Are you sure you want to delete this file? </p>            
        </ConfirmDialog>
    </div>
  );
};

export default Index;
