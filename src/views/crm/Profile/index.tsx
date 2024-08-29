import { Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import React, { useContext } from 'react'
import Profile from './profile'
import Password from './passsword'
import Users from '../users'
import { UserDetailsContext, UserDetailsProvider } from '@/views/Context/userdetailsContext'
import Roles from './Roles'
import { useRoleContext } from '../Roles/RolesContext'
import { AuthorityCheck } from '@/components/shared'
import ArchivedUsers from '../users/ArchivedUsers'

const Index = () => {
    const userRole=localStorage.getItem('role') || ''
    const {roleData}=useRoleContext()
    const data = useContext(UserDetailsContext);
    console.log(data);
    
    const userAccess=roleData?.data?.user?.read?roleData?.data?.user?.read.includes(userRole):false
    const roleAccess=roleData?.data?.role?.read?roleData?.data?.role?.read.includes(userRole):false
    const archivedAccess=roleData?.data?.userArchive?.read?roleData?.data?.userArchive?.read.includes(userRole):false
    

    
  return (<div className='px-4'>
    <h3 className='mb-5'>My Profile</h3>
    <Tabs defaultValue="profile">
    <TabList>
        <TabNav value="profile">Profile</TabNav>
        <TabNav value="pass">Password</TabNav>
       {userAccess &&
         <TabNav value="users">Users</TabNav>
       }
      {roleAccess &&
        <TabNav value="roles">Roles</TabNav>
        }
      {archivedAccess &&
         <TabNav value="archived">Archived Users</TabNav>
         }
    </TabList>
    <div className="p-4">
        <TabContent value="profile">
        <Profile data={data}/>
        </TabContent>
        <TabContent value="pass">
            <Password/>
        </TabContent>
        <TabContent value="users">
           <Users/>
        </TabContent>
        <TabContent value="roles">
           <Roles/>
        </TabContent>
        <TabContent value="archived">
           <ArchivedUsers/>
        </TabContent>
    </div>
</Tabs>
</div>
  )
}

export default Index