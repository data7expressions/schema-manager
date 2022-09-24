import { Schema, ISchemaLoader } from '../model/schema'
import { Helper } from '.'

export class SchemaLoader implements ISchemaLoader {
	public async load (uri:string): Promise<Schema> {
		const content = await Helper.get(uri)
		return Helper.tryParse(content) as Schema
	}
}
