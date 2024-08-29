
import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import reducer, { getCustomer, useAppDispatch } from './store'
import { injectReducer } from '@/store'
import useQuery from '@/utils/hooks/useQuery'
import LeadForm from './components/LeadForm'
import { Button, Card, Dialog, Dropdown, Skeleton, Steps, Tabs } from '@/components/ui'
import CustomerProfile from './components/LeadProfile'
import { apiGetCrmLeadsDetails } from '@/services/CrmService'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import Contract from '../CustomerDetail/components/Contract'
import { GoChevronDown } from 'react-icons/go'
import FollowDetails from './components/Follow-UpDetails'
import EditLead from './components/EditLead'
import LeadActivity from './components/LeadActivity'
import { Link } from 'react-router-dom'
import { AuthorityCheck } from '@/components/shared'
import { useRoleContext } from '../Roles/RolesContext'

injectReducer('crmCustomerDetails', reducer)

const CustomerDetail = () => {
    const dispatch = useAppDispatch()

    const query = useQuery()

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = () => {
        const id = query.get('lead_id')
        if (id) {
            dispatch(getCustomer({ id }))
        }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    const [details, setDetails] = useState<any | null>(null);
    const role=localStorage.getItem('role')
    const [loading,setLoading]=useState(true)
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [dialogIsOpen1, setIsOpen1] = useState(false)

    const openDialog1 = () => {
        setIsOpen1(true)
    }
  
    const onDialogClose1 = () => {
        
        setIsOpen1(false)
    }

    const openDialog = () => {
        setIsOpen(true)
    }
  
    const onDialogClose = () => {
        
        setIsOpen(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetCrmLeadsDetails(myParam);
                setLoading(false)
                setDetails(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [myParam]);
    
    const lead = details?.data?.[0];
    const {roleData}=useRoleContext()
    const contractAccess = roleData?.data?.contract?.read?.includes(`${localStorage.getItem('role')}`)
    
    const Toggle =
   
     <Button variant='solid' size='sm' className='flex justify-center items-center gap-2'>
        <span>Actions</span><span><GoChevronDown/></span></Button>
      return (
        <>    
        <div className='flex justify-between'>
        <h3 className='pb-5'>Lead-{lead?.name || <Skeleton/>}</h3>
        <div>
            <Dropdown renderTitle={Toggle} placement='middle-end-top'>
                    <AuthorityCheck
                    userAuthority={[`${localStorage.getItem('role')}`]}
                    authority={roleData?.data?.lead?.update??[]}
                    >
                <Dropdown.Item eventKey="c" onClick={()=>openDialog()}><div >Edit Lead</div></Dropdown.Item>
                <Dropdown.Item eventKey="a" onClick={()=>openDialog1()}><div >Add Follow-Up</div></Dropdown.Item>
                </AuthorityCheck>
                <AuthorityCheck
                    userAuthority={[`${localStorage.getItem('role')}`]}
                    authority={roleData?.data?.contract?.create??[]}
                    >
                <Dropdown.Item eventKey="b"><Link to={`/app/crm/contract?lead_id=${myParam}`}>Create Contract</Link></Dropdown.Item>
                </AuthorityCheck>
            </Dropdown>
        </div>
        </div>

        <Card className='mb-5'>
            <Steps current={lead?.lead_status==='Inactive'?1:(lead?.lead_status==='Follow Up' || lead?.lead_status==='No Response' || lead?.lead_status==='Not Contacted')?2:(lead?.lead_status==='Interested' )?3:lead?.lead_status==='contract'?4:lead?.lead_status==='project'?5:1}
             className=' overflow-x-auto'
             status={lead?.lead_status==='Inactive'?'error':lead?lead.lead_status==='No Response'?'error':lead?.lead_status==='Not Contacted'?'error':lead?.lead_status==='Follow Up'?'in-progress':lead.lead_status==='Interested'?'in-progress':lead.lead_status==='Contract'?'in-progress':lead.lead_status==='Project'? 'complete':'in-progress':'in-progress'}
             >
                <Steps.Item title="Lead Created" />
                <Steps.Item title={lead?.lead_status==='Inactive'?"Inactive":"Following Up"} />
                <Steps.Item title={lead?.lead_status==='No Response'?'No Response':lead?.lead_status==='Not Contacted'?'Not Contacted':"Interested"} />
                <Steps.Item title="Contract" />
                <Steps.Item title="Project" />
            </Steps>
        </Card>
        <div className='flex gap-5 xl:flex-row flex-col'>
        <CustomerProfile data={lead} />
        <Card className='xl:w-3/5 ' >
        <Tabs defaultValue="Actions">
                <TabList>
                    <TabNav value="Actions" >
                        Follow-Ups
                    </TabNav>
                   {contractAccess &&
                    <TabNav value="Contract" >
                        Contract
                    </TabNav>}
                    {['ADMIN'].includes(localStorage.getItem('role') || '') &&
                    <TabNav value="Activity" >
                        Lead Activity
                    </TabNav>
}
                </TabList>
                <div className="p-4">
                    <TabContent value="Actions">
                    <FollowDetails details={details}/>
                        
                       
                    </TabContent>
                    <TabContent value="Contract">
                        <Contract/>
                    </TabContent>
                    <TabContent value="Activity">
                        <LeadActivity details={details}/>
                    </TabContent>
                    </div>
                </Tabs>
        </Card>
        </div>

          {/* <Tabs defaultValue="Details">
                <TabList>
                    <TabNav value="Details">
                        Details
                    </TabNav>
                    <TabNav value="Actions" >
                        Actions
                    </TabNav>
                    {role!=='Project Architect' &&
                    <TabNav value="Contract" >
                        Contract
                    </TabNav>}
                </TabList>
                <div className="p-4">
                    <TabContent value="Details">
                    <CustomerProfile data={lead}/>
                    </TabContent>
                    <TabContent value="Actions">
                    <Card className='mt-5' >
                       <LeadForm data={lead}/>
                       </Card>
                    </TabContent>
                    <TabContent value="Contract">
                        <Contract/>
                    </TabContent>
                    </div>
                </Tabs>
               */}

<Dialog
    isOpen={dialogIsOpen1}
    onClose={onDialogClose1}
    onRequestClose={onDialogClose1}
><LeadForm/></Dialog>
<Dialog
    isOpen={dialogIsOpen}
    onClose={onDialogClose}
    onRequestClose={onDialogClose}
><EditLead details={details}/></Dialog>


          </>

      );
 
};


export default CustomerDetail