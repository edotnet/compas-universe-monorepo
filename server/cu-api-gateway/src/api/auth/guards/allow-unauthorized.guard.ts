import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNATHORIZED = 'allow-unauthorized';

export const AllowUnauthorized = () => SetMetadata(ALLOW_UNATHORIZED, true);
