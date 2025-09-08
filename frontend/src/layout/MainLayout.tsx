import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";


const MainLayout = () => {
    const isMobile = false;
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction={"horizontal"} className="flex-1 flex h-full overflow-hidden p-2">
        {/* left Slidebar */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
            <LeftSideBar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg trinsition-colors " />
        {/* Main Content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
            <Outlet />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg trinsition-colors " />

        {/* Right Slidebar */}
        <ResizablePanel defaultSize={20} minSize={ 0 } maxSize={25} collapsedSize={0}>
            Friends activity
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default MainLayout
