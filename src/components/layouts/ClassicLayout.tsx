import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import Search from '@/components/template/Search'
import LanguageSelector from '@/components/template/LanguageSelector'
import Notification from '@/components/template/Notification'
import SidePanel from '@/components/template/SidePanel'
import MobileNav from '@/components/template/MobileNav'
import UserDropdown from '@/components/template/UserDropdown'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import { UserDetailsProvider } from '@/views/Context/userdetailsContext'
import { RoleProvider } from '@/views/crm/Roles/RolesContext'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
            <Search />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
           
            <Notification />
            <SidePanel />
            
            <UserDropdown hoverable={false} />
            
        </>
    )
}

const ClassicLayout = () => {
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <UserDetailsProvider>
                <RoleProvider>

               
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <div className="h-full flex flex-auto flex-col">
                        
                        <View />
                    </div>
                </div>
                        </RoleProvider>
                        </UserDetailsProvider>
            </div>
        </div>
    )
}

export default ClassicLayout
