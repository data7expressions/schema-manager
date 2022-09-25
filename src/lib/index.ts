import { Schema, RefInfo } from './model/schema'
import { SchemaManager } from './manager/schemaManager'
export * from './model/schema'
export * from './manager'

export const schemas = SchemaManager.instance

export const add = (value: Schema): Schema => {
	return schemas.add(value)
}

export const load = async (value: string|Schema): Promise<Schema[]> => {
	return schemas.load(value)
}

export const get = (key: string): Schema | undefined => {
	return schemas.get(key)
}

export const list = (): Schema[] => {
	return schemas.list()
}

export const solve = (value: string|Schema): Schema => {
	return schemas.solve(value)
}

export const normalize = (source: Schema): Schema => {
	return schemas.normalize(source)
}

export const refs = (source: Schema): string[] => {
	return schemas.refs(source)
}

export const externalRefs = (source: Schema): string[] => {
	return schemas.externalRefs(source)
}

export const solveRef = (schema:Schema, ref:string): RefInfo => {
	return schemas.solveRef(schema, ref)
}
