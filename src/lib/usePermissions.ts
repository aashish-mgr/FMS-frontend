import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  can as canPermission,
  isAdminRole,
  type Permission,
} from "./permissions";

export function usePermissions() {
  const user = useSelector((state: RootState) => state.auth.user);
  const roles = user?.roles?.length
    ? user.roles
    : user?.role
      ? [user.role]
      : [];

  return {
    roles,
    isAdmin: isAdminRole(roles),
    can: (permission: Permission) => canPermission(roles, permission),
  };
}
