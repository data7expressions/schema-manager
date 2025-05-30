[**schema-manager**](../README.md)

***

[schema-manager](../README.md) / ISchemaManager

# Interface: ISchemaManager

Defined in: [model/schema.ts:27](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L27)

## Methods

### add()

> **add**(`value`): [`Schema`](Schema.md)

Defined in: [model/schema.ts:28](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L28)

#### Parameters

##### value

[`Schema`](Schema.md)

#### Returns

[`Schema`](Schema.md)

***

### externalRefs()

> **externalRefs**(`schema`): `string`[]

Defined in: [model/schema.ts:35](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L35)

#### Parameters

##### schema

[`Schema`](Schema.md)

#### Returns

`string`[]

***

### get()

> **get**(`key`): `undefined` \| [`Schema`](Schema.md)

Defined in: [model/schema.ts:30](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L30)

#### Parameters

##### key

`string`

#### Returns

`undefined` \| [`Schema`](Schema.md)

***

### list()

> **list**(): [`Schema`](Schema.md)[]

Defined in: [model/schema.ts:31](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L31)

#### Returns

[`Schema`](Schema.md)[]

***

### load()

> **load**(`value`): `Promise`\<[`Schema`](Schema.md)[]\>

Defined in: [model/schema.ts:29](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L29)

#### Parameters

##### value

`string` | [`Schema`](Schema.md)

#### Returns

`Promise`\<[`Schema`](Schema.md)[]\>

***

### normalize()

> **normalize**(`source`): [`Schema`](Schema.md)

Defined in: [model/schema.ts:33](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L33)

#### Parameters

##### source

[`Schema`](Schema.md)

#### Returns

[`Schema`](Schema.md)

***

### refs()

> **refs**(`schema`): `string`[]

Defined in: [model/schema.ts:34](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L34)

#### Parameters

##### schema

[`Schema`](Schema.md)

#### Returns

`string`[]

***

### solve()

> **solve**(`value`): [`Schema`](Schema.md)

Defined in: [model/schema.ts:32](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L32)

#### Parameters

##### value

`string` | [`Schema`](Schema.md)

#### Returns

[`Schema`](Schema.md)

***

### solveRef()

> **solveRef**(`schema`, `ref`): [`RefInfo`](RefInfo.md)

Defined in: [model/schema.ts:36](https://github.com/data7expressions/schema-manager/blob/bff57ca616457cd11ff12a858d17453072d5f663/src/lib/model/schema.ts#L36)

#### Parameters

##### schema

[`Schema`](Schema.md)

##### ref

`string`

#### Returns

[`RefInfo`](RefInfo.md)
