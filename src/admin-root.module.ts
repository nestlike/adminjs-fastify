import AdminJSFastify from '@adminjs/fastify';
import { Logger, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import AdminJS from 'adminjs';
import { FastifyInstance } from 'fastify';

import { resourceCollector } from './admin-feature.module';
import { AdminModuleOptions, AdminRootModuleClass, ADMIN_MODULE_OPTIONS } from './admin-root.module-definition';

@Module({
    providers: [
        {
            provide: AdminJS,
            inject: [ADMIN_MODULE_OPTIONS, HttpAdapterHost],
            async useFactory(options: AdminModuleOptions, httpAdapterHost: HttpAdapterHost) {
                const { adminJSOptions, auth, sessionOptions } = options;
                const resources = await resourceCollector.resources;

                if (resources.length) {
                    adminJSOptions.resources = adminJSOptions.resources
                        ? [
                            ...adminJSOptions.resources,
                            ...resources
                        ]
                        : resources;
                }

                const adminJS = new AdminJS(adminJSOptions);

                await httpAdapterHost.httpAdapter.getInstance<FastifyInstance>().register(async fastifyApp => {
                    await AdminJSFastify.buildAuthenticatedRouter(adminJS, auth, fastifyApp, sessionOptions);
                });

                new Logger('AdminModule').log(`Setup adminJS at ${ adminJS.options.rootPath }`);

                return adminJS;
            }
        }
    ],
    exports: [
        AdminJS
    ]
})
export class AdminRootModule extends AdminRootModuleClass { }
