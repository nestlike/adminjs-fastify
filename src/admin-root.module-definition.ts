import { AuthenticationOptions } from '@adminjs/fastify';
import FastifySessionPlugin from '@fastify/session';
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AdminJSOptions } from 'adminjs';

export interface AdminModuleOptions {
    adminJSOptions?: AdminJSOptions,
    auth?: AuthenticationOptions,
    sessionOptions?: FastifySessionPlugin.Options
}

export const { ConfigurableModuleClass: AdminRootModuleClass, MODULE_OPTIONS_TOKEN: ADMIN_MODULE_OPTIONS } = new ConfigurableModuleBuilder<AdminModuleOptions>({ moduleName: 'AdminRoot' })
    .setClassMethodName('forRoot')
    .build();
