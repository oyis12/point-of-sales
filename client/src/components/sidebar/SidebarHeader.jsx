import { IoPersonCircleSharp } from "react-icons/io5";

export const SidebarHeader = ({ profile }) => {
  return (
    <div className="sidebar__header bg-red-900">
      <div className="sb__header-top flex items-center justify-around">
        <IoPersonCircleSharp className="sb__hd-icon" />
        <h3>
          {profile?.full_name}
        </h3>
      </div>
    </div>
  );
};
