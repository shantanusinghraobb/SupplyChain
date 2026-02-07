import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Topbar />
      <Sidebar />
      <div style={{ marginLeft: 260, marginTop: 80, padding: 20 }}>
        {children}
      </div>
    </>
  );
}
