// Import the parseAndModifyAnchorGeneric function
const { parseAndModifyAnchorGeneric } = require('./plugin.js');

describe('parseAndModifyAnchorGeneric - absolute URL', () => {

    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com?', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com?rel', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com?rel=', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });

    it('should parse and modify anchor tags with URL parameters using "?" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com?rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with compatibility "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with multiple delimiters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com#header-1#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should handle multiple query parameters with "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com#a=123#rel=sponsored#target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle multiple URL query parameters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com?a=123&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle malformed query parameters with "&" delimiter without "?', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

});

describe('parseAndModifyAnchorGeneric - absolute URL with trailing slash', () => {

    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/?', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/?rel', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/?rel=', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });

    it('should parse and modify anchor tags with URL parameters using "?" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/?rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with compatibility "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with multiple delimiters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/#header-1#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should handle multiple query parameters with "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/#a=123#rel=sponsored#target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle multiple URL query parameters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/?a=123&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle malformed query parameters with "&" delimiter without "?', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('https://example.com/&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

});

describe('parseAndModifyAnchorGeneric - relative URL', () => {

    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1?', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1?rel', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1?rel=', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });

    it('should parse and modify anchor tags with URL parameters using "?" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/?rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with compatibility "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with multiple delimiters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/#header-1#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should handle multiple query parameters with "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/#a=123#rel=sponsored#target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle multiple URL query parameters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/?a=123&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle malformed query parameters with "&" delimiter without "?', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

});

describe('parseAndModifyAnchorGeneric - relative URL with trailing slash', () => {

    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/?', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/?rel', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });
    it('control case', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1/?rel=', anchor);
        expect(anchor.rel).toBe('');
        expect(anchor.target).toBe('');
    });

    it('should parse and modify anchor tags with URL parameters using "?" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1?rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with compatibility "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should parse and modify anchor tags with multiple delimiters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1#header-1#rel=sponsored', anchor);
        expect(anchor.rel).toBe('sponsored');
    });

    it('should handle multiple query parameters with "#" delimiter', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1#a=123#rel=sponsored#target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle multiple URL query parameters', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1?a=123&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

    it('should handle malformed query parameters with "&" delimiter without "?', () => {
        const anchor = { rel: '', target: '' };
        parseAndModifyAnchorGeneric('page-1&rel=sponsored&target=_blank', anchor);
        expect(anchor.rel).toBe('sponsored');
        expect(anchor.target).toBe('_blank');
    });

});
