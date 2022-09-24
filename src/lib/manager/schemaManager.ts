import { Schema, ISchemaCompleter, ISchemaExtender, ISchemaManager, ISchemaLoader } from '../model/schema'
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
		let key:string
		if (typeof value === 'string') {
			schema = this.schemas[value] as Schema | undefined
			if (!schema) {
				const loaded = await this.loader.load(value)
				if (!loaded) {
					throw Error(`The schema in ${value} not found`)
				}
				schema = this.normalize(Helper.clone(loaded))
				key = schema.$id && typeof schema.$id === 'string' ? schema.$id : value
				this.schemas[key] = schema
			}
		} else {
			if (value as Schema === undefined) {
				throw new Error('Parameter value is invalid')
			}
			schema = this.normalize(Helper.clone(value))
			key = this.getKey(schema)
			this.schemas[key] = schema
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
		if (this.externalRefs(schema).length > 0) {
			throw new Error('You must use the load method, since it is required to load external schemas')
		}
		const key = this.getKey(schema)
		this.schemas[key] = schema
		return schema
	}

	private getKey (schema: Schema) {
		return schema.$id && typeof schema.$id === 'string' ? schema.$id : Helper.createKey(schema)
	}

	public get (key: string) : Schema {
		const schema = this.schemas[key] as Schema | undefined
		if (!schema) {
			throw Error(`The schema ${key} not found`)
		}
		return schema
	}

	public list () : Schema[] {
		return Object.values(this.schemas)
	}

	public solve (value: string|Schema) : Schema {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		}
		if (typeof value === 'string') {
			return this.get(value)
		}
		if (value as Schema === undefined) {
			throw new Error('Parameter value is invalid')
		}
		return this.add(value)
	}

	public normalize (source: Schema): Schema {
		if (source === undefined || source === null) {
			throw new Error('source is empty')
		}
		if (typeof source !== 'object') {
			return source
		}
		const schema = Helper.clone(source)
		this.extender.extend(schema)
		this.completer.complete(schema)
		return schema
	}

	private externalRefs (schema: Schema):string[] {
		const ids = Helper.findAllInObject(schema, (value:any):boolean => {
			return value.$id !== undefined && typeof value.$id === 'string' && value.$id.startsWith('http')
		}).map(p => p.$id)
		const refs = Helper.findAllInObject(schema, (value:any):boolean => {
			return value.$ref !== undefined && typeof value.$ref === 'string' && value.$ref.startsWith('http')
		}).map(p => p.$ref)
		return refs.filter(p => !ids.includes(p))
	}
}
