import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import CustomerProfile from './components/CustomerProfile'
import { injectReducer, setUser } from '@/store'
import useQuery from '@/utils/hooks/useQuery'
import MOM from './components/MOM/Mom'
import { Skeleton, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import { useLocation, useNavigate } from 'react-router-dom'
import AllMom from './components/MOM/AllMom'
import {  apiGetCrmProjectsTaskData, apiGetCrmSingleProjectQuotation, apiGetCrmSingleProjectReport, apiGetCrmSingleProjects, apiGetUsersList } from '@/services/CrmService'
import { FileItem } from '../FileManager/Components/Project/data'
import Index from './Quotation'
import { MomProvider } from './store/MomContext'
import { ProjectProvider } from '../Customers/store/ProjectContext'
import Task from './Task/index'
import Activity from './Project Progress/Activity'
import Timeline from './Timeline/Timeline'
import { AuthorityCheck } from '@/components/shared'
import { useRoleContext } from '../Roles/RolesContext'
import { Tasks } from './store'


const CustomerDetail = () => {
    const query = useQuery()
    const [loading, setLoading] = useState(true);
    interface QueryParams {
        id: string;
        project_id: string;
        mom:string
      
      }
    const [fileData,setFileData]=useState<FileItem[]>();
    const navigate = useNavigate();
    const location = useLocation();
    const role=localStorage.getItem('role');
    const {roleData} = useRoleContext();
    const queryParams = new URLSearchParams(location.search);
    const allQueryParams: QueryParams = {
      id: queryParams.get('id') || '',
      project_id: queryParams.get('project_id') || '',
      mom: queryParams.get('type') || '',
    };
    const [details, setDetails] = useState<any | null>(null);
    const[momdata,setmomdata]= useState<any >(null);
    const [task,setTaskData]=useState<Tasks[]>([])
    const [report,setReport]=useState<any>()
    const [users,setUsers]=useState<any>()
    const quotationAccess = roleData?.data?.quotation?.read?.includes(`${localStorage.getItem('role')}`)
    const momAccess = roleData?.data?.mom?.read?.includes(`${localStorage.getItem('role')}`)
    const taskAccess = roleData?.data?.task?.read?.includes(`${localStorage.getItem('role')}`)

    const handleTabChange = (selectedTab:any) => {
      const currentUrlParams = new URLSearchParams(location.search);
      currentUrlParams.set('type', selectedTab);
      navigate(`${location.pathname}?${currentUrlParams.toString()}`);
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetCrmSingleProjects(allQueryParams.project_id);
                
                const Report = await apiGetCrmSingleProjectReport(allQueryParams.project_id);
                const list=await apiGetUsersList(allQueryParams.project_id)
                const data = response
                setDetails(data.data[0]);
                setLoading(false);
                setmomdata(data.data[0].mom)
                
                setReport(Report)
                setUsers(list.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDataAndLog = async () => {
          try {
            const leadData = await apiGetCrmSingleProjectQuotation(allQueryParams.project_id)
           setFileData(leadData.data)
          } catch (error) {
            console.error('Error fetching lead data', error);
          }
        };
    
        fetchDataAndLog();
      }, []);
    useEffect(() => {
        const fetchDataAndLog = async () => {
          try {
            const taskResponse = await apiGetCrmProjectsTaskData(allQueryParams.project_id);
            setTaskData(taskResponse.data)
          } catch (error) {
            console.error('Error fetching lead data', error);
          }
        };
    
        fetchDataAndLog();
      }, []);

      
      return (
        <>
        <h3 className='pb-5'>Project-{loading?<Skeleton width={100}/>:details?details.project_name:""}</h3>
        <div>
          <ProjectProvider>
       
{loading?<Skeleton height={400}/>:
          <Tabs defaultValue={allQueryParams.mom} onChange={handleTabChange}>
            <TabList>
                <TabNav value="details">Details</TabNav>
                {quotationAccess&&
                  <TabNav value="Quotation">Quotation</TabNav>
                }
                  <>
                 {momAccess&&
                    <TabNav value="mom" >MOM</TabNav>
                 }
                 {taskAccess&&
                    <TabNav value="task">Task Manager</TabNav>
                 }
                    <AuthorityCheck
                    userAuthority={[`${localStorage.getItem('role')}`]}
                    authority={['ADMIN']}
                    >
                    <TabNav value="activity">Project Activity</TabNav>
                    </AuthorityCheck>
                   {taskAccess &&
                    <TabNav value="timeline">Timeline</TabNav>
                    } 
                  </>
              
            </TabList>
            <div className="p-4">
                <TabContent value="details">
                  {loading ? <Skeleton width={150}/> :
                    <Container>
                        <CustomerProfile data={details} report={report}/>
                    </Container>}
                </TabContent>
                <TabContent value="Quotation">
                  <Index data={fileData }/>
                </TabContent>
                <TabContent value="mom">
                  <MOM data={details} />
                </TabContent>
              
                <TabContent value="task">
                  <Task task={task} users={users}/>
                </TabContent>
                <TabContent value="activity">
                  <Activity Data={details} />
                </TabContent>
                <TabContent value="timeline">
                  <Timeline/>
                </TabContent>

            </div>
        </Tabs>}
        </ProjectProvider>
    </div>
    </>);
 
};


export default CustomerDetail
