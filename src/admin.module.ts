import { ConfigurableModuleAsyncOptions, DynamicModule, Module } from '@nestjs/common';
// @ts-expect-error type-only import
import type { ResourceWithOptions } from 'adminjs';
import { AdminFeatureModule, resourceCollector } from './admin-feature.module';

import { AdminRootModule } from './admin-root.module';
import { AdminModuleOptions } from './admin-root.module-definition';

@Module({})
export class AdminModule {

    public static forRoot(options: AdminModuleOptions): DynamicModule {
        return {
            module: AdminModule,
            global: true,
            imports: [
                AdminRootModule.forRoot(options)
            ]
        }
    }

    public static forRootAsync(asyncOptions: ConfigurableModuleAsyncOptions<AdminModuleOptions, 'create'>): DynamicModule {
        return {
            module: AdminModule,
            global: true,
            imports: [
                AdminRootModule.forRootAsync(asyncOptions)
            ]
        }
    }

    public static forFeature(resources: (ResourceWithOptions | any)[]): DynamicModule {
        resourceCollector.register();

        return {
            module: AdminModule,
            imports: [
                AdminFeatureModule.forFeature(resources)
            ]
        }
    }

    public static forFeatureAsync(asyncResources: ConfigurableModuleAsyncOptions<(ResourceWithOptions | any)[], 'create'>): DynamicModule {
        resourceCollector.register();

        return {
            module: AdminModule,
            imports: [
                AdminFeatureModule.forFeatureAsync(asyncResources)
            ]
        }
    }

}
