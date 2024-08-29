import { Skeleton, Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import { MdManageAccounts } from "react-icons/md";
import TabNav from '@/components/ui/Tabs/TabNav'
import { GoRepoTemplate } from "react-icons/go";
import { LuFileStack } from "react-icons/lu";
import Leads from './Components/Leads';
import Projects from './Components/Projects';
import Template from './Components/Template';
import { DataProvider } from './FileManagerContext/FIleContext';
import { AuthorityCheck } from '@/components/shared';
import { useRoleContext } from '../Roles/RolesContext';
import { useState, useEffect } from 'react';

const FileManager = () => {
  const role = localStorage.getItem('role') || '';
  const { roleData } = useRoleContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (roleData) {
      setIsLoading(false);
    }
  }, [roleData]);

  if (isLoading) {
    return <div><Skeleton height={400}/></div>;
  }

  const hasProjectReadPermission = roleData?.data?.project?.read?.includes(role);
  const hasLeadReadPermission = roleData?.data?.lead?.read?.includes(role);

  return (
    <div>
      <Tabs 
        defaultValue={hasLeadReadPermission ? 'leads' : hasProjectReadPermission ? 'project' : 'company'}
      >
        <TabList>
          {hasLeadReadPermission &&
            <TabNav value="leads" icon={<MdManageAccounts />}>
              Leads
            </TabNav>
          }
          {hasProjectReadPermission &&
            <TabNav value="project" icon={<LuFileStack />}>
              Projects
            </TabNav>
          }
          <AuthorityCheck
            userAuthority={[`${localStorage.getItem('role')}`]}
            authority={roleData?.data?.companyData?.read ?? []}
          >
            <TabNav value="company" icon={<GoRepoTemplate />}>
              Company Data
            </TabNav>
          </AuthorityCheck>
        </TabList>
        <div className="p-4">
          <DataProvider>
            <TabContent value="leads">
              <Leads />
            </TabContent>
            <TabContent value="project">
              <Projects />
            </TabContent>
            <TabContent value="company">
              <Template />
            </TabContent>
          </DataProvider>
        </div>
      </Tabs>
    </div>
  );
}

export default FileManager;