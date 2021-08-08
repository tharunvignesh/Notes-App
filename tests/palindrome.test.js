const palindrome = require('../utils/for_testing').palindrome

describe('palindrome', () => {
	test('palindrome of a', () => {
		const result = palindrome('a')

		expect(result).toBe('a')
	})

	test('palindrome of react', () => {
		const result = palindrome('react')

		expect(result).toBe('tcaer')
	})

	test('palindrome of releveler', () => {
		const result = palindrome('releveler')

		expect(result).toBe('releveler')
	})

	test('Palindrome of oppo', () => {
		const result = palindrome('oppo')

		expect(result).toBe('oppo')
	})

	test('Palindrome of martian', () => {
		const result = palindrome('martian')

		expect(result).toBe('naitram')
	})
})
