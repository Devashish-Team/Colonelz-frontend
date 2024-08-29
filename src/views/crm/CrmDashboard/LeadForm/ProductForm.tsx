import React, { useState } from 'react'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { Button, FormItem, Input, Notification, Select, toast } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { RichTextEditor, StickyFooter } from '@/components/shared'
import { apiGetCrmCreateLead } from '@/services/CrmService'
import { format, isValid, parse } from 'date-fns'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const options = [
    { value: 'Follow Up', label: 'Follow Up' },
    { value: 'Interested', label: 'Interested' },
    { value: 'Not Contacted', label: 'Not Contacted' },
    { value: 'No Response', label: 'No Response' },
]
const optionsSource = [
    { value: 'At Office', label: 'At Office' },
    { value: 'At Site', label: 'At Site' },
    { value: 'At Client place', label: 'At Client Place' },
    { value: 'Other', label: 'Other' },
]

interface FormData {
    name: string
    email: string
    phone: string
    location: string
    lead_manager: string
    status: string | null
    source: string
    content: string
    createdBy: string
    role: string
    date: string | null
  
}

const LeadForm: React.FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    return (
       <Formik
       initialValues={{
              userId:localStorage.getItem('userId'),
              name: '',
              email: '',
              phone: '',
              location: '',
              lead_manager: '',
              status: null,
              source: '',
              content: '',
              createdBy: 'ADMIN',
              role: localStorage.getItem('role') || 'ADMIN',
              date: null,
       }}
       validationSchema={Yup.object().shape({
        name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
        .required('Name is required'),
            email: Yup.string().email('Must be a valid email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            location: Yup.string().required('Location is required'),
            lead_manager: Yup.string().required('Lead Manager is required'),
            status: Yup.string().required('Status is required'),
            date: Yup.string().required('Date is required'),
         })
       }
       onSubmit={
              async(values) => {
                setLoading(true)
                const response = await apiGetCrmCreateLead(values)
                const data= await response.json()
                setLoading(false)
                console.log(data);
                if (data.code===200){
                    toast.push(
                        <Notification type='success' duration={2000}>
                            Lead Created Successfully
                        </Notification>
                    )
                    navigate('/app/leads')
                    window.location.reload()
                }
                else{
                    toast.push(
                        <Notification type='danger' duration={2000}>
                            {data.errorMessage.length===0?data.message:data.errorMessage}
                        </Notification>
                    )
                }
            }
       }>
        {({ errors, touched }) => (<>
        <Form >
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 xl:grid-cols-4'>
            <FormItem label='Lead Name'
            asterisk
            invalid={errors.name && touched.name}
            
            >
                <Field
                name='name'
                placeholder='Enter lead name'
                >
                    {({ field,form }:any) => (
                        <Input
                        name='name'
                        placeholder='Enter lead name'
                        onChange={(e) => {
                            form.setFieldValue(field.name, e.target.value)
                        }}
                        onKeyDown={(e) => {
                            const regex = /^[a-zA-Z\s]*$/;
                            if (!regex.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        />
                    )}
                </Field>
                <div className='text-red-500'>{errors.name}</div>
            </FormItem>

            <FormItem label='Email'
            asterisk
            invalid={errors.email && touched.email}
            errorMessage={errors.email}
            >
                <Field
                component={Input}
                name='email'
                placeholder='Enter email'
                />
            </FormItem>

            <FormItem label='Phone'
            asterisk
            invalid={errors.phone && touched.phone}
            errorMessage={errors.phone}
            >
                <Field
                name='phone'
                placeholder='Enter Phone'
                >
                    {({ field,form }:any) => (
                       <Input
                       placeholder='Enter phone'
                       maxLength={10}
                       onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                          form.setFieldValue(field.name, value);
                        }
                          }}
                          onKeyPress={(e) => {
                            const charCode = e.which ? e.which : e.keyCode;
                            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                              e.preventDefault();
                            }
                          }}
                          />
                    )}
                </Field>
            </FormItem>

            <FormItem label='Location'
            asterisk
            invalid={errors.location && touched.location}
            errorMessage={errors.location}
            >
                <Field
                component={Input}
                name='location'
                placeholder='Enter location'
                />
            </FormItem>

            <FormItem label='Lead Manager'
            asterisk
            invalid={errors.lead_manager && touched.lead_manager}
            errorMessage={errors.lead_manager}
            >
                <Field
                component={Input}
                name='lead_manager'
                placeholder='Enter lead manager'
                />
            </FormItem>

            <FormItem label='Lead Status'
            asterisk
            invalid={errors.status && touched.status}
            errorMessage={errors.status}
            >
                <Field
                name='status'
                options={options}
                placeholder='Select status'
                >
                    {({ field, form, meta }:any) => (
                        <Select
                        name='status'
                        options={options}
                        placeholder='Select status'
                        onChange={(value) => {
                            form.setFieldValue(field.name, value?.value)
                        }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem label='Source'
            asterisk
            invalid={errors.source && touched.source}
            errorMessage={errors.source}
            >
                <Field
                name='source'
                component={Input}
                placeholder='Select source'

                />
            </FormItem>

       
            <FormItem label='Created Date'
            asterisk
            invalid={errors.date && touched.date}
            errorMessage={errors.date}
            >
                <Field
                name='date'
                placeholder='Enter date'
                >
                    {({ field ,form}:any) => (
                        <DateTimepicker
                        maxDate={new Date()}
                        onChange={(date) => {
                         form.setFieldValue(field.name, `${date}`)
                        }}
                        />
                    )}
                </Field>
            </FormItem>

           

            </div>
            <FormItem label='Content'
            >
                <Field
                name='content'
                placeholder='Enter content'
                >
                    {({ field,form }:any) => (
                       <RichTextEditor
                       onChange={(e) => {
                        form.setFieldValue(field.name, e)
                          }}
                          />
                    )}
                </Field>
            </FormItem>

            <StickyFooter
                className="-mx-8 px-8 flex items-center gap-3 py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
                
                    <Button
                        size="sm"
                        className="ltr:mr-3 rtl:ml-3"
                        type="button"
                        onClick={() => {
                            navigate(-1)
                        }}
                    >
                        Discard
                    </Button>
                    <Button size="sm" variant="solid" type="submit" loading={loading}>
                        {loading?'Submitting':'Submit'}
                    </Button>
                
            </StickyFooter>
        </Form>
        
       
        </>)}
            </Formik>
    )
}

export default LeadForm
