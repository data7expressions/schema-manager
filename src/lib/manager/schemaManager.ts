import { Schema, ISchemaCompleter, ISchemaExtender, ISchemaManager, ISchemaLoader, RefInfo } from '../model/schema'
import { Helper } from '.'
import { SchemaCompleter } from './schemaCompleter'
import { SchemaExtender } from './schemaExtender'
import { SchemaLoader } from './schemaLoader'

export class SchemaManagerBuilder {
	public build () : ISchemaManager {
		return new SchemaManager(new SchemaCompleter(), new SchemaExtender(), new SchemaLoader())
	}
}
export class SchemaManager implements ISchemaManager {
	private schemas:any = {}
	public completer: ISchemaCompleter
	public extender: ISchemaExtender
	public loader: ISchemaLoader
	constructor (completer: ISchemaCompleter, extender: ISchemaExtender, loader: ISchemaLoader) {
		this.completer = completer
		this.extender = extender
		this.loader = loader
	}

	private static _instance: ISchemaManager
	public static get instance (): ISchemaManager {
		if (!this._instance) {
			this._instance = new SchemaManagerBuilder().build()
		}
		return this._instance
	}

	public async load (value: string|Schema): Promise<Schema[]> {
		const list:Schema[] = []
		if (value === null || value === undefined || typeof value === 'boolean') {
			return [value]
		}
		let schema:Schema | undefined
		if (typeof value === 'string') {
			schema = this.schemas[value] as Schema | undefined
			if (!schema) {
				const loaded = await this.loader.load(value)
				if (!loaded) {
					throw Error(`The schema in ${value} not found`)
				}
				schema = this.normalize(loaded)
				if (schema.$id === undefined || typeof schema.$id !== 'string') {
					schema.$id = value
				}
				this.schemas[schema.$id] = schema
			}
		} else {
			if (value as Schema === undefined) {
				throw new Error('Parameter value is invalid')
			}
			schema = this.normalize(value)
			if (schema.$id === undefined || typeof schema.$id !== 'string') {
				schema.$id = Helper.obj.createKey(schema)
			}
			this.schemas[schema.$id] = schema
		}
		list.push(schema)
		const externalsRefs = this.externalRefs(schema)
		for (const externalsRef of externalsRefs) {
			const children = await this.load(externalsRef)
			list.push(...children)
		}
		return list
	}

	public add (value: Schema): Schema {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		}
		if (value as Schema === undefined) {
			throw new Error('Parameter value is invalid')
		}
		const schema = this.normalize(value)
		const externalRefs = this.externalRefs(schema)
		if (externalRefs.length > 0 && externalRefs.find(p => !Object.keys(this.schemas).includes(p)) !== undefined) {
			throw new Error(`External refs ${externalRefs.join(',')} were not previously loaded`)
		}
		if (schema.$id === undefined || typeof schema.$id !== 'string') {
			schema.$id = Helper.obj.createKey(schema)
		}
		this.schemas[schema.$id] = schema
		return schema
	}

	public get (key: string) : Schema | undefined {
		return this.schemas[key] as Schema | undefined
	}

	public list () : Schema[] {
		return Object.values(this.schemas)
	}

	public normalize (source: Schema): Schema {
		if (source === undefined || source === null) {
			throw new Error('source is empty')
		}
		if (typeof source !== 'object') {
			return source
		}
		const schema = Helper.obj.clone(source)
		this.extender.extend(schema)
		this.completer.complete(schema)
		return schema
	}

	public solve (value: string|Schema) : Schema {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		}
		if (typeof value === 'string') {
			const schema = this.get(value)
			if (schema === undefined) {
				throw new Error(`Schema ${value} not found`)
			}
			return schema
		}
		if (value as Schema === undefined) {
			throw new Error('Parameter value is invalid')
		}
		if (value.$id && typeof value.$id === 'string') {
			const schema = this.schemas[value.$id] as Schema | undefined
			if (schema) {
				return schema
			}
		}
		return this.add(value)
	}

	public solveRef (schema:Schema, ref:string): RefInfo {
		const externalRefs = this.externalRefs(schema)
		const isExternal = externalRefs.length > 0 && externalRefs.includes(ref)
		if (isExternal) {
			const keys = ref.split('#')
			const externalSchema = this.get(keys[0])
			if (externalSchema === undefined) {
				throw new Error(`Schema ${keys[0]} not found`)
			}
			if (keys.length === 1 || keys[1] === '/') {
				return { schema: externalSchema, referenced: externalSchema }
			} else {
				const path = keys[1].startsWith('/') ? keys[1].replace('/', '') : keys[1]
				const referenced = Helper.obj.jsonPath(externalSchema, path)
				return { schema: externalSchema, referenced: referenced }
			}
		} else if (ref === '#') {
			return { schema: schema, referenced: schema }
		} else {
			const path = ref.startsWith('#/') ? ref.replace('#/', '') : ref
			const referenced = Helper.obj.jsonPath(schema, path)
			return { schema: schema, referenced: referenced }
		}
	}

	public refs (schema: Schema):string[] {
		return Helper.obj.filter(schema, (value:any):boolean => {
			return value.$ref !== undefined && typeof value.$ref === 'string'
		}).map(p => p.$ref as string)
	}

	public externalRefs (schema: Schema):string[] {
		const ids = Helper.obj.filter(schema, (value:any):boolean => {
			return value.$id !== undefined && typeof value.$id === 'string' && value.$id.startsWith('http')
		}).map(p => p.$id)
		const refs = Helper.obj.filter(schema, (value:any):boolean => {
			return value.$ref !== undefined && typeof value.$ref === 'string' && value.$ref.startsWith('http')
		}).map(p => p.$ref)
		return refs.filter(p => !ids.includes(p))
	}
}
