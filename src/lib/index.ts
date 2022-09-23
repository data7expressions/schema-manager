import { Schema } from './model/schema'
import { SchemaManager } from './manager/schemaManager'
export * from './model/schema'
export * from './manager'

export const manager = SchemaManager.instance

export const add = (value: Schema): Schema => {
	return manager.add(value)
}

export const load = async (value: string|Schema): Promise<Schema> => {
	return manager.load(value)
}

export const get = (key: string): Schema => {
	return manager.get(key)
}

export const solve = (value: string|Schema): Schema => {
	return manager.solve(value)
}

export const externalRefs = (schema: Schema): string[] => {
	return manager.externalRefs(schema)
}

export const normalize = (source: Schema): Schema => {
	return manager.normalize(source)
}
