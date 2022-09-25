import { schemas } from '../../lib'
	describe('load', () => {
		
	test('root pointer ref', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"foo":{"$ref":"#"}},"additionalProperties":false}')
    const expected = '[{"properties":{"foo":{"$ref":"#"}},"additionalProperties":false,"$id":"{properties:{foo:{$ref:#}},additionalproperties:false}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('relative pointer ref to object', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"foo":{"type":"integer"},"bar":{"$ref":"#/properties/foo"}}}')
    const expected = '[{"properties":{"foo":{"type":"integer"},"bar":{"$ref":"#/properties/foo"}},"$id":"{properties:{foo:{type:integer},bar:{$ref:#/properties/foo}}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('relative pointer ref to array', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","prefixItems":[{"type":"integer"},{"$ref":"#/prefixItems/0"}]}')
    const expected = '[{"prefixItems":[{"type":"integer"},{"$ref":"#/prefixItems/0"}],"$id":"{prefixitems:[{type:integer},{$ref:#/prefixitems/0}]}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('escaped pointer ref', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"tilde~field":{"type":"integer"},"slash/field":{"type":"integer"},"percent%field":{"type":"integer"}},"properties":{"tilde":{"$ref":"#/$defs/tilde~0field"},"slash":{"$ref":"#/$defs/slash~1field"},"percent":{"$ref":"#/$defs/percent%25field"}}}')
    const expected = '[{"$defs":{"tilde~field":{"type":"integer"},"slash/field":{"type":"integer"},"percent%field":{"type":"integer"}},"properties":{"tilde":{"$ref":"#/$defs/tilde~0field"},"slash":{"$ref":"#/$defs/slash~1field"},"percent":{"$ref":"#/$defs/percent%25field"}},"$id":"{$defs:{tilde~field:{type:integer},slash/field:{type:integer},percent%field:{type:integer}},properties:{tilde:{$ref:#/$defs/tilde~0field},slash:{$ref:#/$defs/slash~1field},percent:{$ref:#/$defs/percent%25field}}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('nested refs', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"a":{"type":"integer"},"b":{"$ref":"#/$defs/a"},"c":{"$ref":"#/$defs/b"}},"$ref":"#/$defs/c"}')
    const expected = '[{"$defs":{"a":{"type":"integer"},"b":{"$ref":"#/$defs/a"},"c":{"$ref":"#/$defs/b"}},"$ref":"#/$defs/c","$id":"{$defs:{a:{type:integer},b:{$ref:#/$defs/a},c:{$ref:#/$defs/b}},$ref:#/$defs/c}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('ref applies alongside sibling keywords', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"reffed":{"type":"array"}},"properties":{"foo":{"$ref":"#/$defs/reffed","maxItems":2}}}')
    const expected = '[{"$defs":{"reffed":{"type":"array"}},"properties":{"foo":{"$ref":"#/$defs/reffed","maxItems":2}},"$id":"{$defs:{reffed:{type:array}},properties:{foo:{$ref:#/$defs/reffed,maxitems:2}}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('remote ref, containing refs itself', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"https://json-schema.org/draft/2020-12/schema"}')
    const expected = '[{"$ref":"https://json-schema.org/draft/2020-12/schema","$id":"{$ref:https://json-schema.org/draft/2020-12/schema}"},{"$id":"https://json-schema.org/draft/2020-12/schema","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true,"https://json-schema.org/draft/2020-12/vocab/applicator":true,"https://json-schema.org/draft/2020-12/vocab/unevaluated":true,"https://json-schema.org/draft/2020-12/vocab/validation":true,"https://json-schema.org/draft/2020-12/vocab/meta-data":true,"https://json-schema.org/draft/2020-12/vocab/format-annotation":true,"https://json-schema.org/draft/2020-12/vocab/content":true},"$dynamicAnchor":"meta","title":"Core and Validation specifications meta-schema","allOf":[{"$ref":"https://json-schema.org/draft/2020-12/meta/core"},{"$ref":"https://json-schema.org/draft/2020-12/meta/applicator"},{"$ref":"https://json-schema.org/draft/2020-12/meta/unevaluated"},{"$ref":"https://json-schema.org/draft/2020-12/meta/validation"},{"$ref":"https://json-schema.org/draft/2020-12/meta/meta-data"},{"$ref":"https://json-schema.org/draft/2020-12/meta/format-annotation"},{"$ref":"https://json-schema.org/draft/2020-12/meta/content"}],"type":["object","boolean"],"properties":{"definitions":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"deprecated":true,"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$dynamicRef":"#meta"},{"$ref":"https://json-schema.org/draft/2020-12/meta/validation#/$defs/stringArray"}]},"deprecated":true,"default":{}},"$recursiveAnchor":{"$ref":"https://json-schema.org/draft/2020-12/meta/core#/$defs/anchorString","deprecated":true},"$recursiveRef":{"$ref":"https://json-schema.org/draft/2020-12/meta/core#/$defs/uriReferenceString","deprecated":true}}},{"$id":"https://json-schema.org/draft/2020-12/meta/core","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true},"$dynamicAnchor":"meta","title":"Core vocabulary meta-schema","type":["object","boolean"],"properties":{"$id":{"$ref":"#/$defs/uriReferenceString","pattern":"^[^#]*#?$"},"$ref":{"$ref":"#/$defs/uriReferenceString"},"$anchor":{"$ref":"#/$defs/anchorString"},"$dynamicRef":{"$ref":"#/$defs/uriReferenceString"},"$dynamicAnchor":{"$ref":"#/$defs/anchorString"},"$vocabulary":{"type":"object","propertyNames":{"$ref":"#/$defs/uriString"},"additionalProperties":{"type":"boolean"}},"$defs":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"}}},"$defs":{"anchorString":{"type":"string","pattern":"^[A-Za-z_][-A-Za-z0-9._]*$"},"uriString":{"type":"string","format":"uri"},"uriReferenceString":{"type":"string","format":"uri-reference"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/applicator","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/applicator":true},"$dynamicAnchor":"meta","title":"Applicator vocabulary meta-schema","type":["object","boolean"],"properties":{"prefixItems":{"$ref":"#/$defs/schemaArray"},"items":{"$dynamicRef":"#meta"},"contains":{"$dynamicRef":"#meta"},"additionalProperties":{"$dynamicRef":"#meta"},"properties":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"propertyNames":{"format":"regex"},"default":{}},"dependentSchemas":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"default":{}},"propertyNames":{"$dynamicRef":"#meta"},"if":{"$dynamicRef":"#meta"},"then":{"$dynamicRef":"#meta"},"else":{"$dynamicRef":"#meta"},"allOf":{"$ref":"#/$defs/schemaArray"},"anyOf":{"$ref":"#/$defs/schemaArray"},"oneOf":{"$ref":"#/$defs/schemaArray"},"not":{"$dynamicRef":"#meta"}},"$defs":{"schemaArray":{"type":"array","minItems":1,"items":{"$dynamicRef":"#meta"}}}},{"$id":"https://json-schema.org/draft/2020-12/meta/unevaluated","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/unevaluated":true},"$dynamicAnchor":"meta","title":"Unevaluated applicator vocabulary meta-schema","type":["object","boolean"],"properties":{"unevaluatedItems":{"$dynamicRef":"#meta"},"unevaluatedProperties":{"$dynamicRef":"#meta"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/validation","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/validation":true},"$dynamicAnchor":"meta","title":"Validation vocabulary meta-schema","type":["object","boolean"],"properties":{"type":{"anyOf":[{"$ref":"#/$defs/simpleTypes"},{"type":"array","items":{"$ref":"#/$defs/simpleTypes"},"minItems":1,"uniqueItems":true}]},"const":true,"enum":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/$defs/nonNegativeInteger"},"minLength":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"maxItems":{"$ref":"#/$defs/nonNegativeInteger"},"minItems":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"maxContains":{"$ref":"#/$defs/nonNegativeInteger"},"minContains":{"$ref":"#/$defs/nonNegativeInteger","default":1},"maxProperties":{"$ref":"#/$defs/nonNegativeInteger"},"minProperties":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"required":{"$ref":"#/$defs/stringArray"},"dependentRequired":{"type":"object","additionalProperties":{"$ref":"#/$defs/stringArray"}}},"$defs":{"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"$ref":"#/$defs/nonNegativeInteger","default":0},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}}},{"$id":"https://json-schema.org/draft/2020-12/meta/meta-data","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/meta-data":true},"$dynamicAnchor":"meta","title":"Meta-data vocabulary meta-schema","type":["object","boolean"],"properties":{"title":{"type":"string"},"default":true,"deprecated":{"type":"boolean","default":false},"readOnly":{"type":"boolean","default":false},"writeOnly":{"type":"boolean","default":false},"examples":{"type":"array","items":true}}},{"$id":"https://json-schema.org/draft/2020-12/meta/format-annotation","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/format-annotation":true},"$dynamicAnchor":"meta","title":"Format vocabulary meta-schema for annotation results","type":["object","boolean"],"properties":{"format":{"type":"string"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/content","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/content":true},"$dynamicAnchor":"meta","title":"Content vocabulary meta-schema","type":["object","boolean"],"properties":{"contentEncoding":{"type":"string"},"contentMediaType":{"type":"string"},"contentSchema":{"$dynamicRef":"#meta"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/validation","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/validation":true},"$dynamicAnchor":"meta","title":"Validation vocabulary meta-schema","type":["object","boolean"],"properties":{"type":{"anyOf":[{"$ref":"#/$defs/simpleTypes"},{"type":"array","items":{"$ref":"#/$defs/simpleTypes"},"minItems":1,"uniqueItems":true}]},"const":true,"enum":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/$defs/nonNegativeInteger"},"minLength":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"maxItems":{"$ref":"#/$defs/nonNegativeInteger"},"minItems":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"maxContains":{"$ref":"#/$defs/nonNegativeInteger"},"minContains":{"$ref":"#/$defs/nonNegativeInteger","default":1},"maxProperties":{"$ref":"#/$defs/nonNegativeInteger"},"minProperties":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"required":{"$ref":"#/$defs/stringArray"},"dependentRequired":{"type":"object","additionalProperties":{"$ref":"#/$defs/stringArray"}}},"$defs":{"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"$ref":"#/$defs/nonNegativeInteger","default":0},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}}},{"$id":"https://json-schema.org/draft/2020-12/meta/core","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true},"$dynamicAnchor":"meta","title":"Core vocabulary meta-schema","type":["object","boolean"],"properties":{"$id":{"$ref":"#/$defs/uriReferenceString","pattern":"^[^#]*#?$"},"$ref":{"$ref":"#/$defs/uriReferenceString"},"$anchor":{"$ref":"#/$defs/anchorString"},"$dynamicRef":{"$ref":"#/$defs/uriReferenceString"},"$dynamicAnchor":{"$ref":"#/$defs/anchorString"},"$vocabulary":{"type":"object","propertyNames":{"$ref":"#/$defs/uriString"},"additionalProperties":{"type":"boolean"}},"$defs":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"}}},"$defs":{"anchorString":{"type":"string","pattern":"^[A-Za-z_][-A-Za-z0-9._]*$"},"uriString":{"type":"string","format":"uri"},"uriReferenceString":{"type":"string","format":"uri-reference"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/core","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true},"$dynamicAnchor":"meta","title":"Core vocabulary meta-schema","type":["object","boolean"],"properties":{"$id":{"$ref":"#/$defs/uriReferenceString","pattern":"^[^#]*#?$"},"$ref":{"$ref":"#/$defs/uriReferenceString"},"$anchor":{"$ref":"#/$defs/anchorString"},"$dynamicRef":{"$ref":"#/$defs/uriReferenceString"},"$dynamicAnchor":{"$ref":"#/$defs/anchorString"},"$vocabulary":{"type":"object","propertyNames":{"$ref":"#/$defs/uriString"},"additionalProperties":{"type":"boolean"}},"$defs":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"}}},"$defs":{"anchorString":{"type":"string","pattern":"^[A-Za-z_][-A-Za-z0-9._]*$"},"uriString":{"type":"string","format":"uri"},"uriReferenceString":{"type":"string","format":"uri-reference"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('property named $ref that is not a reference', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"$ref":{"type":"string"}}}')
    const expected = '[{"properties":{"$ref":{"type":"string"}},"$id":"{properties:{$ref:{type:string}}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('property named $ref, containing an actual $ref', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"$ref":{"$ref":"#/$defs/is-string"}},"$defs":{"is-string":{"type":"string"}}}')
    const expected = '[{"properties":{"$ref":{"$ref":"#/$defs/is-string"}},"$defs":{"is-string":{"type":"string"}},"$id":"{properties:{$ref:{$ref:#/$defs/is-string}},$defs:{is-string:{type:string}}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('$ref to boolean schema true', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"#/$defs/bool","$defs":{"bool":true}}')
    const expected = '[{"$ref":"#/$defs/bool","$defs":{"bool":true},"$id":"{$ref:#/$defs/bool,$defs:{bool:true}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('$ref to boolean schema false', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"#/$defs/bool","$defs":{"bool":false}}')
    const expected = '[{"$ref":"#/$defs/bool","$defs":{"bool":false},"$id":"{$ref:#/$defs/bool,$defs:{bool:false}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('Recursive references between schemas', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://localhost:1234/draft2020-12/tree","description":"tree of nodes","type":"object","properties":{"meta":{"type":"string"},"nodes":{"type":"array","items":{"$ref":"node"}}},"required":["meta","nodes"],"$defs":{"node":{"$id":"http://localhost:1234/draft2020-12/node","description":"node","type":"object","properties":{"value":{"type":"number"},"subtree":{"$ref":"tree"}},"required":["value"]}}}')
    const expected = '[{"$id":"http://localhost:1234/draft2020-12/tree","type":"object","properties":{"meta":{"type":"string"},"nodes":{"type":"array","items":{"$ref":"#/$defs/node"}}},"required":["meta","nodes"],"$defs":{"node":{"$id":"http://localhost:1234/draft2020-12/node","type":"object","properties":{"value":{"type":"number"},"subtree":{"$ref":"#"}},"required":["value"]}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('ref creates new scope when adjacent to keywords', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"A":{"unevaluatedProperties":false}},"properties":{"prop1":{"type":"string"}},"$ref":"#/$defs/A"}')
    const expected = '[{"$defs":{"A":{"unevaluatedProperties":false}},"properties":{"prop1":{"type":"string"}},"$ref":"#/$defs/A","$id":"{$defs:{a:{unevaluatedproperties:false}},properties:{prop1:{type:string}},$ref:#/$defs/a}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('naive replacement of $ref with its destination is not correct', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"a_string":{"type":"string"}},"enum":[{"$ref":"#/$defs/a_string"}]}')
    const expected = '[{"$defs":{"a_string":{"type":"string"}},"enum":[{"$ref":"#/$defs/a_string"}],"$id":"{$defs:{a_string:{type:string}},enum:[{$ref:#/$defs/a_string}]}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('refs with relative uris and defs', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://example.com/schema-relative-uri-defs1.json","properties":{"foo":{"$id":"schema-relative-uri-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/$defs/inner"}},"$ref":"schema-relative-uri-defs2.json"}')
    const expected = '[{"$id":"http://example.com/schema-relative-uri-defs1.json","properties":{"foo":{"$id":"http://example.com/schema-relative-uri-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/properties/foo/$defs/inner"}},"$ref":"#/properties/foo"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('relative refs with absolute uris and defs', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://example.com/schema-refs-absolute-uris-defs1.json","properties":{"foo":{"$id":"http://example.com/schema-refs-absolute-uris-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/$defs/inner"}},"$ref":"schema-refs-absolute-uris-defs2.json"}')
    const expected = '[{"$id":"http://example.com/schema-refs-absolute-uris-defs1.json","properties":{"foo":{"$id":"http://example.com/schema-refs-absolute-uris-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/properties/foo/$defs/inner"}},"$ref":"#/properties/foo"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('$id must be resolved against nearest parent, not just immediate parent', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://example.com/a.json","$defs":{"x":{"$id":"http://example.com/b/c.json","not":{"$defs":{"y":{"$id":"d.json","type":"number"}}}}},"allOf":[{"$ref":"http://example.com/b/d.json"}]}')
    const expected = '[{"$id":"http://example.com/a.json","$defs":{"x":{"$id":"http://example.com/b/c.json","not":{"$defs":{"y":{"$id":"http://example.com/b/d.json","type":"number"}}}}},"allOf":[{"$ref":"#/$defs/x/not/$defs/y"}]}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('order of evaluation: $id and $ref', async () => {
    const source = JSON.parse('{"$comment":"$id must be evaluated before $ref to get the proper $ref destination","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/draft2020-12/ref-and-id1/base.json","$ref":"int.json","$defs":{"bigint":{"$comment":"canonical uri: /ref-and-id1/int.json","$id":"int.json","maximum":10},"smallint":{"$comment":"canonical uri: /ref-and-id1-int.json","$id":"/draft2020-12/ref-and-id1-int.json","maximum":2}}}')
    const expected = '[{"$id":"/draft2020-12/ref-and-id1/base.json","$ref":"#/$defs/bigint","$defs":{"bigint":{"$id":"draft2020-12/ref-and-id1/int.json","maximum":10},"smallint":{"$id":"draft2020-12/draft2020-12/ref-and-id1-int.json","maximum":2}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('order of evaluation: $id and $anchor and $ref', async () => {
    const source = JSON.parse('{"$comment":"$id must be evaluated before $ref to get the proper $ref destination","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/draft2020-12/ref-and-id2/base.json","$ref":"#bigint","$defs":{"bigint":{"$comment":"canonical uri: /ref-and-id2/base.json/$defs/bigint; another valid uri for this location: /ref-and-id2/base.json#bigint","$anchor":"bigint","maximum":10},"smallint":{"$comment":"canonical uri: /ref-and-id2#/$defs/smallint; another valid uri for this location: /ref-and-id2/#bigint","$id":"/draft2020-12/ref-and-id2/","$anchor":"bigint","maximum":2}}}')
    const expected = '[{"$id":"/draft2020-12/ref-and-id2/base.json","$ref":"#/$defs/bigint","$defs":{"bigint":{"maximum":10,"$id":"/draft2020-12/ref-and-id2/base.json#bigint"},"smallint":{"$id":"draft2020-12/draft2020-12/ref-and-id2#bigint","maximum":2}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('simple URN base URI with $ref via the URN', async () => {
    const source = JSON.parse('{"$comment":"URIs do not have to have HTTP(s) schemes","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed","minimum":30,"properties":{"foo":{"$ref":"urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed"}}}')
    const expected = '[{"$id":"urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed","minimum":30,"properties":{"foo":{"$ref":"#"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('simple URN base URI with JSON pointer', async () => {
    const source = JSON.parse('{"$comment":"URIs do not have to have HTTP(s) schemes","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '[{"$id":"urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with NSS', async () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.2","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:example:1/406/47452/2","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '[{"$id":"urn:example:1/406/47452/2","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with r-component', async () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.3.1","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:example:foo-bar-baz-qux?+CCResolve:cc=uk","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '[{"$id":"urn:example:foo-bar-baz-qux?+CCResolve:cc=uk","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with q-component', async () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.3.2","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:example:weather?=op=map&lat=39.56&lon=-104.85&datetime=1969-07-21T02:56:15Z","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '[{"$id":"urn:example:weather?=op=map&lat=39.56&lon=-104.85&datetime=1969-07-21T02:56:15Z","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with f-component', async () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.3.3, but we don\'t allow fragments","$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"https://json-schema.org/draft/2020-12/schema"}')
    const expected = '[{"$ref":"https://json-schema.org/draft/2020-12/schema","$id":"{$ref:https://json-schema.org/draft/2020-12/schema}"},{"$id":"https://json-schema.org/draft/2020-12/schema","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true,"https://json-schema.org/draft/2020-12/vocab/applicator":true,"https://json-schema.org/draft/2020-12/vocab/unevaluated":true,"https://json-schema.org/draft/2020-12/vocab/validation":true,"https://json-schema.org/draft/2020-12/vocab/meta-data":true,"https://json-schema.org/draft/2020-12/vocab/format-annotation":true,"https://json-schema.org/draft/2020-12/vocab/content":true},"$dynamicAnchor":"meta","title":"Core and Validation specifications meta-schema","allOf":[{"$ref":"https://json-schema.org/draft/2020-12/meta/core"},{"$ref":"https://json-schema.org/draft/2020-12/meta/applicator"},{"$ref":"https://json-schema.org/draft/2020-12/meta/unevaluated"},{"$ref":"https://json-schema.org/draft/2020-12/meta/validation"},{"$ref":"https://json-schema.org/draft/2020-12/meta/meta-data"},{"$ref":"https://json-schema.org/draft/2020-12/meta/format-annotation"},{"$ref":"https://json-schema.org/draft/2020-12/meta/content"}],"type":["object","boolean"],"properties":{"definitions":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"deprecated":true,"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$dynamicRef":"#meta"},{"$ref":"https://json-schema.org/draft/2020-12/meta/validation#/$defs/stringArray"}]},"deprecated":true,"default":{}},"$recursiveAnchor":{"$ref":"https://json-schema.org/draft/2020-12/meta/core#/$defs/anchorString","deprecated":true},"$recursiveRef":{"$ref":"https://json-schema.org/draft/2020-12/meta/core#/$defs/uriReferenceString","deprecated":true}}},{"$id":"https://json-schema.org/draft/2020-12/meta/core","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true},"$dynamicAnchor":"meta","title":"Core vocabulary meta-schema","type":["object","boolean"],"properties":{"$id":{"$ref":"#/$defs/uriReferenceString","pattern":"^[^#]*#?$"},"$ref":{"$ref":"#/$defs/uriReferenceString"},"$anchor":{"$ref":"#/$defs/anchorString"},"$dynamicRef":{"$ref":"#/$defs/uriReferenceString"},"$dynamicAnchor":{"$ref":"#/$defs/anchorString"},"$vocabulary":{"type":"object","propertyNames":{"$ref":"#/$defs/uriString"},"additionalProperties":{"type":"boolean"}},"$defs":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"}}},"$defs":{"anchorString":{"type":"string","pattern":"^[A-Za-z_][-A-Za-z0-9._]*$"},"uriString":{"type":"string","format":"uri"},"uriReferenceString":{"type":"string","format":"uri-reference"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/applicator","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/applicator":true},"$dynamicAnchor":"meta","title":"Applicator vocabulary meta-schema","type":["object","boolean"],"properties":{"prefixItems":{"$ref":"#/$defs/schemaArray"},"items":{"$dynamicRef":"#meta"},"contains":{"$dynamicRef":"#meta"},"additionalProperties":{"$dynamicRef":"#meta"},"properties":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"propertyNames":{"format":"regex"},"default":{}},"dependentSchemas":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"},"default":{}},"propertyNames":{"$dynamicRef":"#meta"},"if":{"$dynamicRef":"#meta"},"then":{"$dynamicRef":"#meta"},"else":{"$dynamicRef":"#meta"},"allOf":{"$ref":"#/$defs/schemaArray"},"anyOf":{"$ref":"#/$defs/schemaArray"},"oneOf":{"$ref":"#/$defs/schemaArray"},"not":{"$dynamicRef":"#meta"}},"$defs":{"schemaArray":{"type":"array","minItems":1,"items":{"$dynamicRef":"#meta"}}}},{"$id":"https://json-schema.org/draft/2020-12/meta/unevaluated","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/unevaluated":true},"$dynamicAnchor":"meta","title":"Unevaluated applicator vocabulary meta-schema","type":["object","boolean"],"properties":{"unevaluatedItems":{"$dynamicRef":"#meta"},"unevaluatedProperties":{"$dynamicRef":"#meta"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/validation","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/validation":true},"$dynamicAnchor":"meta","title":"Validation vocabulary meta-schema","type":["object","boolean"],"properties":{"type":{"anyOf":[{"$ref":"#/$defs/simpleTypes"},{"type":"array","items":{"$ref":"#/$defs/simpleTypes"},"minItems":1,"uniqueItems":true}]},"const":true,"enum":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/$defs/nonNegativeInteger"},"minLength":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"maxItems":{"$ref":"#/$defs/nonNegativeInteger"},"minItems":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"maxContains":{"$ref":"#/$defs/nonNegativeInteger"},"minContains":{"$ref":"#/$defs/nonNegativeInteger","default":1},"maxProperties":{"$ref":"#/$defs/nonNegativeInteger"},"minProperties":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"required":{"$ref":"#/$defs/stringArray"},"dependentRequired":{"type":"object","additionalProperties":{"$ref":"#/$defs/stringArray"}}},"$defs":{"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"$ref":"#/$defs/nonNegativeInteger","default":0},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}}},{"$id":"https://json-schema.org/draft/2020-12/meta/meta-data","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/meta-data":true},"$dynamicAnchor":"meta","title":"Meta-data vocabulary meta-schema","type":["object","boolean"],"properties":{"title":{"type":"string"},"default":true,"deprecated":{"type":"boolean","default":false},"readOnly":{"type":"boolean","default":false},"writeOnly":{"type":"boolean","default":false},"examples":{"type":"array","items":true}}},{"$id":"https://json-schema.org/draft/2020-12/meta/format-annotation","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/format-annotation":true},"$dynamicAnchor":"meta","title":"Format vocabulary meta-schema for annotation results","type":["object","boolean"],"properties":{"format":{"type":"string"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/content","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/content":true},"$dynamicAnchor":"meta","title":"Content vocabulary meta-schema","type":["object","boolean"],"properties":{"contentEncoding":{"type":"string"},"contentMediaType":{"type":"string"},"contentSchema":{"$dynamicRef":"#meta"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/validation","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/validation":true},"$dynamicAnchor":"meta","title":"Validation vocabulary meta-schema","type":["object","boolean"],"properties":{"type":{"anyOf":[{"$ref":"#/$defs/simpleTypes"},{"type":"array","items":{"$ref":"#/$defs/simpleTypes"},"minItems":1,"uniqueItems":true}]},"const":true,"enum":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/$defs/nonNegativeInteger"},"minLength":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"maxItems":{"$ref":"#/$defs/nonNegativeInteger"},"minItems":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"maxContains":{"$ref":"#/$defs/nonNegativeInteger"},"minContains":{"$ref":"#/$defs/nonNegativeInteger","default":1},"maxProperties":{"$ref":"#/$defs/nonNegativeInteger"},"minProperties":{"$ref":"#/$defs/nonNegativeIntegerDefault0"},"required":{"$ref":"#/$defs/stringArray"},"dependentRequired":{"type":"object","additionalProperties":{"$ref":"#/$defs/stringArray"}}},"$defs":{"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"$ref":"#/$defs/nonNegativeInteger","default":0},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}}},{"$id":"https://json-schema.org/draft/2020-12/meta/core","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true},"$dynamicAnchor":"meta","title":"Core vocabulary meta-schema","type":["object","boolean"],"properties":{"$id":{"$ref":"#/$defs/uriReferenceString","pattern":"^[^#]*#?$"},"$ref":{"$ref":"#/$defs/uriReferenceString"},"$anchor":{"$ref":"#/$defs/anchorString"},"$dynamicRef":{"$ref":"#/$defs/uriReferenceString"},"$dynamicAnchor":{"$ref":"#/$defs/anchorString"},"$vocabulary":{"type":"object","propertyNames":{"$ref":"#/$defs/uriString"},"additionalProperties":{"type":"boolean"}},"$defs":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"}}},"$defs":{"anchorString":{"type":"string","pattern":"^[A-Za-z_][-A-Za-z0-9._]*$"},"uriString":{"type":"string","format":"uri"},"uriReferenceString":{"type":"string","format":"uri-reference"}}},{"$id":"https://json-schema.org/draft/2020-12/meta/core","$vocabulary":{"https://json-schema.org/draft/2020-12/vocab/core":true},"$dynamicAnchor":"meta","title":"Core vocabulary meta-schema","type":["object","boolean"],"properties":{"$id":{"$ref":"#/$defs/uriReferenceString","pattern":"^[^#]*#?$"},"$ref":{"$ref":"#/$defs/uriReferenceString"},"$anchor":{"$ref":"#/$defs/anchorString"},"$dynamicRef":{"$ref":"#/$defs/uriReferenceString"},"$dynamicAnchor":{"$ref":"#/$defs/anchorString"},"$vocabulary":{"type":"object","propertyNames":{"$ref":"#/$defs/uriString"},"additionalProperties":{"type":"boolean"}},"$defs":{"type":"object","additionalProperties":{"$dynamicRef":"#meta"}}},"$defs":{"anchorString":{"type":"string","pattern":"^[A-Za-z_][-A-Za-z0-9._]*$"},"uriString":{"type":"string","format":"uri"},"uriReferenceString":{"type":"string","format":"uri-reference"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with URN and JSON pointer ref', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-0000-0000-4321feebdaed","properties":{"foo":{"$ref":"urn:uuid:deadbeef-1234-0000-0000-4321feebdaed#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '[{"$id":"urn:uuid:deadbeef-1234-0000-0000-4321feebdaed","properties":{"foo":{"$ref":"##/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with URN and anchor ref', async () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed","properties":{"foo":{"$ref":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something"}},"$defs":{"bar":{"$anchor":"something","type":"string"}}}')
    const expected = '[{"$id":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string","$id":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something"}}}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })

	test('URN ref with nested pointer ref', async () => {
    const source = JSON.parse('{"$ref":"urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed","$defs":{"foo":{"$id":"urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed","$defs":{"bar":{"type":"string"}},"$ref":"#/$defs/bar"}}}')
    const expected = '[{"$ref":"#/$defs/foo","$defs":{"foo":{"$id":"urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed","$defs":{"bar":{"type":"string"}},"$ref":"#/$defs/foo/$defs/bar"}},"$id":"{$ref:#/$defs/foo,$defs:{foo:{$id:urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed,$defs:{bar:{type:string}},$ref:#/$defs/foo/$defs/bar}}}"}]'
    const target = JSON.stringify(await schemas.load(source))
    expect(expected).toBe(target)
  })
	})