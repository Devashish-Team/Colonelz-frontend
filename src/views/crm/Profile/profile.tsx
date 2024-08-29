import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import {
    HiOutlineUser,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import FormRow from '@/views/account/Settings/components/FormRow'
import { useContext, useEffect, useState } from 'react'
import { addProfilePhoto } from '@/services/CommonService'
import { UserDetailsContext } from '@/views/Context/userdetailsContext'

export type ProfileFormModel = {
    username: string
    email: string
    title: string
    avatar: string
}
export type ProfileUpdate = {
    userId: string
    avatar: string
}

type ProfileProps = {
    data?: ProfileFormModel | null
}
const validationSchema = Yup.object().shape({
    avatar: Yup.string(),
})

const Profile = ({
  data,
}: ProfileProps) => {
    console.log(data);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(data?.avatar);
    const onSetFormFile = (
        form: FormikProps<ProfileFormModel>,
        field: FieldInputProps<ProfileFormModel>,
        file: File[]
    ) => {
        const url = URL.createObjectURL(file[0]);
        form.setFieldValue('avatarUrl', url);
        form.setFieldValue(field.name, file[0]);
        setAvatarUrl(url);
    }

    const onFormSubmit = async (
        values: ProfileUpdate,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const formData = new FormData();
        formData.append('userId', values.userId);
        formData.append('file', values.avatar); 
    
        const response = await addProfilePhoto(formData); 
        setAvatarUrl(data?.avatar);
        toast.push(<Notification title={'Profile updated'} type="success" />, {
            placement: 'top-center',
        });
        window.location.reload();
        setSubmitting(false);
    }




    return (
        <>
      
        <Formik
            enableReinitialize
            initialValues={{
                userId: localStorage.getItem('userId'),
                avatar: data?.avatar,
            } as ProfileUpdate
            }
            
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ values, touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form className='w-full sm:w-3/5 lg:w-2/5'>
                        <FormContainer>

                        <FormRow
    name="avatar"
    label="Avatar"
    {...validatorProps}
>
    <Field name="avatar">
        {({ field, form }: FieldProps) => {
            const avatarProps = avatarUrl
                ? { src: avatarUrl }
                : data?.avatar
                ? { src: data.avatar }
                : {}
            return (
                <div 
                    className="relative group cursor-pointer"
                    onClick={() => document.getElementById('avatarInput')?.click()}
                >
                    <label >
                    <input 
                        type="file" 
                        id="avatarInput" 
                        style={{ display: 'none' }} 
                        aria-label="Upload avatar"
                        onChange={(event:any) => {
                        const file = event.target.files[0];
                        const url = URL.createObjectURL(file);
                        form.setFieldValue('avatarUrl', url);
                        form.setFieldValue(field.name, file);
                        setAvatarUrl(url);
                                }}
                            />
                        </label>
                    <Avatar
                        className="border-2 border-white dark:border-gray-800 shadow-lg transition-all duration-300 group-hover:blur"
                        size={60}
                        shape="circle"
                        icon={<HiOutlineUser />}
                        {...avatarProps}
                    />
                    <div className="absolute inset-0 bg-black rounded-full bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white">Edit</span>
                    </div>
                </div>
            )
        }}
    </Field>
</FormRow>
                             
                           
                            <FormItem
                                label="Username"
                            >
                                <Input placeholder={`${data?.username}`} disabled/>
                            </FormItem>
                            <FormItem
                                label="Email"
                            >
                                <Input placeholder={`${data?.email}`} disabled/>
                            </FormItem>
                            <FormItem
                                label="Role"
                            >
                                <Input placeholder={`${data?.title}`} disabled/>
                            </FormItem>
                            
                           
                           
                           

                            <div className="mt-4 ">
                               
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Updating' : 'Update'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
        </>
    )
}

export default Profile
