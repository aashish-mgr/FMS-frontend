export type Permission =
  | "income:delete"
  | "expense:delete"
  | "audit:read"
  | "workspace:update"
  | "member:read"
  | "member:invite"
  | "member:update"
  | "member:remove"
  | "invitation:read"
  | "invitation:revoke";

const ADMIN_ROLES = ["admin", "superAdmin"] as const;

const ACCOUNTANT_PERMISSIONS: Permission[] = ["member:read"];

export function isAdminRole(roles: string[]): boolean {
  return roles.some((role) =>
    (ADMIN_ROLES as readonly string[]).includes(role)
  );
}

export function can(roles: string[], permission: Permission): boolean {
  if (isAdminRole(roles)) {
    return true;
  }

  if (roles.includes("accountant")) {
    return ACCOUNTANT_PERMISSIONS.includes(permission);
  }

  return false;
}
