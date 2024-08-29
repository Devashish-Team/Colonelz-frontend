import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, FormContainer, FormItem, Input, Notification, Select, Upload, toast } from '@/components/ui';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from '@/components/ui/DatePicker/DatePicker';
import { StickyFooter } from '@/components/shared';
import { apiGetCrmCreateLeadToProject } from '@/services/CrmService';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

interface FormData {
  lead_id: string | null;
  status: string;
  content: string;
  createdBy: string;
  client_name: string;
  client_email: string;
  client_contact: string;
  location: string;
  designer: string;
  description: string;
  project_type: string;
  project_name: string;
  project_status: string;
  timeline_date: Date | null;
  project_budget: string;
  project_start_date: Date | null;
  contract: File | null;
}

interface CustomerProfileProps {
  data?: Partial<Customer>;
}

type Customer = {
  _id: string;
  name: string;
  lead_id: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  source: string;
  notes: string[];
};

const YourFormComponent: React.FC<CustomerProfileProps> = ({ data }) => {
  interface QueryParams {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
  }
  const [loading,setLoading]=useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Create an object to store and map the query parameters
  const allQueryParams: QueryParams = {
    id: queryParams.get('id') || '',
    name: queryParams.get('name') || '',
    email: queryParams.get('email') || '',
    phone: queryParams.get('phone') || '',
    location: queryParams.get('location') || '',
  };


  const navigate = useNavigate();

  const projectTypeOptions = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
  ];

  const projectStatusOptions = [
    { value: 'designing', label: 'Designing' },
    { value: 'executing', label: 'Executing' },
  ];


  return (
    <div>
      <div className='flex justify-between items-center max-sm:flex-col mb-6'></div>
     <Formik
     initialValues={{
      lead_id: allQueryParams.id,
      client_name:allQueryParams.name,
      client_email:allQueryParams.email || '',
      client_contact:allQueryParams.phone,
      project_name:'',
      location:allQueryParams.location || '',
      designer:'',
      project_budget:'',
      project_type:'',
      project_status:'',
      project_start_date:'',
      timeline_date:'',
      contract:[],
      description:'',
      user_id:localStorage.getItem('userId') || '',
     }}
     validationSchema={Yup.object().shape({
      client_name: Yup.string().required('Client Name is required'),
      client_email: Yup.string().email('Invalid email').required('Email is required'),
      client_contact: Yup.string().required('Contact is required'),
      project_name: Yup.string().required('Project Name is required'),
      location: Yup.string().required('Location is required'),
      designer: Yup.string().required('Designer is required'),
      project_budget: Yup.string().required('Budget is required'),
      project_type: Yup.string().required('Type is required'),
      project_status: Yup.string().required('Status is required'),
      project_start_date: Yup.string().required('Start Date is required'),
      timeline_date: Yup.string().required('Timeline is required').test(
        'date',
        'Timeline Date should be greater than Start Date',
        function (value) {
          const startDate = this.parent.project_start_date;
          const timelineDate = new Date(value);
          const startDateValue = new Date(startDate);
          return timelineDate > startDateValue;
        }
      
      ),
      contract: Yup.array().required('Contract is required').test(
        'file',
        'File is required',
        (value) => {
          return value.length > 0;
        }
      ),
      description: Yup.string(),
     })}
     onSubmit={async(values) => {
       setLoading(true);
       const formData=new FormData();
       Object.keys(values).forEach((key: string) => {
        if (key !== 'contract') {
          formData.append(key, values[key as keyof typeof values] as string);
        }
      });
      values.contract.forEach((file, index) => {
        formData.append('contract', file);
      });

       console.log('Form Data:', formData);
       console.log('Values:', values);
       
       
        const response =await apiGetCrmCreateLeadToProject(formData);
        const responseData=await response.json();
        setLoading(false);
        if(responseData.code===200){
          toast.push(
            <Notification
              key={Math.random()}
              type='success'
              title='Project created successfully'
              duration={2000}
            />
          )
          navigate("/app/crm/projectslist");
          window.location.reload();
        }
        else{
          const errorMessage = responseData.errorMessage || 'Internal Server Error';
          toast.push(
            <Notification
              key={Math.random()}
              type='danger'
              title={errorMessage}
              duration={2000}
            />
          )
        } 
    }
  }
     >
      {({ values,errors, touched }) => (
        <Form >
        <FormContainer className='grid grid-cols-1 sm:grid-cols-2 gap-5 xl:grid-cols-4'>
        <FormItem label='Client Name'
        asterisk
        invalid={errors.client_name && touched.client_name}
        errorMessage={errors.client_name}
        >
          <Field
            
            name='client_name'
            type='text'
            placeholder='Client Name'>
            {({ field,form }:any) => {
              return (
                <Input
                type='text'
                placeholder='Client Name'
                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                onKeyDown={(e) => {
                  const regex = /^[a-zA-Z\s]*$/;
                  if (!regex.test(e.key)) {
                      e.preventDefault();
                  }}}
                />
              );
            }}
            </Field>
        </FormItem>
        <FormItem label='Client Email'
        asterisk
        invalid={errors.client_email && touched.client_email}
        errorMessage={errors.client_email}
        >
          <Field
            component={Input}
            name='client_email'
            type='email'
            placeholder='Client Email'/>  
        </FormItem>
        <FormItem label='Client Contact'
        asterisk
        invalid={errors.client_contact && touched.client_contact}
        errorMessage={errors.client_contact}
        >
          <Field
            
            name='client_contact'
            type='text'
            placeholder='Client Contact'>
            {({ field,form }:any) => {
              return (
                <Input
                type='text'
                placeholder='Client Contact'
                maxLength={10}
                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              onKeyDown={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    e.preventDefault();
                  }
                }}
                />
              );}}
            </Field>
        </FormItem>
        <FormItem label='Project Name'
        asterisk
        invalid={errors.project_name && touched.project_name}
        errorMessage={errors.project_name}
        >
          <Field
            component={Input}
            name='project_name'
            type='text'
            placeholder='Project Name'/>
        </FormItem>
        <FormItem label='Location'
        asterisk
        invalid={errors.location && touched.location}
        errorMessage={errors.location}
        >
          <Field
            component={Input}
            name='location'
            type='text'
            placeholder='Location'/>
        </FormItem>
        <FormItem label='Designer'
        asterisk
        invalid={errors.designer && touched.designer}
        errorMessage={errors.designer}
        >
          <Field
            name='designer'
            type='text'
            placeholder='Designer'>
            {({ field,form }:any) => {
              return (
              <Input
              type='text'
              placeholder='Designer'
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              onKeyDown={(e) => {
                const regex = /^[a-zA-Z\s]*$/;
                if (!regex.test(e.key)) {
                    e.preventDefault();
                }
            }}
              />
              );
            }}
            </Field>
        </FormItem>
        <FormItem label='Project Budget'
        asterisk
        invalid={errors.project_budget && touched.project_budget}
        errorMessage={errors.project_budget}
        >
          <Field
            component={Input}
            name='project_budget'
            type='text'
            placeholder='Project Budget'/>
        </FormItem>
        <FormItem label='Project Type'
        asterisk
        invalid={errors.project_type && touched.project_type}
        errorMessage={errors.project_type}
        >
          <Field
            name='project_type'>
              {({ field,form }:any) => {
                return (
                  <Select
                    options={projectTypeOptions}
                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                  />
                );
              }}
            </Field>
        </FormItem>
        <FormItem label='Project Status'
        asterisk
        invalid={errors.project_status && touched.project_status}
        errorMessage={errors.project_status}
        >
          <Field
            name='project_status'>
              {({ field,form }:any) => {
                return (
                  <Select
                    options={projectStatusOptions}
                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                  />
                );
              }
            }
            </Field>

        </FormItem>
        <FormItem label='Project Start Date'
        asterisk
        invalid={errors.project_start_date && touched.project_start_date}
        errorMessage={'Start Date is required'}
        >
          <Field
            name='project_start_date'>
            {({ field,form }:any) => {
              return (
                <DatePicker
                  onChange={(date) => form.setFieldValue(field.name, `${date}`)}
                />
              );
            }}
            </Field>
        </FormItem>
        <FormItem label='Timeline Date'
        asterisk
        invalid={errors.timeline_date && touched.timeline_date}
        errorMessage={errors.timeline_date}
        >
          <Field
            name='timeline_date'>
            {({ field,form }:any) => {
              return (
                <DatePicker
                  onChange={(date) => form.setFieldValue(field.name, `${date}`)}
                />
              );
            }}
            </Field>
        </FormItem>
        <FormItem label='Contract'
        asterisk
        invalid={Boolean(
          errors.contract && touched.contract
      )}
      errorMessage={errors.contract as string}
        >
        <Field name='contract'>
  {({ field, form }: any) => {
    return (
      <Upload
            onChange={(files) =>
            form.setFieldValue(field.name, files)
          }
        onFileRemove={(files) =>form.setFieldValue(field.name, files)}/>
    );
  }}

</Field>
        </FormItem>
      
       
        </FormContainer>
        <div className='grid lg:grid-cols-2 '>
        <FormItem label='Description'>
          <Field
            name='description'
            >
            {({ field,form }:any) => {
              return (
                <Input
                textArea  
                  type='text'
                  placeholder='Description'
                  onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                />
              );
            }}
            </Field>
        </FormItem>
        </div>
        <StickyFooter 
         className="-mx-8 px-8 flex items-center gap-3 py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >

          <Button type='button' size='sm' onClick={() => navigate(-1)}>Cancel</Button>

          <Button type='submit' size='sm' variant='solid' loading={loading}>{loading?'Submitting':'Submit'}</Button>
        </StickyFooter>
        </Form>)}
      
        </Formik>
    </div>
  );
};

export default YourFormComponent;
