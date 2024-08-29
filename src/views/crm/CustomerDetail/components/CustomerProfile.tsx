import {  useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useLocation } from 'react-router-dom'
import {
    Customer, Data, Project,
} from '../store'
import { DatePicker, Dialog, FormItem, Input, Notification, Select, Timeline, toast } from '@/components/ui'
import Cookies from 'js-cookie'
import { apiGetCrmSingleProjectEdit } from '@/services/CrmService'
import Progress from '../Project Progress/Activity'
import { HiOutlinePencil } from 'react-icons/hi'
import Report from '../Project Progress/Report'
import { useRoleContext } from '../../Roles/RolesContext'
import { AuthorityCheck } from '@/components/shared'


type CustomerInfoFieldProps = {
    title?: string
    value?: string
    onChange?: (value: string) => void
}

type CustomerProfileProps = {
    data: Customer
    report:any
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based in JavaScript
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

const CustomerInfoField = ({
    title,
    value,
}: CustomerInfoFieldProps) => {
    if (title === 'Project Id' || title === 'Project Type' || title === 'Project Start Date') {
        return (
            <div className='flex gap-1 mb-3 pt-1'>
            <span className='text-gray-700 dark:text-gray-200 font-semibold'>{title}:</span>
            <p className="" style={{overflowWrap:"break-word"}}>
            {value }
            </p>
        </div>
        );
    } else if (title === 'Description') {
        return (
            <div className='flex gap-1 mb-2 pt-1'>
            <span className='text-gray-700 dark:text-gray-200 font-semibold'>{title}:</span>
            <p className="" style={{overflowWrap:"break-word"}}>
            {value }
            </p>
        </div>
        );
    } else {
        return (
            <div className='flex gap-1 mb-2 pt-1'>
            <span className='text-gray-700 dark:text-gray-200 font-semibold'>{title}:</span>
            <p className="" style={{overflowWrap:"break-word"}}>
            {value }
            </p>
        </div>
        );
    }
};


interface ProjectUpdateData {
  user_id: string | null;
    project_id: string | null;
    project_budget: string;
    project_status:string;
    timeline_date:string;
    designer:string
  }
  const ProjectUpdate: React.FC<Data> = (data) => {
    const location=useLocation()
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('project_id');
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProjectUpdateData>({
      user_id:userId,
      project_id: projectId,
      timeline_date: new Date(data.data.timeline_date).toISOString().split('T')[0],
      project_budget: data.data.project_budget,
      project_status:data.data.project_status,
      designer:data.data.designer
    });
  
 
   
  
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    const handleDateChange = (date: Date | null) => {
      if (date) {
          date.setHours(date.getHours() + 5);
          date.setMinutes(date.getMinutes() + 30);
          setFormData({
              ...formData,
              timeline_date: date.toISOString().split('T')[0],
          });
      }
  };
  

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await apiGetCrmSingleProjectEdit(formData);
      const data=await response?.json()
      setLoading(false);
      if (data.errorMessage) {
        toast.push(
          <Notification closable type="danger" duration={2000}>
              {data.errorMessage}
          </Notification>
      )
    } else {
        toast.push(
            <Notification closable type="success" duration={2000}>
             Project Updated Successfully
          </Notification>
      )
      window.location.reload()
      }
    } catch (error) {
      setLoading(false);
      toast.push(
        <Notification closable type="danger" duration={2000}>
           Error updating project status
        </Notification>
    )
    }
  };
  


    const projectStatusOptions = [
      { value: 'completed', label: 'Completed' },
      { value: 'designing', label: 'Designing' },
      { value: 'executing', label: 'Executing' },
  ]
  
    return (
      <div>
        <form>
        <FormItem label="Timeline Date">
          <DatePicker
            value={new Date(formData.timeline_date)}
            onChange={handleDateChange}
          />
        </FormItem>
          <br />
          <FormItem label='Project Budget'>
            
            <Input
              type="text"
              name="project_budget"
              value={formData.project_budget}
              onChange={handleInputChange}
            />
          </FormItem>
          <FormItem label='Project Incharge'>
            
            <Input
              type="text"
              name="designer"
              value={formData.designer}
              onChange={handleInputChange}
            />
          </FormItem>
          <br />
          <FormItem>
            Project Status:
            <Select 
                        options={projectStatusOptions}
                        value={projectStatusOptions.find(
                            (option) =>
                                option.value === formData.project_status,
                        )}
                        onChange={(selectedOption) => {
                            setFormData({
                                ...formData,
                                project_status: selectedOption
                                    ? (
                                          selectedOption as {
                                              value: string
                                              label: string
                                          }
                                      ).value
                                    : '',
                            })
                          }}
                    />
          </FormItem>
          <br />
          <Button type="button" 
           variant='solid'
             onClick={handleUpdate}
             loading={loading}
           >
            {loading?"Updating...":"Update Project"}
          </Button>
        </form>
      </div>
    );
  };
  


const CustomerProfile = ({ data,report }: CustomerProfileProps) => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const {roleData} = useRoleContext()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }
    return (
      <div className='flex flex-col gap-5 lg:flex-row'>
        <Card className='lg:w-2/5'>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-row gap-4 justify-between">
                    <div className="flex xl:flex-row items-center gap-4">
                        <h4 className="font-bold capitalize">{data?.project_name}</h4>
                    </div>
                    <div className="mt-4 flex flex-col xl:flex-row gap-2">
                    <AuthorityCheck
                    userAuthority={[`${localStorage.getItem('role')}`]}
                    authority={roleData?.data?.project?.update??[]}
                    >
                    <Button variant="solid" onClick={() => openDialog()} size='sm' className='flex justify-center items-center gap-1'>
            <span>  <HiOutlinePencil/></span><span>  Edit</span>
            </Button>
            </AuthorityCheck>
                    </div>
                </div>
                <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
         <ProjectUpdate data={data}/>
            </Dialog>
                <div className=" mt-4 capitalize">
                    <CustomerInfoField title="Project Id" value={data?.project_id} />
                    <CustomerInfoField 
                        title="Project Type"
                        value={data?.project_type}
                    />
                      <CustomerInfoField
                        title="Client Name"
                        value={data?.client?data.client[0]?.client_name:""}
                    />
                      <CustomerInfoField
                        title="Client Email"
                        value={data?.client?data.client[0]?.client_email:""}
                    />
                      <CustomerInfoField
                        title="Client Contact"
                        value={data?.client?data.client[0]?.client_contact:""}
                    />

                    <CustomerInfoField
                        title="Project status"
                        value={data?.project_status}
                    />
                  
                  

                  
                    <CustomerInfoField
                        title="Project Start Date"
                        value={formatDate(data?.project_start_date)}
                    />
                    <CustomerInfoField
                        title="Project End Date"
                        value={formatDate(data?.timeline_date)}
                    />
                    <CustomerInfoField
                        title="Project Budget"
                        value={data?.project_budget}
                    />
                    <CustomerInfoField
                        title="Project Incharge"
                        value={data?.designer}
                    />
                    {data?.project_updated_by && data.project_updated_by.length>0 &&<>
                    <CustomerInfoField
                        title="Updated By"
                        value={data.project_updated_by.length > 0 ? data.project_updated_by[data.project_updated_by.length-1].username : ""}                    />
                    <CustomerInfoField
                        title="Updated Date"
                        value={formatDate(data?.project_updated_by.length>0?data?.project_updated_by[data.project_updated_by.length-1].updated_date:"")}
                    />
                    </>}
                </div>
                <div>
                    <p>
                        <span className='text-gray-700 dark:text-gray-200 font-semibold'>Description: </span>{data.description}
                    </p>
                </div>
            </div>
          
        </Card>
        <Report report={report}/>
      
        </div>
    )
}

export default CustomerProfile
