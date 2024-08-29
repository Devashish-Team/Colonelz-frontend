import { apiGetRoleList, apiGetRoleWiseDetails } from '@/services/CommonService';
import React, { createContext, useContext, useState, useEffect } from 'react';

type RoleAccessPermissions = {
    read?: string[];
    create?: string[];
    update?: string[];
    delete?: string[];
    restore?: string[];
  };
  
  type ModuleNames = 
    | "user"
    | "lead"
    | "project"
    | "task"
    | "file"
    | "mom"
    | "archive"
    | "contract"
    | "quotation"
    | "addMember"
    | "role"
    |"userArchive"
    | "companyData";
  
  type RoleAccessData = {
    message: string;
    status: boolean;
    errorMessage: string;
    code: number;
    data: {
      [key in ModuleNames]?: RoleAccessPermissions;
    };
  };

// Define the context's shape
interface RoleContextType {
    roleData: RoleAccessData;
    rolelist:RoleList;
    fetchRoleData: () => Promise<void>;
}
type RoleList={
        data:string[]
}


// Create the context
export const RoleContext = createContext<RoleContextType >(undefined!);

// Provide the context
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roleData, setRoleData] = useState<RoleAccessData >(undefined!);
    const [rolelist, setRoleList] = useState<RoleList>({data:["ADMIN"]});

    const fetchRoleData = async () => {
        try {
            const data = await apiGetRoleWiseDetails(); 
            const response=await apiGetRoleList();
            console.log(response);
            
            if(response.code===200){
                setRoleList(response)
            }

            if (data.status) {
                setRoleData(data);
            }
        } catch (error) {
            console.error('Failed to fetch role data:', error);
        }
    };

    useEffect(() => {
        fetchRoleData();
    }, []);

    return (
        <RoleContext.Provider value={{ roleData, fetchRoleData,rolelist }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRoleContext = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRoleContext must be used within a RoleProvider');
    }
    return context;
};
