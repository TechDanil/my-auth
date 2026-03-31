import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@prisma/__generated__/client";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard, RolesGuard } from "../guard";

export const Authorization = (...roles: Role[]) => {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
};
