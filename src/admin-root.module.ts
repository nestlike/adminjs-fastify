import AdminJSFastify from '@adminjs/fastify';
import { Module, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import AdminJS from 'adminjs';
import { FastifyInstance } from 'fastify';

import { resources } from './admin-feature.module';
import { AdminModuleOptions, AdminRootModuleClass, ADMIN_MODULE_OPTIONS } from './admin-root.module-definition';

@Module({})
export class AdminRootModule extends AdminRootModuleClass implements OnModuleInit {

    constructor(
        @Inject(ADMIN_MODULE_OPTIONS)
        private options: AdminModuleOptions,
        private httpAdapterHost: HttpAdapterHost
    ) {
        super();
    }

    public async onModuleInit(): Promise<void> {
        const { adminJSOptions, auth, sessionOptions } = this.options;

        if (resources.length) {
            adminJSOptions.resources = adminJSOptions.resources
                ? [
                    ...adminJSOptions.resources,
                    ...resources
                ]
                : resources;
        }

        const adminJS = new AdminJS(adminJSOptions);

        await this.httpAdapterHost.httpAdapter.getInstance<FastifyInstance>().register(async fastifyApp => {
            fastifyApp.removeContentTypeParser('application/x-www-form-urlencoded');
            await AdminJSFastify.buildAuthenticatedRouter(adminJS, auth, fastifyApp, sessionOptions);
        });

        new Logger('AdminModule').log(`Setup adminJS at ${ adminJS.options.rootPath }`);
    }

}
