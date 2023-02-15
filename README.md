# @nestlike/adminjs-fastify

This package provides a [NestJS](https://nestjs.com) module for adding [AdminJS](https://adminjs.co) to applications running on a
fastify server which is currently not supported by the offical [AdminJS package](https://github.com/SoftwareBrothers/adminjs-nestjs).

## Installation

First you must install the package and it's peer dependencies.

```bash
npm i @adminjs/fastify @nestlike/adminjs-fastify adminjs
```

After that you should also install a database adapter. You can find more information about that and available adapters in the offical
[AdminJS documentation](https://docs.adminjs.co/installation/adapters).

Let's assume you use TypeORM as described in the [NestJS documentation](https://docs.nestjs.com/techniques/database).

```bash
npm i @adminjs/typeorm
```

## Configuration

Now you can configure the module and import it in your application. In a new application created with the NestJS CLI that could look like the following.

```ts
import AdminJSTypeorm from '@adminjs/typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '@nestlike/adminjs-fastify';
import AdminJS from 'adminjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';

AdminJS.registerAdapter(AdminJSTypeorm);

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password'
};

// Later you want to change this function to something that looks up admin users in your database.
async function authenticate(email: string, password: string) {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return DEFAULT_ADMIN;
    }

    return null;
}

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'test',
            synchronize: true
            autoLoadEntities: true
        }),
        AdminModule.forRoot({
            adminJsOptions: {
                rootPath: '/admin'
            },
            auth: {
                authenticate,
                cookieName: 'adminjs',
                cookiePassword: 'secret'
            },
            // These options are passed to @fastify/session.
            sessionOptions: {
                saveUninitialized: true,
                secret: 'secret',
                cookie: {
                    httpOnly: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production'
                }
            }
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }

```

The above configuration does not provide a session store instance to [@fastify/session](https://github.com/fastify/session). Make sure you provide
one when using you application in a production environment.

## Adding Resources

After the module is configured you can add resources to AdminJS in your entity modules.

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '@nestlike/adminjs-fastify';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AdminModule.forFeature([User])
    ],
    controllers: [
        UsersController
    ],
    providers: [
        UsersService
    ]
})
export class UsersModule { }

```

More information about customizing your resources can be found in the official [AdminJS documentation](https://docs.adminjs.co/basics/resource).

## Running

Finally you can start your application.

```bash
nest start
```

The AdminJS panel will be available under `http://localhost:3000/admin`.