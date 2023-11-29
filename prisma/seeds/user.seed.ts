import type { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import seederData from "./seederData.json"

interface Role {
    name: string
}

interface User {
    email: string
    password: string
    roles: string[]
}

export default async function seedUser(prisma: PrismaClient) {
    const roles = await Promise.all(seederData.roles.map(async (role: Role) => {
        const newRole = await prisma.role.create({
            data: {
                name: role.name
            }
        })
        return newRole
    }))

    const users = await Promise.all(seederData.users.map(async (user: User) => {
        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                password: await bcrypt.hash(user.password, 12),
                roles: {
                    create: roles.filter((e) => user.roles.includes(e.name)).map(({id}) => ({ roleId: id }))
                }
            },
            include: { roles: { include: {role: true }}}
        })
       
        return newUser
    }))

    //console.log(`Inserted roles: \n ${JSON.stringify(roles, null, 2)} \nInserted users: \n ${JSON.stringify(users, null, 2)}`)
}
