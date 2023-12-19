import { FastifySessionOptions } from '@fastify/session';
import { ConfigurableModuleBuilder } from '@nestjs/common';
// @ts-expect-error type-only import
import type { AdminJSOptions } from 'adminjs';
// @ts-expect-error type-only import
import type { AuthenticationOptions } from '@adminjs/fastify';

export interface AdminModuleOptions {
    adminJsOptions?: AdminJSOptions,
    auth?: AuthenticationOptions,
    sessionOptions?: FastifySessionOptions
}

export const { ConfigurableModuleClass: AdminRootModuleClass, MODULE_OPTIONS_TOKEN: ADMIN_MODULE_OPTIONS } = new ConfigurableModuleBuilder<AdminModuleOptions>({ moduleName: 'AdminRoot' })
    .setClassMethodName('forRoot')
    .build();
