import { Schema, ISchemaLoader } from '../model/schema'
import { Helper } from '.'

export class SchemaLoader implements ISchemaLoader {
	public async load (uri:string): Promise<Schema> {
		const content = await Helper.http.get(uri)
		return Helper.utils.tryParse(content) as Schema
	}
}
