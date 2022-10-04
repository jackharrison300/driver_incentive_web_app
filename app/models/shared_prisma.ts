import { Prisma } from '@prisma/client'

export type UserWithSponsorWithCompany = Prisma.UserGetPayload<{
  include: { sponsor: { include: { company: true }}}
}>

export type UserWithDriverWithCompany = Prisma.UserGetPayload<{
  include: { driver: { include: { company: true }}}
  }>