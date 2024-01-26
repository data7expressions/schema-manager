[schema-manager](../README.md) / ISchemaManager

# Interface: ISchemaManager

## Table of contents

### Methods

- [add](ISchemaManager.md#add)
- [externalRefs](ISchemaManager.md#externalrefs)
- [get](ISchemaManager.md#get)
- [list](ISchemaManager.md#list)
- [load](ISchemaManager.md#load)
- [normalize](ISchemaManager.md#normalize)
- [refs](ISchemaManager.md#refs)
- [solve](ISchemaManager.md#solve)
- [solveRef](ISchemaManager.md#solveref)

## Methods

### add

▸ **add**(`value`): [`Schema`](Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Schema`](Schema.md) |

#### Returns

[`Schema`](Schema.md)

#### Defined in

[model/schema.ts:28](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L28)

___

### externalRefs

▸ **externalRefs**(`schema`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](Schema.md) |

#### Returns

`string`[]

#### Defined in

[model/schema.ts:35](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L35)

___

### get

▸ **get**(`key`): `undefined` \| [`Schema`](Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`undefined` \| [`Schema`](Schema.md)

#### Defined in

[model/schema.ts:30](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L30)

___

### list

▸ **list**(): [`Schema`](Schema.md)[]

#### Returns

[`Schema`](Schema.md)[]

#### Defined in

[model/schema.ts:31](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L31)

___

### load

▸ **load**(`value`): `Promise`\<[`Schema`](Schema.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](Schema.md) |

#### Returns

`Promise`\<[`Schema`](Schema.md)[]\>

#### Defined in

[model/schema.ts:29](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L29)

___

### normalize

▸ **normalize**(`source`): [`Schema`](Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Schema`](Schema.md) |

#### Returns

[`Schema`](Schema.md)

#### Defined in

[model/schema.ts:33](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L33)

___

### refs

▸ **refs**(`schema`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](Schema.md) |

#### Returns

`string`[]

#### Defined in

[model/schema.ts:34](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L34)

___

### solve

▸ **solve**(`value`): [`Schema`](Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](Schema.md) |

#### Returns

[`Schema`](Schema.md)

#### Defined in

[model/schema.ts:32](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L32)

___

### solveRef

▸ **solveRef**(`schema`, `ref`): [`RefInfo`](RefInfo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](Schema.md) |
| `ref` | `string` |

#### Returns

[`RefInfo`](RefInfo.md)

#### Defined in

[model/schema.ts:36](https://github.com/data7expressions/schema-manager/blob/320efed/src/lib/model/schema.ts#L36)
