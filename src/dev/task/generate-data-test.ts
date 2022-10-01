/* eslint-disable no-unexpected-multiline */
import { schemas as schemaManager, Helper } from '../../lib'

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/tests/ref.json'
		const content = await Helper.fs.read(file)
		if (content === null) {
			throw new Error(`file ${file} not found`)
		}
		let target:any[] = []
		const source = Helper.utils.tryParse(content)
		for (const _case of source) {
			const result = schemaManager.normalize(_case.schema)
			target.push({ description: _case.description, schema: _case.schema, result: result })
		}
		await Helper.fs.write('./src/dev/data4Test/normalize.json', JSON.stringify(target, null, 2))

		target = []
		for (const _case of source) {
			const result = await schemaManager.load(_case.schema)
			target.push({ description: _case.description, schema: _case.schema, result: result })
		}
		await Helper.fs.write('./src/dev/data4Test/load.json', JSON.stringify(target, null, 2))

		const target2:any[] = []
		for (const p of target) {
			const schema = p.result[0]
			const refs = schemaManager.refs(schema)
			for (const ref of refs) {
				const result = schemaManager.solveRef(schema, ref)
				target2.push({ description: p.description, schema: schema, ref: ref, result: result })
			}
		}
		await Helper.fs.write('./src/dev/data4Test/ref.json', JSON.stringify(target2, null, 2))
	} catch (error:any) {
		console.error(error)
	}
})()
