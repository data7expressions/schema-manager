import { schemas } from '../../lib'
	describe('normalize', () => {
		
	test('root pointer ref', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"foo":{"$ref":"#"}},"additionalProperties":false}')
    const expected = '{"properties":{"foo":{"$ref":"#"}},"additionalProperties":false}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('relative pointer ref to object', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"foo":{"type":"integer"},"bar":{"$ref":"#/properties/foo"}}}')
    const expected = '{"properties":{"foo":{"type":"integer"},"bar":{"$ref":"#/properties/foo"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('relative pointer ref to array', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","prefixItems":[{"type":"integer"},{"$ref":"#/prefixItems/0"}]}')
    const expected = '{"prefixItems":[{"type":"integer"},{"$ref":"#/prefixItems/0"}]}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('escaped pointer ref', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"tilde~field":{"type":"integer"},"slash/field":{"type":"integer"},"percent%field":{"type":"integer"}},"properties":{"tilde":{"$ref":"#/$defs/tilde~0field"},"slash":{"$ref":"#/$defs/slash~1field"},"percent":{"$ref":"#/$defs/percent%25field"}}}')
    const expected = '{"$defs":{"tilde~field":{"type":"integer"},"slash/field":{"type":"integer"},"percent%field":{"type":"integer"}},"properties":{"tilde":{"$ref":"#/$defs/tilde~0field"},"slash":{"$ref":"#/$defs/slash~1field"},"percent":{"$ref":"#/$defs/percent%25field"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('nested refs', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"a":{"type":"integer"},"b":{"$ref":"#/$defs/a"},"c":{"$ref":"#/$defs/b"}},"$ref":"#/$defs/c"}')
    const expected = '{"$defs":{"a":{"type":"integer"},"b":{"$ref":"#/$defs/a"},"c":{"$ref":"#/$defs/b"}},"$ref":"#/$defs/c"}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('ref applies alongside sibling keywords', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"reffed":{"type":"array"}},"properties":{"foo":{"$ref":"#/$defs/reffed","maxItems":2}}}')
    const expected = '{"$defs":{"reffed":{"type":"array"}},"properties":{"foo":{"$ref":"#/$defs/reffed","maxItems":2}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('remote ref, containing refs itself', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"https://json-schema.org/draft/2020-12/schema"}')
    const expected = '{"$ref":"https://json-schema.org/draft/2020-12/schema"}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('property named $ref that is not a reference', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"$ref":{"type":"string"}}}')
    const expected = '{"properties":{"$ref":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('property named $ref, containing an actual $ref', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","properties":{"$ref":{"$ref":"#/$defs/is-string"}},"$defs":{"is-string":{"type":"string"}}}')
    const expected = '{"properties":{"$ref":{"$ref":"#/$defs/is-string"}},"$defs":{"is-string":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('$ref to boolean schema true', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"#/$defs/bool","$defs":{"bool":true}}')
    const expected = '{"$ref":"#/$defs/bool","$defs":{"bool":true}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('$ref to boolean schema false', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"#/$defs/bool","$defs":{"bool":false}}')
    const expected = '{"$ref":"#/$defs/bool","$defs":{"bool":false}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('Recursive references between schemas', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://localhost:1234/draft2020-12/tree","description":"tree of nodes","type":"object","properties":{"meta":{"type":"string"},"nodes":{"type":"array","items":{"$ref":"node"}}},"required":["meta","nodes"],"$defs":{"node":{"$id":"http://localhost:1234/draft2020-12/node","description":"node","type":"object","properties":{"value":{"type":"number"},"subtree":{"$ref":"tree"}},"required":["value"]}}}')
    const expected = '{"$id":"http://localhost:1234/draft2020-12/tree","type":"object","properties":{"meta":{"type":"string"},"nodes":{"type":"array","items":{"$ref":"#/$defs/node"}}},"required":["meta","nodes"],"$defs":{"node":{"$id":"http://localhost:1234/draft2020-12/node","type":"object","properties":{"value":{"type":"number"},"subtree":{"$ref":"#"}},"required":["value"]}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('ref creates new scope when adjacent to keywords', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"A":{"unevaluatedProperties":false}},"properties":{"prop1":{"type":"string"}},"$ref":"#/$defs/A"}')
    const expected = '{"$defs":{"A":{"unevaluatedProperties":false}},"properties":{"prop1":{"type":"string"}},"$ref":"#/$defs/A"}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('naive replacement of $ref with its destination is not correct', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"a_string":{"type":"string"}},"enum":[{"$ref":"#/$defs/a_string"}]}')
    const expected = '{"$defs":{"a_string":{"type":"string"}},"enum":[{"$ref":"#/$defs/a_string"}]}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('refs with relative uris and defs', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://example.com/schema-relative-uri-defs1.json","properties":{"foo":{"$id":"schema-relative-uri-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/$defs/inner"}},"$ref":"schema-relative-uri-defs2.json"}')
    const expected = '{"$id":"http://example.com/schema-relative-uri-defs1.json","properties":{"foo":{"$id":"http://example.com/schema-relative-uri-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/properties/foo/$defs/inner"}},"$ref":"#/properties/foo"}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('relative refs with absolute uris and defs', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://example.com/schema-refs-absolute-uris-defs1.json","properties":{"foo":{"$id":"http://example.com/schema-refs-absolute-uris-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/$defs/inner"}},"$ref":"schema-refs-absolute-uris-defs2.json"}')
    const expected = '{"$id":"http://example.com/schema-refs-absolute-uris-defs1.json","properties":{"foo":{"$id":"http://example.com/schema-refs-absolute-uris-defs2.json","$defs":{"inner":{"properties":{"bar":{"type":"string"}}}},"$ref":"#/properties/foo/$defs/inner"}},"$ref":"#/properties/foo"}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('$id must be resolved against nearest parent, not just immediate parent', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"http://example.com/a.json","$defs":{"x":{"$id":"http://example.com/b/c.json","not":{"$defs":{"y":{"$id":"d.json","type":"number"}}}}},"allOf":[{"$ref":"http://example.com/b/d.json"}]}')
    const expected = '{"$id":"http://example.com/a.json","$defs":{"x":{"$id":"http://example.com/b/c.json","not":{"$defs":{"y":{"$id":"http://example.com/b/d.json","type":"number"}}}}},"allOf":[{"$ref":"#/$defs/x/not/$defs/y"}]}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('order of evaluation: $id and $ref', () => {
    const source = JSON.parse('{"$comment":"$id must be evaluated before $ref to get the proper $ref destination","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/draft2020-12/ref-and-id1/base.json","$ref":"int.json","$defs":{"bigint":{"$comment":"canonical uri: /ref-and-id1/int.json","$id":"int.json","maximum":10},"smallint":{"$comment":"canonical uri: /ref-and-id1-int.json","$id":"/draft2020-12/ref-and-id1-int.json","maximum":2}}}')
    const expected = '{"$id":"/draft2020-12/ref-and-id1/base.json","$ref":"#/$defs/bigint","$defs":{"bigint":{"$id":"draft2020-12/ref-and-id1/int.json","maximum":10},"smallint":{"$id":"draft2020-12/draft2020-12/ref-and-id1-int.json","maximum":2}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('order of evaluation: $id and $anchor and $ref', () => {
    const source = JSON.parse('{"$comment":"$id must be evaluated before $ref to get the proper $ref destination","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"/draft2020-12/ref-and-id2/base.json","$ref":"#bigint","$defs":{"bigint":{"$comment":"canonical uri: /ref-and-id2/base.json/$defs/bigint; another valid uri for this location: /ref-and-id2/base.json#bigint","$anchor":"bigint","maximum":10},"smallint":{"$comment":"canonical uri: /ref-and-id2#/$defs/smallint; another valid uri for this location: /ref-and-id2/#bigint","$id":"/draft2020-12/ref-and-id2/","$anchor":"bigint","maximum":2}}}')
    const expected = '{"$id":"/draft2020-12/ref-and-id2/base.json","$ref":"#/$defs/bigint","$defs":{"bigint":{"maximum":10,"$id":"/draft2020-12/ref-and-id2/base.json#bigint"},"smallint":{"$id":"draft2020-12/draft2020-12/ref-and-id2#bigint","maximum":2}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('simple URN base URI with $ref via the URN', () => {
    const source = JSON.parse('{"$comment":"URIs do not have to have HTTP(s) schemes","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed","minimum":30,"properties":{"foo":{"$ref":"urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed"}}}')
    const expected = '{"$id":"urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed","minimum":30,"properties":{"foo":{"$ref":"#"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('simple URN base URI with JSON pointer', () => {
    const source = JSON.parse('{"$comment":"URIs do not have to have HTTP(s) schemes","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '{"$id":"urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with NSS', () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.2","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:example:1/406/47452/2","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '{"$id":"urn:example:1/406/47452/2","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with r-component', () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.3.1","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:example:foo-bar-baz-qux?+CCResolve:cc=uk","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '{"$id":"urn:example:foo-bar-baz-qux?+CCResolve:cc=uk","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with q-component', () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.3.2","$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:example:weather?=op=map&lat=39.56&lon=-104.85&datetime=1969-07-21T02:56:15Z","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '{"$id":"urn:example:weather?=op=map&lat=39.56&lon=-104.85&datetime=1969-07-21T02:56:15Z","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with f-component', () => {
    const source = JSON.parse('{"$comment":"RFC 8141 §2.3.3, but we don\'t allow fragments","$schema":"https://json-schema.org/draft/2020-12/schema","$ref":"https://json-schema.org/draft/2020-12/schema"}')
    const expected = '{"$ref":"https://json-schema.org/draft/2020-12/schema"}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with URN and JSON pointer ref', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-0000-0000-4321feebdaed","properties":{"foo":{"$ref":"urn:uuid:deadbeef-1234-0000-0000-4321feebdaed#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}')
    const expected = '{"$id":"urn:uuid:deadbeef-1234-0000-0000-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN base URI with URN and anchor ref', () => {
    const source = JSON.parse('{"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed","properties":{"foo":{"$ref":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something"}},"$defs":{"bar":{"$anchor":"something","type":"string"}}}')
    const expected = '{"$id":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed","properties":{"foo":{"$ref":"#/$defs/bar"}},"$defs":{"bar":{"type":"string","$id":"urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })

	test('URN ref with nested pointer ref', () => {
    const source = JSON.parse('{"$ref":"urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed","$defs":{"foo":{"$id":"urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed","$defs":{"bar":{"type":"string"}},"$ref":"#/$defs/bar"}}}')
    const expected = '{"$ref":"#/$defs/foo","$defs":{"foo":{"$id":"urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed","$defs":{"bar":{"type":"string"}},"$ref":"#/$defs/foo/$defs/bar"}}}'
    const target = JSON.stringify(schemas.normalize(source))
    expect(expected).toBe(target)
  })
	})