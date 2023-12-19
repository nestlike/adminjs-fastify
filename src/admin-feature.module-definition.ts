import { ConfigurableModuleBuilder } from '@nestjs/common';
// @ts-expect-error type-only import
import type { ResourceWithOptions } from 'adminjs';

export type AdminModuleResources = (ResourceWithOptions | any)[];

export const { ConfigurableModuleClass: AdminFeatureModuleClass, MODULE_OPTIONS_TOKEN: ADMIN_MODULE_RESOURCES }
    = new ConfigurableModuleBuilder<AdminModuleResources>({ moduleName: 'AdminFeature' })
        .setClassMethodName('forFeature')
        .build();
