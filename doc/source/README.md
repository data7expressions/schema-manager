schema-manager

# schema-manager

## Table of contents

### Interfaces

- [ISchemaCompleter](interfaces/ISchemaCompleter.md)
- [ISchemaExtender](interfaces/ISchemaExtender.md)
- [ISchemaLoader](interfaces/ISchemaLoader.md)
- [ISchemaManager](interfaces/ISchemaManager.md)
- [RefInfo](interfaces/RefInfo.md)
- [Schema](interfaces/Schema.md)

### Variables

- [Helper](README.md#helper)
- [schemas](README.md#schemas)

### Functions

- [add](README.md#add)
- [externalRefs](README.md#externalrefs)
- [get](README.md#get)
- [list](README.md#list)
- [load](README.md#load)
- [normalize](README.md#normalize)
- [refs](README.md#refs)
- [solve](README.md#solve)
- [solveRef](README.md#solveref)

## Variables

### Helper

• `Const` **Helper**: `H3lp` = `h3lp`

#### Defined in

[manager/index.ts:2](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/manager/index.ts#L2)

___

### schemas

• `Const` **schemas**: [`ISchemaManager`](interfaces/ISchemaManager.md) = `SchemaManager.instance`

#### Defined in

[index.ts:6](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L6)

## Functions

### add

▸ **add**(`value`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[index.ts:8](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L8)

___

### externalRefs

▸ **externalRefs**(`source`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Schema`](interfaces/Schema.md) |

#### Returns

`string`[]

#### Defined in

[index.ts:36](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L36)

___

### get

▸ **get**(`key`): `undefined` \| [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`undefined` \| [`Schema`](interfaces/Schema.md)

#### Defined in

[index.ts:16](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L16)

___

### list

▸ **list**(): [`Schema`](interfaces/Schema.md)[]

#### Returns

[`Schema`](interfaces/Schema.md)[]

#### Defined in

[index.ts:20](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L20)

___

### load

▸ **load**(`value`): `Promise`\<[`Schema`](interfaces/Schema.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](interfaces/Schema.md) |

#### Returns

`Promise`\<[`Schema`](interfaces/Schema.md)[]\>

#### Defined in

[index.ts:12](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L12)

___

### normalize

▸ **normalize**(`source`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[index.ts:28](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L28)

___

### refs

▸ **refs**(`source`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Schema`](interfaces/Schema.md) |

#### Returns

`string`[]

#### Defined in

[index.ts:32](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L32)

___

### solve

▸ **solve**(`value`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](interfaces/Schema.md) |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[index.ts:24](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L24)

___

### solveRef

▸ **solveRef**(`schema`, `ref`): [`RefInfo`](interfaces/RefInfo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](interfaces/Schema.md) |
| `ref` | `string` |

#### Returns

[`RefInfo`](interfaces/RefInfo.md)

#### Defined in

[index.ts:40](https://github.com/data7expressions/schema-manager/blob/57bfcd1/src/lib/index.ts#L40)
