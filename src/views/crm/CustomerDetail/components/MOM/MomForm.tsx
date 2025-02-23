import React, { useState, FormEvent } from 'react'
import {
    Button,
    DatePicker,
    FormContainer,
    FormItem,
    Input,
    Notification,
    Select,
    Upload,
    toast,
} from '@/components/ui'
import CreatableSelect from 'react-select/creatable' 
import { useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineCloudUpload } from 'react-icons/hi'

import App from './Richtext'
import { apiCreateMom } from '@/services/CrmService'
import { MultiValue } from 'react-select'
import { StickyFooter } from '@/components/shared'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

type Option = {
    value: string
    label: string
}

interface FormData {
    user_id:string | null
    client_name: string
    organisor: string
    attendees: string
    meetingDate: string
    location: string
    remark: string
    files: File[]
    project_id: string
}

const YourFormComponent = () => {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    interface QueryParams {
        project_id: string
        client_name: string
    }
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const allQueryParams: QueryParams = {
        project_id: queryParams.get('project_id') || '',
        client_name: queryParams.get('client_name') || '',
    }
 
    const clientOptions: Option[] = [
        {
            value: allQueryParams.client_name,
            label: allQueryParams.client_name,
        },
    ]
   
const optionsSource = [
        { value: 'At Office', label: 'At Office' },
        { value: 'At Site', label: 'At Site' },
        { value: 'At Client place', label: 'At Client Place' },
        { value: 'Other', label: 'Other' },
    ]

  

   

    return (
        <div>
            <h5>Add MOM</h5>
            <Formik 
            initialValues={
                {
                    user_id:localStorage.getItem('userId'),
                    client_name: '',
                    organisor: '',
                    attendees: '',
                    meetingDate: '',
                    location: '',
                    remark: '',
                    files: [],
                    project_id: allQueryParams.project_id,
                }
            }
            validationSchema={Yup.object().shape({
                client_name: Yup.array().required('Client Name is required'),
                organisor: Yup.array().required("Organisor's Name is required"),
                meetingDate: Yup.string().required('Meeting Date is required'),
                location: Yup.string().required('Location is required'),
            })
            }
            onSubmit={async(values) => {
                const formData = new FormData()
                console.log(values);
                
                formData.append('user_id', (values.user_id || ''))
                formData.append('client_name', values.client_name)
                formData.append('organisor', values.organisor)
                formData.append('attendees', values.attendees)
                formData.append('meetingdate', values.meetingDate)
                formData.append('location', values.location)
                formData.append('remark', values.remark)
                values.files.forEach((file) => {
                    formData.append('files', file)
                })
                formData.append('project_id', values.project_id)
                
                
                setSubmitting(true)
                try{
                const response = await apiCreateMom(formData)
                console.log(response);
                
           
                if (response.code === 200) {
                    setSubmitting(false)
                    toast.push(
                        <Notification closable type="success" duration={2000}>
                            Mom Created Successfully
                        </Notification>
                    )
                    window.location.reload()
                    navigate(-1)
                } else {
                    toast.push(
                        <Notification closable type="success" duration={2000}>
                            {response.errorMessage}
                        </Notification>
                    )
                }
            } catch (error) {
                setSubmitting(false)
                toast.push(
                    <Notification closable type="success" duration={2000}>
                        Internal server Error
                    </Notification>
                )
            }
            }
            }
            >
                     {({ errors, setFieldValue,setSubmitting,values }) => (
                <Form>
                <FormContainer>
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 min-h-96">
                    <FormItem label="Client's Name" asterisk>
                                <Field name="client_name">
                                    {({ field, form }:any) => (
                                        <Select
                                            isMulti
                                            componentAs={CreatableSelect}
                                            options={clientOptions}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                                                form.setFieldValue('client_name', values);
                                            }}
                                        />
                                    )}
                                </Field>
                                {errors.client_name && (
                                    <span className="text-red-500">
                                        {errors.client_name}
                                    </span>)}
                            </FormItem>
                        <FormItem label="Organised By"
                        asterisk>
                            <Field name="organisor">
                                    {({ field, form }:any) => (
                                        <Select
                                            isMulti
                                            componentAs={CreatableSelect}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                                                form.setFieldValue('organisor', values);
                                            }}
                                        />
                                    )}
                                </Field>
                            {errors.organisor && (
                                <span className="text-red-500">
                                    {errors.organisor}
                                </span>
                            )}
                        </FormItem>
                       
                        <FormItem label="Others" >
                        <Field name="attendees">
                                    {({ field, form }:any) => (
                                        <Select
                                            isMulti
                                            componentAs={CreatableSelect}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                                                form.setFieldValue('attendees', values);
                                            }}
                                        />
                                    )}
                                </Field>
                            {
                                errors.attendees && (
                                    <span className="text-red-500">
                                        {errors.attendees}
                                    </span>
                                )
                            }
                        </FormItem>
                        <FormItem label="Date" asterisk>
                            <DatePicker
                                onChange={(date) =>
                                    setFieldValue('meetingDate', date ? `${date}` : '')
                                }
                            />
                            {errors.meetingDate && (
                                <span className="text-red-500">
                                    {errors.meetingDate}
                                </span>
                            )}
                        </FormItem>
                        <FormItem label="Location" asterisk>
                            <Select
                                options={optionsSource}
                                onChange={(selectedOption) =>
                                    setFieldValue('location', selectedOption?.value)
                                }
                            />
                            {errors.location && (
                                <span className="text-red-500">
                                    {errors.location}
                                </span>
                            )}
                        </FormItem>

                        <FormItem label="File">
                            <Upload 
                            multiple
                            onChange={(files) => {
                                setFieldValue('files', files)
                            }}
                            >
                                <Button
                                    variant="solid"
                                    icon={<HiOutlineCloudUpload />}
                                    type="button"
                                >
                                    Upload your file
                                </Button>
                            </Upload>
                        </FormItem>
                       


                      
                    </div>
                    <App
                        value={values.remark}
                        onChange={(value) => {
                            setFieldValue('remark', value)
                        }}
                    />
                   
               
                
                <StickyFooter
         className="-mx-8 px-8 flex items-center gap-3 py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
              
                        <Button type="submit" className="mr-4" variant="solid" size='sm' loading={submitting}>
                            {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button type="submit" onClick={() => navigate(-1)} size='sm'>
                            Discard
                        </Button>

                    </StickyFooter>
                    </FormContainer>
                    </Form>
                )}
                    
                </Formik>
                
        </div>
    )
}

export default YourFormComponent
