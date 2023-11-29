import * as bcrypt from 'bcrypt'
import prisma from '../../db'
import type { User, Prisma } from '@prisma/client'

prisma.$extends({
    model: {
        user: {},
    },
})

export function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    })
}

export function findUserWithRolesByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
        include: { roles: { include: { role: true } } },
    })
}

export function createUserByEmailAndPassword(user: Prisma.UserCreateInput) {
    user.password = bcrypt.hashSync(user.password, 12)
    return prisma.user.create({
        data: user,
    })
}

export function findUserById(id: User['id']) {
    return prisma.user.findUnique({
        where: {
            id,
        },
    })
}

export function findUserWithRolesById(id: User['id']) {
    return prisma.user.findUnique({
        where: {
            id,
        },
        include: { roles: { include: { role: true } } },
    })
}
