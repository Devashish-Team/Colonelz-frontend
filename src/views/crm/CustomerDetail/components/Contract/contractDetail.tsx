
import { useRef, useEffect, useMemo, useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import Checkbox from '@/components/ui/Checkbox'
import type { ChangeEvent } from 'react'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import type { ColumnDef } from '@tanstack/react-table'
import { Button, Dialog, FormItem, Input, Notification, Select, Upload, toast } from '@/components/ui'
import Pagination from '@/components/ui/Pagination'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { apiGetCrmFileManagerShareContractFile, apiGetCrmProjectShareContractApproval, apiGetCrmProjectShareQuotation, apiGetCrmProjectShareQuotationApproval } from '@/services/CrmService'
import { use } from 'i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRoleContext } from '@/views/crm/Roles/RolesContext'

type FormData = {
  user_name: string;
  file_id: string;
  folder_name: string;
  project_id: string;
  client_name: string;
  client_email: string;
  type: string;
};



type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void;
    indeterminate: boolean;
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void;
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void;
}

const { Tr, Th, Td, THead, TBody } = Table

export type FileItemProps = {
    data:FileItem[]
}
type FileItem = {
   admin_status:string,
   client_status:string,   
   file_name:string,
   files:Files[],
   itemId:string,
   remark:string
}
type Files = {
    fileUrl:string,
}



function IndeterminateCheckbox({
    indeterminate,
    onChange,
    ...rest
}: IndeterminateCheckboxProps) {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />
}


const ContractDetails=(data : FileItemProps )=> {
    const [rowSelection, setRowSelection] = useState({})
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]); 
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [remark, setRemark] = useState("");
    const location=useLocation()
    const queryParams=new URLSearchParams(location.search)
    const leadId=queryParams.get('id')
    const [approvalLoading,setApprovalLoading]=useState(false)
    const {roleData}=useRoleContext()
    
    

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
    
        setIsOpen(false)
    }

    const Approval=async(fileID:string,status:string)=>{
        setApprovalLoading(true);
        const postData = {
            lead_id:leadId ,
            file_id: fileID,
            status: status,
            remark: remark,
          };
        try{
            const response=await apiGetCrmProjectShareContractApproval(postData);
            const responseData=await response.json();
            setApprovalLoading(false);
            if(response.status===200){
                toast.push(
                    <Notification closable type='success' duration={2000}>
                        {responseData.message}
                    </Notification>
                )
                window.location.reload();
            }
        }
        catch(error){
            setApprovalLoading(false);
            toast.push(
                <Notification closable type='danger' duration={2000}>
                    Internal Server Error
                </Notification>
            )
        }
    }
    
    const role = localStorage.getItem('role');
    const columns =
        useMemo <ColumnDef <FileItem >[] >
        (() => {
            return [
                {
                    header: 'File Name',
                    accessorKey: 'fileName',
                    cell:({row})=>{
                        const fileName=row.original.file_name;
                        return(
                            <a href={`${row.original.files[0].fileUrl}`} className=' cursor-pointer' target='_blank'>
                        <div>{fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}</div></a>)
                    }
                },
               
               {
                    header: 'Admin Status',
                    accessorKey: 'itemId',
                    cell:({row})=>{
                        const fileId=row.original.itemId;
                        const status=row.original.admin_status;
                        const [dialogIsOpen, setIsOpen] = useState(false)
                       

                        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                            setRemark(event.target.value);
                        };

                        const openDialog1 = (fileId:string) => {
                            setIsOpen(true)
                        }
                    
                        const onDialogClose1 = () => {
                            setIsOpen(false)
                        }
                    
                        return(
                            status==='approved'?(
                                <div>Approved</div>
                            ):status==='rejected'?(
                                <div>Rejected</div>
                            ):status==='pending'?
                            (
                                !roleData.data.contract?.update?.includes(`${role}`) ? (
                                    <div>Pending</div>
                                ) : (
                                    <div className='flex gap-1'>
                                        <Button variant='solid' size='sm' onClick={()=>Approval(fileId,'approved')}>{approvalLoading?"Approving...":'Approve'}</Button>
                                        <Button variant='solid' color='red-600' size='sm' onClick={()=>openDialog1(fileId)}>Reject</Button>
                                        <Dialog
                                            isOpen={dialogIsOpen}
                                            onClose={onDialogClose1}
                                            onRequestClose={onDialogClose1}
                                        >
                                            <h3 className='mb-4'> Reject Remarks</h3>
                                            <Formik
                                                initialValues={{ lead_id:leadId , file_id: fileId, status: 'rejected', remark: '' }}
                                                validationSchema={Yup.object({ remark: Yup.string().required('Required') })}
                                                onSubmit={async (values, { setSubmitting }) => {
                                                    setSubmitting(true);
                                                    const response = await apiGetCrmProjectShareContractApproval(values);
                                                    const responseData=await response.json();
                                                    setSubmitting(false);
                                                    if(response.status===200){
                                                        toast.push(
                                                            <Notification closable type='success' duration={2000}>
                                                                {responseData.message}
                                                            </Notification>
                                                        )
                                                        window.location.reload();
                                                    }
                                                    else{
                                                        toast.push(
                                                            <Notification closable type='danger' duration={2000}>
                                                                {responseData.errorMessage}
                                                            </Notification>
                                                        )
                                                    }
                                                    
                                                    setSubmitting(false);
                                                }}
                                            >
                                                {({ handleSubmit,isSubmitting }) => (
                                                <Form>
                                                    <FormItem label="Remark">
                                                        <Field name="remark"    >
                                                            {({ field, form }: any) => (
                                                                <Input
                                                                    textArea
                                                                    {...field}
                                                                    onChange={ 
                                                                        (e: React.ChangeEvent<HTMLInputElement>) => {
                                                                            handleInputChange(e);
                                                                            form.setFieldValue(field.name, e.target.value);
                                                                        }
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                    <div className='flex justify-end'>
                                                        <Button type="submit" variant='solid' loading={isSubmitting}>{isSubmitting?'Submitting':'Submit'}</Button>
                                                    </div>
                                                </Form>)}
                                            </Formik>
                                        </Dialog>
                                    </div>
                                )
                            ):(
                                <div>Not Sent</div>
                            )
                        )
                    }
               }
                ,
                ...(role !== 'designer' ? [{
                header: 'Remark',
                accessorKey: 'remark',
                cell:({row}:any)=>{
                    const Remark=row.original.remark;
                    const admin_status=row.original.admin_status;
                    const [dialogIsOpen, setIsOpen] = useState(false)

                    const openDialog = () => {
                        setIsOpen(true)
                    }
                
                    const onDialogClose = () => {
                        setIsOpen(false)
                    }
                
                    const onDialogOk = (e: MouseEvent) => {
                        console.log('onDialogOk', e)
                        setIsOpen(false)
                    }
                    return(<> 
                    {admin_status==='rejected' &&        
                      <div><Button size='sm' variant='solid' onClick={()=>openDialog()}>Remark</Button></div>}
                      <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
         <h3 className='mb-4'>Remarks</h3>
         <p style={{overflowWrap:"break-word"}}>{Remark}</p>
                      </Dialog>
                      </>

                    )
              }
            }] : [])
            ]
        },
        [])

    const table = useReactTable({
        data:data?.data || [],
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: true, 
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })
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
  console.log(data.data);
  
    interface FormValues {
        client_name: string;
        email: string;
        file_id: string;
        type:string
        lead_id:string 
        folder_name:string
        project_name:string
        site_location:string
        quotation:File[]
        user_id:string

    }
    type Option = {
        value: number
        label: string
    }
    
    interface SelectFieldProps {
        options: Option[];
        field: any;
        form: any;
    }
    const handleShareFileForApproval = async () => {
        if(selectedFileIds.length===0){
          toast.push(
            <Notification closable type="warning" duration={2000}>
              Please select a file to share
            </Notification>,{placement:'top-center'}
          )
          return;
        }
      
    
        const postData = {
          type: 'Internal',
          file_id: selectedFileIds[0], 
          folder_name: 'quotation',
          lead_id: leadId,
        };
        try{
          const response=await apiGetCrmProjectShareQuotation(postData);
          const responseJson=await response.json()
          if (response.ok) {
            toast.push(
              <Notification closable type="success" duration={2000}>
                File shared successfully
              </Notification>,{placement:'top-center'}
            )
          }
        }
        catch(error){
          console.error('Error sharing files:', error);
        }
     }

     const SelectField: React.FC<any> = ({ options, field, form }) => (
        <Select
            options={options}
            name={field.name}
            value={options ? options.find((option:any) => option.value === field.value) : ''}
            onChange={(option) => form.setFieldValue(field.name, option ? option.value : '')}
        />
    );
    const handleSubmit = async (values:any) => {
        const formData=new FormData();
        formData.append('client_name',values.client_name);
        formData.append('email',values.email);
        formData.append('file_id',values.file_id);
        formData.append('type',values.type);
        formData.append('lead_id',values.lead_id);
        formData.append('folder_name',values.folder_name);
        formData.append('project_name',values.project_name);
        formData.append('site_location',values.site_location);
        formData.append('user_id',localStorage.getItem('userId') as string);
        
        setLoading(true);
        values.quotation.forEach((file:File)=>{
            formData.append('quotation',file);
        })
        const response=await apiGetCrmFileManagerShareContractFile(formData);
        const responseData=  await response.json();
        setLoading(false);
        if(response.status===200){
            toast.push(
                <Notification closable type='success' duration={2000}>
                    {responseData.message}
                </Notification>
            )
            window.location.reload();
        }
        else{
            toast.push(
                <Notification closable type='danger' duration={2000}>
                    {responseData.errorMessage}
                </Notification>
            )
        }
        console.log(responseData);
        
      };
     
    const navigate=useNavigate()
    const approvedFiles = data.data.filter(file => file.admin_status === 'approved').map(file => ({ value: file.itemId, label: file.file_name }));
    return (
        <div>
        <div className=' flex justify-end mb-4 gap-3'>
            <Button variant='solid' size='sm' onClick={()=>openDialog()} >Share to Client</Button>
    </div>
    {table.getRowModel().rows.length > 0 ? (
        <div>
    <Table>
        <THead>
            {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <Th key={header.id} colSpan={header.colSpan}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </Th>
                    ))}
                </Tr>
            ))}
        </THead>
        <TBody>
            {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                    ))}
                </Tr>
            ))}
        </TBody>
    </Table>
       <div className="flex items-center justify-between mt-4">
       <Pagination
           pageSize={table.getState().pagination.pageSize}
           currentPage={table.getState().pagination.pageIndex + 1}
           total={data.data.length}
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
) : (
    <div style={{ textAlign: 'center' }}>No Contracts for approval</div>
)}

          
<Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                className={`pb-3`}>
                  <h3 className='mb-4'>Share To Client</h3>
                 <Formik
                 initialValues={{
                     client_name: '',
                    email: '',
                    file_id: '',
                    type:'Client',
                    lead_id:leadId,
                    folder_name:'contract',
                    project_name:'',
                    site_location:'',
                    user_id:localStorage.getItem('userId'),
                    quotation:[]
                }}
                 validationSchema={Yup.object({
                     client_name: Yup.string().required('Required'),
                     email: Yup.string().email('Invalid email address').required('Required'),
                     file_id: Yup.string().required('Required'),
                 })}
                 onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                        handleSubmit(values);
                        setSubmitting(false);
                 }}
                 >
                    <div className='max-h-96 overflow-y-auto '>
                    <Form className='mr-3'>
                 <FormItem label='Client Name' asterisk>
                 <Field name="client_name" type="text" component={Input}/>
                 </FormItem>
                    <FormItem label='Client Email' asterisk>
                    <Field name="email" type="text" component={Input}/>
                    </FormItem>
                    <FormItem label='File' asterisk>
                    <Field name="file_id" >
                        {({ field, form }: any) => (
                            <SelectField
                                options={approvedFiles}
                                field={field}
                                form={form}
                            />
                        )}
                    </Field>
                    </FormItem>
                    <FormItem label='Project Name'>
                    <Field name="project_name" type="text" component={Input}/>
                    </FormItem>
                    <FormItem label='Site Location'>
                    <Field name="site_location" type="text" component={Input}/>
                    </FormItem>
                    <FormItem label='Quotation'>
                    <Field name="quotation" type="text">
  {({ field, form }: any) => (
    
    <Upload
    accept='.pdf'
    draggable
      onChange={(files) => {
        form.setFieldValue('quotation', files);
      }}
    />

  )}
</Field>
                    </FormItem>
                    <Button type='submit' block variant='solid' loading={loading}> {loading?'Submitting':'Submit'} </Button>
                 </Form>  
                 </div>
                 </Formik>
                 
            </Dialog>
                
                    
        
        </div>
    )
}

export default ContractDetails

