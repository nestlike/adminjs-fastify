import { Logger, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance } from 'fastify';

import { resourceCollector } from './admin-feature.module';
import { AdminModuleOptions, AdminRootModuleClass, ADMIN_MODULE_OPTIONS } from './admin-root.module-definition';

@Module({
    providers: [
        {
            provide: 'ADMIN_JS',
            inject: [ADMIN_MODULE_OPTIONS, HttpAdapterHost],
            async useFactory(options: AdminModuleOptions, httpAdapterHost: HttpAdapterHost) {
                const resources = await resourceCollector.resources;
                const adminJSOptions = options.adminJsOptions || {};

                if (resources.length) {
                    adminJSOptions.resources = adminJSOptions.resources
                        ? [
                            ...adminJSOptions.resources,
                            ...resources
                        ]
                        : resources;
                }

                const AdminJS = (await import('adminjs')).AdminJS;
                const admin = new AdminJS(adminJSOptions);

                await httpAdapterHost.httpAdapter.getInstance<FastifyInstance>().register(async fastifyApp => {
                    const AdminJSFastify = await import('@adminjs/fastify');
                    const { auth, sessionOptions } = options;

                    if (auth) {
                        await AdminJSFastify.buildAuthenticatedRouter(admin, auth, fastifyApp, sessionOptions);
                    } else {
                        await AdminJSFastify.buildRouter(admin, fastifyApp);
                    }
                });

                new Logger('AdminModule').log(`Setup adminJS at ${ admin.options.rootPath }`);

                return admin;
            }
        }
    ],
    exports: [
        'ADMIN_JS'
    ]
})
export class AdminRootModule extends AdminRootModuleClass { }
