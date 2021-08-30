import {
  additional_info_busan,
  prisma,
  Prisma,
  PrismaClient,
  PrismaPromise,
  UnwrapTuple,
} from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error', 'query'],
  errorFormat: 'pretty',
})

type FindManyWhereArg<T extends Delegate> = Parameters<T['findMany']>[0]['where']
type FindFirstWhereArg<T extends Delegate> = Parameters<T['findFirst']>[0]['where']
type CreateDataArg<T extends Delegate> = Parameters<T['create']>[0]['data']
type UpdateDataArg<T extends Delegate> = Parameters<T['update']>[0]['data']
type DeleteDateArg<T extends Delegate> = Parameters<T['delete']>[0]['where']
type Dict = { [k: string]: any }

type DictWithId = {
  id?: number
  [k: string]: any
}

type SelectWithId = {
  id?: boolean
  [k: string]: any
}

type Delegate = {
  findMany: (arg: {
    select?: SelectWithId | null
    include?: Dict | null
    where?: Dict
    orderBy?: Prisma.Enumerable<any>
    cursor?: Dict
    take?: number
    skip?: number
    distinct?: Prisma.Enumerable<any>
  }) => any

  findFirst: (arg: {
    select?: SelectWithId | null
    rejectOnNotFound?: Prisma.RejectOnNotFound
    include?: Dict | null
    where?: DictWithId
    orderBy?: Prisma.Enumerable<any>
    cursor?: Dict
    take?: number
    skip?: number
    distinct?: Prisma.Enumerable<any>
  }) => any

  create: (arg: { select?: SelectWithId | null; include?: Dict | null; data: any }) => any

  update: (arg: {
    select?: SelectWithId | null
    include?: Dict | null
    data: any
    where: DictWithId
  }) => any

  delete: (arg: { select?: SelectWithId | null; include?: Dict | null; where: DictWithId }) => any

  [k: string]: any
}

abstract class DaoManager<T extends Delegate> {
  abstract get delegate(): T

  getMany(where: FindManyWhereArg<T>) {
    return this.delegate.findMany({ where })
  }

  getOne(where: FindFirstWhereArg<T>) {
    return this.delegate.findFirst({ where })
  }

  create(data: CreateDataArg<T>) {
    return this.delegate.create({ data })
  }

  update(id: number, data: UpdateDataArg<T>) {
    return this.delegate.update({ data, where: { id } })
  }

  delete(id: number) {
    return this.delegate.delete({ where: { id } })
  }
}
