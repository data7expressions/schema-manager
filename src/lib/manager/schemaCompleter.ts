import { ISchemaCompleter, Schema } from '../model/schema'
import { Helper } from '.'

export class SchemaCompleter implements ISchemaCompleter {
	public complete (schema:Schema):void {
		if (schema === undefined || schema === null) {
			throw new Error('source is empty')
		}
		if (typeof schema !== 'object') {
			return
		}
		this.completeId(schema, schema, schema.$id)
		this.completeRef(schema, schema, '', schema.$id)
		this.removeProperties(schema)
	}

	private completeId (root:Schema, data:Schema, parentId?:string) : void {
		let _parentId = parentId
		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				const item = data[i]
				this.completeId(root, item, _parentId)
			}
		} else if (data && typeof data === 'object') {
			if (data.$id && typeof data.$id === 'string') {
				data.$id = this.solveId(data.$id, data.$anchor, _parentId)
				_parentId = data.$id
				if (data.$anchor && typeof data.$anchor === 'string') {
					delete data.$anchor
				}
			} else if (data.$anchor && typeof data.$anchor === 'string') {
				if (parentId === undefined) {
					throw new Error(`Could not resolve anchor: ${data.$anchor} without parent`)
				}
				if (data.$id !== undefined && typeof data.$id !== 'string') {
					throw new Error(`Could not resolve anchor: ${data.$anchor} if $id is not string`)
				}
				data.$id = `${parentId}#${data.$anchor}`
				_parentId = data.$id
				delete data.$anchor
			}
			for (const entry of Object.entries(data)) {
				this.completeId(root, entry[1], _parentId)
			}
		}
	}

	private solveId (id:string, anchor?:any, parentId?:string): string {
		try {
			let _id:string
			if (parentId === undefined || id.startsWith('http:')) {
				_id = id
			} else if (id === parentId) {
				_id = id
			} else if (id && parentId !== undefined) {
				_id = Helper.urlJoin(parentId, id)
			} else {
				_id = id
			}
			if (anchor) {
				return `${_id}#${anchor}`
			}
			return _id
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	private completeRef (root:Schema, current:Schema, path:string, parentId?:string) : void {
		if (Array.isArray(current)) {
			for (let i = 0; i < current.length; i++) {
				const item = current[i]
				this.completeRef(root, item, path + '/' + i, parentId)
			}
		} else if (current && typeof current === 'object') {
			if (current.$ref && typeof current.$ref === 'string') {
				const _parentId = current.$id ? current.$id : parentId
				current.$ref = this.absoluteRef(root, current, path, _parentId)
			}
			for (const entry of Object.entries(current)) {
				this.completeRef(root, entry[1], path + '/' + entry[0], parentId)
			}
		}
	}

	private absoluteRef (root:Schema, current:Schema, path:string, parentId?:string): string {
		if (current.$ref === undefined) {
			throw new Error('Ref undefined')
		}
		if (typeof current.$ref !== 'string') {
			throw new Error(`Ref ${JSON.stringify(current.$ref)}  is not string`)
		}
		if (current.$ref === '#') {
			return current.$ref
		}
		const found = this.findInternalRef(root, current, path, current.$ref)
		if (found) {
			return found
		}
		if (current.$ref.includes('#')) {
			const parts = current.$ref.split('#')
			const pathById = this.schemaPathById(root, parts[0], '#')
			if (pathById) {
				const schema = pathById === '#' ? root : Helper.jsonPath(root, pathById)
				const pathByAnchor = this.findInternalRef(schema, schema, '', '#' + parts[1])
				if (pathByAnchor) {
					if (pathById === '#' && pathByAnchor.startsWith('#')) {
						return pathByAnchor
					}
					return pathById + pathByAnchor
				} else {
					throw new Error(`Anchor ${parts[1]} in ${pathById}  not found`)
				}
			}
			if (current.$ref.startsWith('http')) {
				// como es un una ruta externa no se debe decodificar la url
				return current.$ref
			}
			// use case : relative refs with absolute uris and defs
			// ref:  schema-refs-absolute-uris-defs2.json
			// ref2: http://example.com/schema-refs-absolute-uris-defs2.json
			if (parentId) {
				const _ref = Helper.urlJoin(parentId, current.$ref)
				const found = this.schemaPathById(root, _ref, '#')
				if (found) {
					return found + '#' + parts[1]
				}
			}
		} else if (current.$ref.startsWith('http')) {
			// busca si la url es un id dentro del schema
			const found = this.schemaPathById(root, current.$ref, '#')
			if (found) {
				return found
			}
			// o es una referencia externa
			return current.$ref
		}
		if (parentId) {
			const ref = Helper.urlJoin(parentId, current.$ref)
			// busca si el uri es un id dentro del current schema
			let found = this.schemaPathById(current, ref, '#')
			if (found) {
				return found
			}
			// busca si el uri es un id dentro del schema
			found = this.schemaPathById(root, ref, '#')
			if (found) {
				return found
			}
			// si comienza con http es un uri externo
			if (ref.startsWith('http')) {
				return ref
			}
		}
		throw new Error(`Ref ${current.$ref} is invalid`)
	}

	private findInternalRef (root:Schema, current:Schema, path:string, ref:string): string | undefined {
		if (ref === '#') {
			return ref
		} else if (ref.startsWith('#/')) {
			if (path !== '') {
				const referencedSchema = this.findSchemaByPath(current, ref)
				if (referencedSchema !== undefined) {
					return '#' + path + '/' + ref.replace('#/', '')
				}
			}
			const referencedSchema = this.findSchemaByPath(root, ref)
			if (referencedSchema !== undefined) {
				return ref
			}
			const ref2 = ref.replace('#/', '')
			if (path !== '' && current.$defs && Object.keys(current.$defs).includes(ref2)) {
				return '#/' + path + '/$defs/' + ref2
			}
			if (root.$defs && Object.keys(root.$defs).includes(ref2)) {
				return '#/$defs/' + ref2
			}
		} else if (ref.startsWith('#')) {
			if (path !== '') {
				const referencedSchema = this.findSchemaByPath(current, ref)
				if (referencedSchema !== undefined) {
					return '#' + path + '/' + ref.replace('#', '')
				}
			}
			const referencedSchema = this.findSchemaByPath(root, ref)
			if (referencedSchema !== undefined) {
				return ref
			}
			const ref2 = ref.replace('#', '')
			if (path !== '' && current.$defs && Object.keys(current.$defs).includes(ref2)) {
				return '#/' + path + '/$defs/' + ref2
			}
			if (root.$defs && Object.keys(root.$defs).includes(ref2)) {
				return '#/$defs/' + ref2
			}
		} else if (ref.startsWith('http')) {
			// busca si la url es un id dentro del schema
			const found = this.schemaPathById(root, ref, '#')
			if (found) {
				return found
			}
		}
		if ((/\w/g).test(ref)) {
			if (path !== '' && current.$defs && Object.keys(current.$defs).includes(ref)) {
				return '#/' + path + '/$defs/' + ref
			}
			if (root.$defs && Object.keys(root.$defs).includes(ref)) {
				return '#/$defs/' + ref
			}
			const found = this.schemaPathById(root, ref, '#')
			if (found) {
				return found
			}
		}
		return undefined
	}

	private schemaPathById (source: Schema, id:string, path:string): string | undefined {
		if (Array.isArray(source)) {
			for (let i = 0; i < source.length; i++) {
				const found = this.schemaPathById(source[i], id, path + '/' + i)
				if (found) {
					return path + '/' + i
				}
			}
		} else if (typeof source === 'object') {
			if (source.$id === id) {
				return path
			}
			for (const entry of Object.entries(source)) {
				const found = this.schemaPathById(entry[1], id, path + '/' + entry[0])
				if (found) {
					return found
				}
			}
		}
		return undefined
	}

	private findSchemaByPath (source: Schema, ref:string): Schema | undefined {
		if (!ref.startsWith('#')) {
			return undefined
		}
		if (ref === '#' || source.$id === ref) {
			return source
		} else if (ref.startsWith('#/')) {
			return Helper.jsonPath(source, ref.replace('#/', ''))
		} else {
			return undefined
		}
	}

	private removeProperties (data:any) {
		if (Array.isArray(data)) {
			for (const item of data) {
				this.removeProperties(item)
			}
		} else if (data && typeof data === 'object') {
			delete data.description
			delete data.$comment
			delete data.$schema
			delete data.$extends
			for (const value of Object.values(data)) {
				this.removeProperties(value)
			}
		}
	}
}
