import { Inject, Module } from '@nestjs/common';

import { AdminFeatureModuleClass, AdminModuleResources, ADMIN_MODULE_RESOURCES } from './admin-feature.module-definition';

class ResourceCollector {

    public resources: Promise<AdminModuleResources> = Promise.resolve([]);

    private counter = 0;

    private resolve: (value: AdminModuleResources) => void;

    private _resources: AdminModuleResources = [];

    public register() {
        if (this.counter === 0) {
            this.resources = new Promise(resolve => this.resolve = resolve);
        }

        this.counter++;
    }

    public add(resources: AdminModuleResources) {
        this._resources.push(...resources);

        this.counter--;

        if (this.counter === 0) {
            this.resolve(this._resources);
        }
    }

}

export const resourceCollector = new ResourceCollector();

@Module({})
export class AdminFeatureModule extends AdminFeatureModuleClass {

    constructor(
        @Inject(ADMIN_MODULE_RESOURCES)
        resources: AdminModuleResources
    ) {
        super();
        resourceCollector.add(resources);
    }

}
