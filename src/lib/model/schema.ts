export interface Schema {
	$id?: string
	$anchor?: string
	$schema?: string
	$extends?: string
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=defs
	$defs: any
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=ref
	$ref?: string

	// // propiedades resueltas
	// $$id?: string
	// $$ref?: string
}

export interface ISchemaCompleter {
	complete (schema: Schema):void
}
export interface ISchemaExtender {
	extend (schema: Schema):void
}

export interface ISchemaLoader {
	load (uri:string): Promise<Schema>
}
export interface ISchemaManager{
	add (value: Schema): Schema
	load (value: string|Schema): Promise<Schema[]>
	get (key: string) : Schema | undefined
	list () : Schema[]
	solve (value: string|Schema) : Schema
	normalize (source: Schema): Schema
	refs (schema: Schema):string[]
	externalRefs (schema: Schema):string[]
	solveRef (schema:Schema, ref:string) : Schema
}
