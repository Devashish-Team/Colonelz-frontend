import { Button, FormItem, Notification, Select, Upload, toast } from '@/components/ui';
import React, { useState } from 'react';
import { HiOutlineCloudUpload } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { Data } from './data';
import { apiGetCrmFileManagerCreateProjectFolder } from '@/services/CrmService';

interface FormData {
  project_id: string | null;
  folder_name: string;
  files: File[];
}

type Option = {
  value: string;
  label: string;
};

const YourFormComponent: React.FC<Data> = (data) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('project_id');
  const [submit,setSubmit]=useState(false);
  const [formData, setFormData] = useState<FormData>({
    project_id: projectId,
    folder_name: '',
    files: [],
  });

  const handleSelectChange = (
    selectedOption: Option | Option[] | null,
    fieldName: string,
  ) => {
    const selectedValues = Array.isArray(selectedOption)
      ? selectedOption.map((option) => option.value)
      : selectedOption
      ? [selectedOption.value]
      : [];

    
    setFormData({
      ...formData,
      [fieldName]: selectedValues,
    });
  };
  

  const handleFileChange = (files: File[] | null) => {
    if (files) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            files: Array.from(files),
        }))
      
    }
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    if (!formData.folder_name || formData.files.length === 0) {
      toast.push(
        <Notification closable type="warning" duration={3000}>
          Please select a folder and upload at least one file.
        </Notification>,
        { placement: 'top-center' }
      );
      return;
    }
    const postData = new FormData();

    if (formData.project_id !== null) {
      postData.append('project_id', formData.project_id);
    }
    postData.append('folder_name', formData.folder_name);

    formData.files.forEach((file) =>
    postData.append('files', file),
)

    console.log('Post Data:', postData);
    
      const response = await apiGetCrmFileManagerCreateProjectFolder(postData);
      const responseData = await response.json(); 
      setSubmit(false);
      console.log('Response Data:', responseData);
  
      if (responseData.code===200) {
        toast.push(
          <Notification closable type="success" duration={3000}>
            File Uploaded Successfully
          </Notification>,
          { placement: 'top-center' }
        );
      
        window.location.reload();
      } else {
        toast.push(
          <Notification closable type="danger" duration={3000}>
            {responseData.errorMessage}
          </Notification>,
          { placement: 'top-center' }
        );
      }
  };

const uniqueFolderNames = Array.from(
    new Set(data.data.map((folderItem) => folderItem.folder_name.trim())),
)

const role = localStorage.getItem('role');

const clientOptions: Option[] = uniqueFolderNames
  .filter(folderName => {
    if (role === 'ADMIN' || role === 'Senior Architect') {
      return true;
    } else {
      return folderName !== 'quotation' && folderName !== 'contract' && folderName!=='procurement data';
    }
  })
  .map((folderName) => ({
    value: folderName,
    label: folderName,
  }));
  return (
    <form onSubmit={handleSubmit} className=' overflow-y-auto h-[300px] ' style={{scrollbarWidth:'none'}}>
     <h3 className='mb-5'>Project File Upload</h3>
      <div className='mb-5'>
        <FormItem label="Folder Name" >
        <Select
        name='folder_name'
        componentAs={CreatableSelect}
          options={clientOptions}
          onChange={(selectedOption) =>
            handleSelectChange(selectedOption, 'folder_name')
          }
          maxMenuHeight={200}
        
        />
        </FormItem>
      </div>

      <FormItem label="File">
                            <Upload
                            draggable
                                onChange={(files) => handleFileChange(files)}
                                multiple
                                onFileRemove={(file) => {
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        files: prevFormData.files.filter((f) => f !== file[0]),
                                    }))
                                  }
                                }
                                uploadLimit={1}
                            >
                                
                            </Upload>
                        </FormItem>
              <div className='flex justify-end'>

      <Button type="submit" variant='solid' loading={submit} block>{submit?'Submitting...':'Submit'}</Button>
      </div>
    </form>
  );
};

export default YourFormComponent;
