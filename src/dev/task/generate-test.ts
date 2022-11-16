/* eslint-disable no-unexpected-multiline */
import { Helper } from '../../lib'

const createNormalizeTest = (data:any) => {
	return `
	test('${data.description}', () => {
    const source = JSON.parse('${Helper.str.replace(JSON.stringify(data.schema), '\'', '\\\'')}')
    const expected = '${JSON.stringify(data.result)}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })`
}

const createLoadTest = (data:any) => {
	return `
	test('${data.description}', async () => {
    const source = JSON.parse('${Helper.str.replace(JSON.stringify(data.schema), '\'', '\\\'')}')
    const expected = '${JSON.stringify(data.result)}'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })`
}

const createContentTest = (name:string, test:string) => {
	return `import { schemas } from '../../'
	describe('${name}', () => {
		${test}
	})`
}

const createTest = async (name:string, func: (data:any) => string, exclude:string[] = []) :Promise<void> => {
	const file = `./src/dev/data4Test/${name}.json`
	const content = await Helper.fs.read(file)
	if (content === null) {
		throw new Error(`file ${file} not found`)
	}
	const target:string[] = []
	const source = Helper.utils.tryParse(content)
	for (const test of source) {
		if (!exclude.includes(test.description)) {
			target.push(func(test))
		}
	}
	const contentTest = createContentTest(name, target.join('\n'))
	await Helper.fs.write(`./src/lib/test/__tests__/${name}.test.ts`, contentTest)
}

(async () => {
	try {
		const excludes = ['refs with quote']
		await createTest('normalize', (data:any):string => { return createNormalizeTest(data) }, excludes)
		await createTest('load', (data:any):string => { return createLoadTest(data) }, excludes)
		// await createTest('ref', (data:any):string => { return createRefTest(data) }, excludes)
	} catch (error:any) {
		console.error(error)
	}
})()
