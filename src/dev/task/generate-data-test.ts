/* eslint-disable no-unexpected-multiline */
import { schemas, Helper } from '../../lib'

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/tests/ref.json'
		const content = await Helper.readFile(file)
		if (content === null) {
			throw new Error(`file ${file} not found`)
		}
		let target:any[] = []
		const source = Helper.tryParse(content)
		for (const _case of source) {
			const result = schemas.normalize(_case.schema)
			target.push({ description: _case.description, schema: _case.schema, result: result })
		}
		await Helper.writeFile('./src/dev/data4Test/normalize.json', JSON.stringify(target, null, 2))

		target = []
		for (const _case of source) {
			const result = await schemas.load(_case.schema)
			target.push({ description: _case.description, schema: _case.schema, result: result })
		}
		await Helper.writeFile('./src/dev/data4Test/load.json', JSON.stringify(target, null, 2))
	} catch (error:any) {
		console.error(error)
	}
})()
