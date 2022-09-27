/* eslint-disable no-unexpected-multiline */
import { schemas, Helper } from '../../lib'

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/tests/ref.json'
		const content = await Helper.fs.readFile(file)
		if (content === null) {
			throw new Error(`file ${file} not found`)
		}
		const source = Helper.utils.tryParse(content)
		for (const _case of source) {
			await schemas.load(_case.schema)
		}
		await Helper.fs.writeFile('./src/dev/lab/loaded.json', JSON.stringify(schemas.list(), null, 2))
	} catch (error:any) {
		console.error(error)
	}
})()
