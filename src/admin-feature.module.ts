import { Module, Inject } from '@nestjs/common';

import { AdminFeatureModuleClass, AdminModuleResources, ADMIN_MODULE_RESOURCES } from './admin-feature.module-definition';

export const resources: AdminModuleResources = [];

@Module({})
export class AdminFeatureModule extends AdminFeatureModuleClass {

    constructor(
        @Inject(ADMIN_MODULE_RESOURCES)
        featureResources: AdminModuleResources
    ) {
        super();
        resources.push(...featureResources);
    }

}
