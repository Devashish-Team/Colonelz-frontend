import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Field, Form, Formik, FormikContext } from 'formik'
import { DatePicker, FormItem, Input, Notification, Select, toast } from '@/components/ui'
import { apiGetCrmProjectsAddTask, apiGetCrmProjectsTaskUpdate, apiGetUsersList } from '@/services/CrmService'
import { HiOutlinePencil } from 'react-icons/hi'
import * as Yup from 'yup'

type Task = {
    user_id: string;
    project_id: string;
    task_name: string;
    task_description: string;
   actual_task_start_date: string;
    actual_task_end_date: string;
    estimated_task_start_date: string;
    estimated_task_end_date: string; 
    task_status: string; 
    task_priority: string; 
    task_assignee: string;
    reporter: string;
    task_id: string;
  };
  type Data={
    Data:Task
  }

  interface EditTaskProps extends Data {
    task: boolean;
    users:String[]
  }

const EditTask = ({ Data,users,task }: EditTaskProps) => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userData,setUserData]=useState<any>(null)

    
    
const openDialog = () => {
    setIsOpen(true)
}

const onDialogClose = () => {
    setIsOpen(false)
}

const priorityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];
  
  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Cancelled", value: "Cancelled" },
  ];
  
  const userOptions = users?.map((user:any) => ({
    label: user,
    value: user
  }));

  const formateDate = (dateString:string) => {
    const date = new Date(dateString);
    const day=date.getDate().toString().padStart(2, '0');
    const month=(date.getMonth() + 1).toString().padStart(2, '0');
    const year=date.getFullYear();
    return `${day}-${month}-${year}`;
    }


    return (
        <div>
            <div onClick={openDialog}>{task?(<Button className='flex justify-center items-center gap-1' variant='solid' block><span> <HiOutlinePencil/></span><span>  Edit Task</span></Button>):<HiOutlinePencil/>}</div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <div className="pl-4 ">
                    <h3>Edit Task</h3>
                </div>
                <Formik 
                       initialValues={{
                        task_id: Data.task_id,
                        user_id: localStorage.getItem('userId') || '',
                        project_id: Data.project_id,
                        task_name: Data.task_name,
                        task_description: Data.task_description,
                        actual_task_start_date: new Date(Data.actual_task_start_date) ,
                        actual_task_end_date:new Date(Data.actual_task_end_date),
                        estimated_task_start_date: new Date(Data.estimated_task_start_date),
                        estimated_task_end_date: new Date(Data.estimated_task_end_date),
                        task_status: statusOptions.find((option)=>option.value===Data.task_status)?.value,  
                        task_priority: priorityOptions.find((option)=>option.value===Data.task_priority)?.value, 
                        task_assignee: Data.task_assignee,
                        reporter: Data.reporter,
                      }}
                      validationSchema={Yup.object().shape({
                        task_name: Yup.string().required("Task Name is required"),
                      
                        estimated_task_start_date: Yup.string().required("Estimated Start Date is required"),
                        estimated_task_end_date: Yup.string().required("Estimated End Date is required").test(
                            "is-greater",
                            "End Date must be greater than Start Date",
                            function (value) {
                              const { estimated_task_start_date } = this.parent;
                              if (estimated_task_start_date && value) {
                                return new Date(value) > new Date(estimated_task_start_date);
                              }
                              return true;
                            }
                          
                        ),
                        task_status: Yup.string().required("Task Status is required"),
                        task_priority: Yup.string().required("Task Priority is required"),
                        task_assignee: Yup.string().required("Task Assignee is required"),
                        reporter: Yup.string().required("Reporter is required"),
                      })
                      }
                     onSubmit={async(values, actions) => {
                        setLoading(true)
                            const response = await apiGetCrmProjectsTaskUpdate(values)
                            console.log('response', response);
                            if(response.code===200){
                                setLoading(false)
                                toast.push(
                                    <Notification closable type='success' duration={2000}>Task Updated Successfully</Notification>
                                )
                                window.location.reload()
                            }
                            else{
                                setLoading(false)
                                toast.push(
                                    <Notification closable type='danger' duration={2000}>{response.errorMessage}</Notification>
                                )
                            }
                        
                         
                     }} >
                        {({values, errors, touched})=>(

                        <Form className=' p-4 max-h-96 overflow-y-auto'>
                            <div className=' grid grid-cols-2 gap-x-5'>
                            <FormItem label='Task Name'
                            asterisk
                            invalid={errors.task_name && touched.task_name}
                            errorMessage={errors.task_name}>
                                <Field name='task_name'  component={Input} placeholder='Task Name'/>
                               
                            </FormItem>
                            <FormItem label='Task Assignee'
                            asterisk
                            invalid={errors.task_assignee && touched.task_assignee}
                            errorMessage={errors.task_assignee}>
                                <Field name='task_assignee'   placeholder='Task'>
                                    {({field}:any)=>(
                                        <Select
                                        placeholder={Data.task_assignee}
                                        options={userOptions}
                                        name='task_assignee'
                                        onChange={(option:any) => field.onChange({ target: { name: 'task_assignee', value: option ? option.value : '' } })}
                                    />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem label='Task Status'
                            asterisk
                            invalid={errors.task_status && touched.task_status}
                            errorMessage={errors.task_status}
                            >
                                <Field name='task_status'  placeholder='Task'
                                >
                                    {({field}:any)=>(
                                       <Select
                                       placeholder={Data.task_status}
                                       options={statusOptions}
                                       name='task_status'
                                       onChange={(option) => field.onChange({ target: { name: 'task_status', value: option ? option.value : '' } })}
                                   />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem label='Actual Start Date'
                             >
                            <Field name='actual_task_start_date' placeholder='Start date'>
                                {({field}: any) => (
                                    <DatePicker name='actual_task_start_date'
                                        onChange={(value) => {
                                            field.onChange({ target: {name: 'actual_task_start_date', value: `${value}`} })
                                        }}
                                    />
                                )}
                            </Field>
                            </FormItem>
                            <FormItem label='Actual End Date'
                            >
                                <Field name='actual_task_end_date' placeholder='End Date'>
                                    {({field}:any)=>(
                                        <DatePicker name='actual_task_end_date'
                                        onChange={(value) => {
                                            field.onChange({ target: {name: 'actual_task_end_date', value: `${value}`} })
                                        }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem label='Estimated Start Date'
                            asterisk
                            >
                            <Field name='estimated_task_start_date' placeholder='Start date'>
                                {({field}: any) => (
                                    <DatePicker name='estimated_task_start_date'
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange({ target: {name: 'estimated_task_start_date', value: `${value}`} })
                                        }}
                                    />
                                )}
                            </Field>
                            </FormItem>
                            <FormItem label='Estimated End Date'
                            asterisk>
                                <Field name='estimated_task_end_date' placeholder='End Date'>
                                    {({field}:any)=>(
                                        <DatePicker name='estimated_task_end_date'
                                        value={field.value}
                                        onChange={(value) => { 
                                            field.onChange({ target: {name: 'estimated_task_end_date', value: `${value}`} })
                                        }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem label='Report to'
                            asterisk
                            invalid={errors.reporter && touched.reporter}   
                            errorMessage={errors.reporter}
                            >
                                <Field name='reporter' placeholder='Reporting to'>
                                    {({field}:any)=>(
                                        <Select
                                        name='reporter'
                                        placeholder={Data.reporter}
                                        options={userOptions}
                                        onChange={(value:any) => { field.onChange({ target: {name:'reporter', value: value?.value } }) }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem label='Priority'
                            asterisk
                            invalid={errors.task_priority && touched.task_priority}
                            errorMessage={errors.task_priority}
                            >
                                <Field name='task_priority'  placeholder='Task Priority'>
                                    {({field}:any)=>(
                                        <Select
                                        name='task_priority'
                                        placeholder={Data.task_priority}
                                        options={priorityOptions}
                                        onChange={(value) => { field.onChange({ target: {name:'task_priority', value: value?.value } }) }}
                                        />
                                    )}          
                                </Field>
                            </FormItem>
                            </div>
                            <FormItem label='Desription'>
                                <Field name='task_description' placeholder='Task Description'>
                                    {({field}:any)=>{
                                        return (
                                            <Input textArea name='task_description'
                                            {...field}/>
                                        )
                                    }}
                                </Field>
                            </FormItem>
                            <div className='flex justify-end'>
                                <Button type='submit' variant='solid' size='sm' loading={loading}>{loading?'Updating...':'Update'}</Button>
                            </div>
                        </Form>)}
                </Formik>
            </Dialog>
        </div>
    )
}

export default EditTask