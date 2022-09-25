/* eslint-disable no-unexpected-multiline */
import { schemas as schemaManager, Helper, Schema } from '../../lib'

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/tests/ref.json'
		const content = await Helper.readFile(file)
		if (content === null) {
			throw new Error(`file ${file} not found`)
		}
		const source = Helper.tryParse(content)
		const schemas:Schema[] = []
		for (const _case of source) {
			schemas.push((await schemaManager.load(_case.schema))[0])
		}
		const target:any[] = []
		for (const schema of schemas) {
			const refs = schemaManager.refs(schema)
			for (const ref of refs) {
				const result = schemaManager.solveRef(schema, ref)
				target.push({ schema: schema, ref: ref, result: result })
			}
		}
		await Helper.writeFile('./src/dev/lab/refs.json', JSON.stringify(target, null, 2))
	} catch (error:any) {
		console.error(error)
	}
})()
