export interface Schema {
	$id?: string
	$anchor?: string
	$schema?: string
	$extends?: string
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=defs
	$defs: any
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=ref
	$ref?: string
}

export interface ISchemaTransform {
	execute (schema: Schema): Schema
}

export interface ISchemaManager{
	add (value: Schema): Schema
	load (value: string|Schema): Promise<Schema>
	get (key: string): Schema
	solve (value: string|Schema) : Schema
	externalRefs (schema: Schema):string[]
	normalize (source: Schema): Schema
}
