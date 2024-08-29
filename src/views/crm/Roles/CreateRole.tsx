import React, { ChangeEvent, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Selector from './Selector'; // Adjust import path as necessary
import { Button, FormItem, Input, Notification, toast } from '@/components/ui';
import useQuery from '@/utils/hooks/useQuery';
import { apiCreateRole, apiEditRoles, apiGetRoleDetails } from '@/services/CommonService';
import { useNavigate } from 'react-router-dom';
import { StickyFooter } from '@/components/shared';

type Permission = 'create' | 'read' | 'update' | 'delete';
type AccessType = 'lead' | 'user' | 'project' | 'task' | 'contract' | 'quotation' | 'file' | 'archive' | 'mom' | 'addMember' | 'role' | 'companyData' |'userArchive';

type AccessPermissions = Permission[];

type FormValues = {
    [key in AccessType]: AccessPermissions;
};

const accessTypes: AccessType[] = [
    'lead', 'user', 'project', 'task', 'contract', 'quotation', 'file', 'archive', 'mom', 'addMember', 'role','companyData','userArchive'
];

const validationSchema = Yup.object().shape(
    accessTypes.reduce((acc, type) => {
        acc[type] = Yup.array().of(Yup.string().oneOf(['create', 'read', 'update', 'delete']));
        return acc;
    }, {} as any)
);


const EditRoles = () => {
    const query = useQuery();
    const id = query.get('id');
    const [role,setRole]=useState<any>(null)
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<FormValues>(() =>
        accessTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as FormValues)
    );
    console.log('initialValues', initialValues);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setRole(e.target.value);
    };
    
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const response = await apiGetRoleDetails();
                if (response && response.data) {
                    const roleData = response.data.find((r: any) => r._id === id);
                    if (roleData && roleData.access) {
                        const newInitialValues = accessTypes.reduce((acc, type) => {
                            acc[type] = roleData.access[type] || []; 
                            return acc;
                        }, {} as FormValues);
                        setInitialValues(newInitialValues);
                    } else {
                        const emptyInitialValues = accessTypes.reduce((acc, type) => {
                            acc[type] = [];
                            return acc;
                        }, {} as FormValues);
                        setInitialValues(emptyInitialValues);
                    }
                }
            }
        };
        fetchData();
    }, [id]);
    
    

    const handleSubmit = async (values: FormValues,setSubmitting:any) => {
        console.log(values);      
        const access = Object.keys(values).reduce((acc, key) => {
            const permissions = values[key as AccessType];
            if (permissions.length > 0) {
                acc[key as AccessType] = permissions; 
            }
            return acc;
        }, {} as { [key in AccessType]?: AccessPermissions });
    
        const payload = {
            role:role,
            access
        };
        console.log('payload', payload);
        
    
        const response = await apiCreateRole(payload);
        setSubmitting(false)
        console.log(response);
    };
    

    return (
        <div className='p-6'>
            <h3>Create Role</h3>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
             onSubmit={async(values,{setSubmitting}) =>{
                setSubmitting(true)
                const access = Object.keys(values).reduce((acc, key) => {
                    const permissions = values[key as AccessType];
                    if (permissions.length > 0) {
                        acc[key as AccessType] = permissions; 
                    }
                    return acc;
                }, {} as { [key in AccessType]?: AccessPermissions });
            
                const payload = {
                    role:role,
                    access
                };
                console.log('payload', payload);
                
            
                const response = await apiCreateRole(payload);
                setSubmitting(false)
                if(response.code===200){
                    toast.push(
                        <Notification type='success' duration={2000} closable>
                            {response.message}
                        </Notification>
                    )
                    window.location.reload()
                }
                 else{
                        toast.push(
                            <Notification type='danger' duration={2000} closable>
                                {response.errorMessage}
                            </Notification>)
                 }
                
             }}

            >
                {({ isSubmitting }) => (
                    <Form>
                        <FormItem label='Role' className='w-1/3 !mb-0 mt-5'>
                            <Input
                            name='role'
                            placeholder='Role'
                            onChange={(e)=>handleInputChange(e)} 
                            />
                        </FormItem>
                        {accessTypes.map((type) => (
                            <div
                                key={type}
                                className='grid md:grid-cols-4  gap-4 py-8 border-b border-gray-200 dark:border-gray-600 items-center'
                            >
                                <div className="font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                                <div className='flex gap-2'>
                                    <Field name={type}>
                                        {({ field, form }: any) => (
                                            <Selector field={field} form={form} />
                                        )}
                                    </Field>
                                </div>
                            </div>
                        ))}
                        <StickyFooter
                  className="-mx-8 px-8 flex items-center justify-between py-4 mt-7"
                  stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className='flex gap-3'>
                            <Button
                                variant="solid"
                                loading={isSubmitting}
                                type="submit"
                                size='sm'
                            >
                                {isSubmitting ? 'Creating...' : 'Create'}
                            </Button>
                            <Button
                            size='sm'
                                loading={isSubmitting}
                                type="button"
                                onClick={() => navigate('/app/crm/profile')}
                            >
                            Back
                            </Button>
                            </div>
                            </StickyFooter>
                        
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditRoles;
